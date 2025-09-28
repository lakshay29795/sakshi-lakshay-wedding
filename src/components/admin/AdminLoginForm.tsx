'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield, 
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AdminLoginFormProps {
  onSuccess?: (user: any) => void;
  redirectTo?: string;
  className?: string;
}

export function AdminLoginForm({ onSuccess, redirectTo = '/admin', className }: AdminLoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Get CSRF token on component mount
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch('/api/admin/auth/csrf');
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.csrfToken);
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchCSRFToken();
  }, []);

  // Handle lockout timer
  useEffect(() => {
    if (lockoutTime && lockoutTime > Date.now()) {
      const timer = setInterval(() => {
        if (Date.now() >= lockoutTime) {
          setIsLocked(false);
          setLockoutTime(null);
          setLoginAttempts(0);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const onSubmit = async (data: LoginFormData) => {
    if (isLocked) {
      toast.error('Account temporarily locked. Please try again later.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Reset login attempts on success
        setLoginAttempts(0);
        setIsLocked(false);
        setLockoutTime(null);

        // Update CSRF token
        if (result.data.csrfToken) {
          setCsrfToken(result.data.csrfToken);
        }

        toast.success('Login successful! Redirecting...');
        
        // Call success callback
        if (onSuccess) {
          onSuccess(result.data.user);
        }

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);

      } else {
        // Handle login failure
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockoutTime(Date.now() + 15 * 60 * 1000); // 15 minutes
          toast.error('Too many failed attempts. Account locked for 15 minutes.');
        } else {
          const remainingAttempts = 5 - newAttempts;
          toast.error(
            result.error || `Login failed. ${remainingAttempts} attempts remaining.`
          );
        }

        // Clear password field
        form.setValue('password', '');
      }

    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRemainingLockoutTime = (): string => {
    if (!lockoutTime) return '';
    
    const remaining = Math.max(0, lockoutTime - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
    <motion.div
      className={`w-full max-w-md mx-auto ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="wedding-card border-sage-green/20 shadow-xl">
        <CardHeader className="text-center">
          <motion.div variants={itemVariants} className="mb-4">
            <div className="relative">
              <Shield className="w-16 h-16 mx-auto text-sage-green" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="w-6 h-6 text-blush-pink" />
              </motion.div>
            </div>
          </motion.div>
          
          <CardTitle className="text-2xl font-serif text-sage-green">
            Admin Login
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Access the wedding administration panel
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* CSRF Token */}
            <input type="hidden" name="_csrf" value={csrfToken} />

            {/* Lockout Warning */}
            <AnimatePresence>
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Account Temporarily Locked</p>
                      <p className="text-sm">
                        Too many failed attempts. Try again in {getRemainingLockoutTime()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Attempts Warning */}
            <AnimatePresence>
              {loginAttempts > 0 && loginAttempts < 5 && !isLocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2 text-amber-700">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">
                      {5 - loginAttempts} attempts remaining before account lockout
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sage-green" />
                <span>Email Address</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                disabled={isLoading || isLocked}
                className="wedding-input"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-sage-green" />
                <span>Password</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  disabled={isLoading || isLocked}
                  className="wedding-input pr-10"
                  {...form.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading || isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Remember Me */}
            <motion.div variants={itemVariants} className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                disabled={isLoading || isLocked}
                checked={form.watch('rememberMe')}
                onCheckedChange={(checked) => form.setValue('rememberMe', !!checked)}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                Remember me for 7 days
              </Label>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isLoading || isLocked}
                className="w-full wedding-button"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign In to Admin Panel
                  </>
                )}
              </Button>
            </motion.div>

            {/* Security Notice */}
            <motion.div variants={itemVariants}>
              <div className="p-3 bg-sage-green/5 border border-sage-green/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-sage-green mt-0.5" />
                  <div className="text-xs text-sage-green">
                    <p className="font-medium mb-1">Secure Login</p>
                    <ul className="space-y-1">
                      <li>• End-to-end encryption</li>
                      <li>• Rate limiting protection</li>
                      <li>• CSRF token validation</li>
                      <li>• Session timeout after inactivity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
