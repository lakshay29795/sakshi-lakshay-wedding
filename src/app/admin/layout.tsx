import type { Metadata } from "next";
import { AdminProvider } from '@/components/admin/AdminProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | Wedding Website",
    template: "%s | Admin Dashboard",
  },
  description: "Wedding website administration panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="lg:pl-64">
          {/* Admin Header */}
          <AdminHeader />
          
          {/* Page Content */}
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
        
        {/* Toast Notifications */}
        <Toaster />
      </div>
    </AdminProvider>
  );
}
