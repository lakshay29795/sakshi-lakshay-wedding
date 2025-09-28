import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  writeBatch,
  onSnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db, COLLECTIONS, createConverter, handleFirebaseError } from '@/lib/firebase/config';
import type { RSVPFormData, RSVPSubmission, RSVPStats, Guest } from '@/types/rsvp';

// Firestore converters
const rsvpConverter = createConverter<RSVPSubmission>();
const guestConverter = createConverter<Guest>();

// RSVP Service Class
export class RSVPService {
  private rsvpCollection = collection(db, COLLECTIONS.RSVPS).withConverter(rsvpConverter);
  private guestCollection = collection(db, COLLECTIONS.GUESTS).withConverter(guestConverter);

  /**
   * Submit a new RSVP
   */
  async submitRSVP(formData: RSVPFormData): Promise<{ success: true; id: string } | { success: false; error: string }> {
    try {
      const rsvpData: Omit<RSVPSubmission, 'id'> = {
        ...formData,
        status: formData.isAttending ? 'confirmed' : 'declined',
        submittedAt: new Date(),
        updatedAt: new Date(),
      };

      // Use batch write to ensure atomicity
      const batch = writeBatch(db);

      // Add RSVP document
      const rsvpRef = doc(this.rsvpCollection);
      batch.set(rsvpRef, rsvpData);

      // Add individual guest documents for attending guests
      if (formData.isAttending && formData.guests) {
        for (const guest of formData.guests) {
          const guestRef = doc(this.guestCollection);
          batch.set(guestRef, {
            ...guest,
            rsvpId: rsvpRef.id,
            submittedAt: new Date(),
          });
        }
      }

      await batch.commit();

      return { success: true, id: rsvpRef.id };
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      return { success: false, error: handleFirebaseError(error) };
    }
  }

  /**
   * Update an existing RSVP
   */
  async updateRSVP(
    rsvpId: string, 
    updates: Partial<RSVPFormData>
  ): Promise<{ success: true } | { success: false; error: string }> {
    try {
      const rsvpRef = doc(this.rsvpCollection, rsvpId);
      
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      await updateDoc(rsvpRef, updateData);

      return { success: true };
    } catch (error) {
      console.error('Error updating RSVP:', error);
      return { success: false, error: handleFirebaseError(error) };
    }
  }

  /**
   * Get RSVP by ID
   */
  async getRSVP(rsvpId: string): Promise<RSVPSubmission | null> {
    try {
      const rsvpRef = doc(this.rsvpCollection, rsvpId);
      const rsvpSnap = await getDoc(rsvpRef);

      if (rsvpSnap.exists()) {
        return rsvpSnap.data();
      }

      return null;
    } catch (error) {
      console.error('Error getting RSVP:', error);
      throw new Error(handleFirebaseError(error));
    }
  }

  /**
   * Get RSVP by email
   */
  async getRSVPByEmail(email: string): Promise<RSVPSubmission | null> {
    try {
      const q = query(
        this.rsvpCollection,
        where('primaryGuestEmail', '==', email),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }

      return null;
    } catch (error) {
      console.error('Error getting RSVP by email:', error);
      throw new Error(handleFirebaseError(error));
    }
  }

