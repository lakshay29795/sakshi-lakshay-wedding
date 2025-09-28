export interface GuestMessage {
  id: string;
  guestName: string;
  guestEmail?: string;
  message: string;
  submittedAt: Date;
  updatedAt?: Date;
  status: 'pending' | 'approved' | 'rejected';
  isHighlighted?: boolean;
  likes?: number;
  likedBy?: string[];
  ipAddress?: string;
  userAgent?: string;
}

export interface GuestMessageFormData {
  guestName: string;
  guestEmail?: string;
  message: string;
}

export interface GuestBookStats {
  totalMessages: number;
  approvedMessages: number;
  pendingMessages: number;
  rejectedMessages: number;
  totalLikes: number;
}

export interface GuestBookFilters {
  status?: 'all' | 'approved' | 'pending' | 'rejected';
  sortBy?: 'newest' | 'oldest' | 'mostLiked';
  search?: string;
}

export type MessageStatus = 'pending' | 'approved' | 'rejected';
