'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Heart, Send, Loader2, MessageCircle } from 'lucide-react';
import {
  guestMessageSchema,
  type GuestMessageFormInput,
} from '@/lib/validations/guestbook';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GuestMessageFormProps {
  onSubmit: (data: GuestMessageFormInput) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

export function GuestMessageForm({ 
  onSubmit, 
  isSubmitting = false, 
  className 
}: GuestMessageFormProps) {
  const form = useForm<GuestMessageFormInput>({
    resolver: zodResolver(guestMessageSchema),
    defaultValues: {
      guestName: '',
      guestEmail: '',
      message: '',
    },
  });

  const handleSubmit = async (data: GuestMessageFormInput) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const messageLength = form.watch('message')?.length || 0;
  const maxLength = 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('w-full', className)}
    >
      <Card className="wedding-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-sage-green">
            <MessageCircle className="w-6 h-6" />
            <span>Leave a Message</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Share your love, wishes, and memories with us
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="guestName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-blush-pink" />
                      <span>Your Name *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your name"
                        className="wedding-input"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field (Optional) */}
              <FormField
                control={form.control}
                name="guestEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email Address
                      <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your.email@example.com"
                        className="wedding-input"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      We'll only use this to respond to your message if needed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message Field */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span>Your Message *</span>
                      <span className={cn(
                        'text-xs',
                        messageLength > maxLength * 0.9 
                          ? 'text-rose-gold' 
                          : 'text-muted-foreground'
                      )}>
                        {messageLength}/{maxLength}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Share your love, wishes, memories, or advice for our journey together..."
                        className="wedding-input min-h-[120px] resize-none"
                        disabled={isSubmitting}
                        maxLength={maxLength}
                      />
                    </FormControl>
                    <FormDescription>
                      Your message will be reviewed before appearing on the guest book
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full wedding-button"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending your message...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Guidelines */}
              <div className="mt-6 p-4 bg-sage-green/5 border border-sage-green/20 rounded-lg">
                <h4 className="text-sm font-medium text-sage-green mb-2">
                  Message Guidelines
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Share your genuine thoughts and wishes</li>
                  <li>• Keep messages family-friendly and respectful</li>
                  <li>• Messages are reviewed before being published</li>
                  <li>• We may highlight especially meaningful messages</li>
                </ul>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
