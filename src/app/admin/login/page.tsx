'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { Container } from '@/components/ui/container';

export default function AdminLoginPage() {
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/admin/auth/me');
        if (response.ok) {
          // Already logged in, redirect to admin dashboard
          router.push('/admin');
        }
      } catch (error) {
        // Not logged in, stay on login page
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleLoginSuccess = (user: any) => {
    console.log('Admin login successful:', user);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-green/5 via-background to-blush-pink/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-subtle-dots opacity-20" />
      
      {/* Content */}
      <div className="relative">
        <Container className="min-h-screen flex items-center justify-center py-12">
          <motion.div
            className="w-full max-w-md"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-serif text-sage-green mb-2">
                Wedding Admin
              </h1>
              <p className="text-muted-foreground">
                Secure access to manage your wedding website
              </p>
            </motion.div>

            {/* Login Form */}
            <motion.div variants={itemVariants}>
              <AdminLoginForm 
                onSuccess={handleLoginSuccess}
                redirectTo="/admin"
              />
            </motion.div>

            {/* Footer */}
            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                Protected by enterprise-grade security
              </p>
              <div className="flex justify-center space-x-4 mt-2 text-xs text-muted-foreground">
                <span>🔒 SSL Encrypted</span>
                <span>🛡️ CSRF Protected</span>
                <span>⚡ Rate Limited</span>
              </div>
            </motion.div>

            {/* Back to Website Link */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-sage-green hover:text-sage-green/80 transition-colors"
              >
                ← Back to Wedding Website
              </a>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}