  /**
   * Get all RSVPs with pagination
   */
  async getAllRSVPs(
    pageSize: number = 50,
    lastDoc?: DocumentSnapshot
  ): Promise<{
    rsvps: RSVPSubmission[];
    hasMore: boolean;
    lastDoc?: DocumentSnapshot;
  }> {
    try {
      let q = query(
        this.rsvpCollection,
        orderBy('submittedAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const rsvps = querySnapshot.docs.map(doc => doc.data());
      const hasMore = querySnapshot.docs.length === pageSize;
      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        rsvps,
        hasMore,
        lastDoc: newLastDoc,
      };
    } catch (error) {
      console.error('Error getting all RSVPs:', error);
      throw new Error(handleFirebaseError(error));
    }
  }

  /**
   * Get RSVP statistics
   */
  async getRSVPStats(): Promise<RSVPStats> {
    try {
      const querySnapshot = await getDocs(this.rsvpCollection);
      const rsvps = querySnapshot.docs.map(doc => doc.data());

      const stats: RSVPStats = {
        totalInvited: 0, // This would come from a separate invitations collection
        totalResponded: rsvps.length,
        totalAttending: 0,
        totalDeclined: 0,
        responseRate: 0,
        mealBreakdown: {
          regular: 0,
          vegetarian: 0,
          vegan: 0,
          'gluten-free': 0,
        },
        childrenCount: 0,
        adultsCount: 0,
      };

      // Calculate statistics
      for (const rsvp of rsvps) {
        if (rsvp.isAttending) {
          stats.totalAttending++;
          
          // Count meal preferences
          if (rsvp.guests) {
            for (const guest of rsvp.guests) {
              stats.mealBreakdown[guest.mealPreference]++;
              
              if (guest.isChild) {
                stats.childrenCount++;
              } else {
                stats.adultsCount++;
              }
            }
          }
        } else {
          stats.totalDeclined++;
        }
      }

      // Calculate response rate (assuming total invited is available)
      if (stats.totalInvited > 0) {
        stats.responseRate = (stats.totalResponded / stats.totalInvited) * 100;
      }

      return stats;
    } catch (error) {
      console.error('Error getting RSVP stats:', error);
      throw new Error(handleFirebaseError(error));
    }
  }

  /**
   * Delete RSVP
   */
  async deleteRSVP(rsvpId: string): Promise<{ success: true } | { success: false; error: string }> {
    try {
      const batch = writeBatch(db);

      // Delete RSVP document
      const rsvpRef = doc(this.rsvpCollection, rsvpId);
      batch.delete(rsvpRef);

      // Delete associated guest documents
      const guestQuery = query(this.guestCollection, where('rsvpId', '==', rsvpId));
      const guestSnapshot = await getDocs(guestQuery);
      
      guestSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      return { success: true };
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      return { success: false, error: handleFirebaseError(error) };
    }
  }

  /**
   * Subscribe to RSVP changes (real-time updates)
   */
  subscribeToRSVPs(
    callback: (rsvps: RSVPSubmission[]) => void,
    errorCallback?: (error: Error) => void
  ): () => void {
    const q = query(this.rsvpCollection, orderBy('submittedAt', 'desc'));

    return onSnapshot(
      q,
      (querySnapshot) => {
        const rsvps = querySnapshot.docs.map(doc => doc.data());
        callback(rsvps);
      },
      (error) => {
        console.error('Error in RSVP subscription:', error);
        if (errorCallback) {
          errorCallback(new Error(handleFirebaseError(error)));
        }
      }
    );
  }

  /**
   * Search RSVPs by name or email
   */
  async searchRSVPs(searchTerm: string): Promise<RSVPSubmission[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation that searches by exact email match
      // For better search, consider using Algolia or similar service
      
      const emailQuery = query(
        this.rsvpCollection,
        where('primaryGuestEmail', '>=', searchTerm.toLowerCase()),
        where('primaryGuestEmail', '<=', searchTerm.toLowerCase() + '\uf8ff')
      );

      const nameQuery = query(
        this.rsvpCollection,
        where('primaryGuestName', '>=', searchTerm),
        where('primaryGuestName', '<=', searchTerm + '\uf8ff')
      );

      const [emailResults, nameResults] = await Promise.all([
        getDocs(emailQuery),
        getDocs(nameQuery)
      ]);

      const emailRSVPs = emailResults.docs.map(doc => doc.data());
      const nameRSVPs = nameResults.docs.map(doc => doc.data());

      // Combine and deduplicate results
      const allRSVPs = [...emailRSVPs, ...nameRSVPs];
      const uniqueRSVPs = allRSVPs.filter((rsvp, index, self) => 
        index === self.findIndex(r => r.id === rsvp.id)
      );

      return uniqueRSVPs;
    } catch (error) {
      console.error('Error searching RSVPs:', error);
      throw new Error(handleFirebaseError(error));
    }
  }
}

// Export singleton instance
export const rsvpService = new RSVPService();
