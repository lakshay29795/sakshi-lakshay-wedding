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
  { href: '/interactive', label: 'Interactive' },
  { href: '/daily-reveals', label: 'Daily Reveals' },
  { href: '/secrets', label: 'Secrets' },
  { href: '/dreams', label: 'Dreams' },
  // { href: '/rsvp', label: 'RSVP' },
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
          ? 'romantic-glass shadow-romantic-soft border-b border-romantic-rose/20'
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
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="h-6 w-6 text-romantic-rose-dark fill-current group-hover:text-romantic-gold transition-colors" />
            </motion.div>
            <div className="flex flex-col">
              <span className="romantic-script text-lg leading-none text-romantic-charcoal">
                Sakshi & Lakshay
              </span>
              {/* <span className="romantic-body-text text-xs leading-none text-romantic-charcoal-light">
                November 12, 2025
              </span> */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="romantic-body-text text-sm font-medium text-romantic-charcoal hover:text-romantic-rose-dark transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-romantic-rose to-romantic-lavender transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </nav>

          {/* PWA Status (Desktop) */}
          {/* <div className="hidden md:flex items-center">
            <PWAStatusCompact />
          </div> */}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-romantic-charcoal hover:text-romantic-rose-dark transition-colors"
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
            className="md:hidden absolute top-full left-0 right-0 romantic-glass border-b border-romantic-rose/20 shadow-romantic-soft"
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
                      className="block py-2 romantic-body-text text-base font-medium text-romantic-charcoal hover:text-romantic-rose-dark transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
