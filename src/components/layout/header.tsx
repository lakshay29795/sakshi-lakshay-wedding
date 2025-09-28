'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Script, Text } from '@/components/ui/typography';
import { WeddingButton } from '@/components/ui/wedding-button';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PWAStatusCompact } from '@/components/pwa/PWAStatus';

interface HeaderProps {
  className?: string;
}

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/story', label: 'Our Story' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/rsvp', label: 'RSVP' },
  { href: '/guestbook', label: 'Guest Book' },
  { href: '/notifications', label: 'Notifications' },
];

export function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50'
          : 'bg-transparent',
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Container size="xl" padding="md">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Heart className="h-6 w-6 text-sage-green group-hover:text-gold-accent transition-colors" />
            <div className="flex flex-col">
              <Script size="sm" className="leading-none">
                Sakshi & Lakshay
              </Script>
              <Text size="xs" variant="muted" className="leading-none">
                November 12, 2025
              </Text>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-sage-green transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sage-green transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* PWA Status & RSVP Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <PWAStatusCompact />
            <WeddingButton variant="elegant" size="sm" asChild>
              <Link href="/rsvp">RSVP Now</Link>
            </WeddingButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-sage-green transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Container size="xl" padding="md">
              <nav className="py-4 space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block py-2 text-base font-medium text-foreground hover:text-sage-green transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navigationItems.length * 0.1 }}
                  className="pt-4 border-t border-border/50"
                >
                  <WeddingButton variant="elegant" size="sm" className="w-full" asChild>
                    <Link href="/rsvp" onClick={() => setIsMenuOpen(false)}>
                      RSVP Now
                    </Link>
                  </WeddingButton>
                </motion.div>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
