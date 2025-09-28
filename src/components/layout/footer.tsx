import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Heading, Text, Script } from '@/components/ui/typography';
import { Heart, Instagram, Facebook, Mail, MapPin, Calendar } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

interface FooterProps {
  className?: string;
}

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/story', label: 'Our Story' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/details', label: 'Wedding Details' },
];

const importantLinks = [
  { href: '/rsvp', label: 'RSVP' },
  { href: '/guestbook', label: 'Guest Book' },
  { href: '/registry', label: 'Registry' },
  { href: '/travel', label: 'Travel Info' },
];

const socialLinks = [
  {
    href: 'https://instagram.com/sarahandmichael',
    label: 'Instagram',
    icon: Instagram,
  },
  {
    href: 'https://facebook.com/sarahandmichael',
    label: 'Facebook',
    icon: Facebook,
  },
  {
    href: 'mailto:hello@sarahandmichael.com',
    label: 'Email',
    icon: Mail,
  },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('bg-sage-green/5 border-t border-border/50', className)}>
      <Section padding="lg">
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <ScrollReveal className="lg:col-span-1">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-sage-green" />
                  <Script size="lg" className="text-sage-green">
                    Sakshi & Lakshay
                  </Script>
                </div>
                <Text variant="muted" className="max-w-sm">
                  Join us as we celebrate our love story and begin our journey as husband and wife.
                </Text>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>November 12, 2025</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Rosewood Manor, CA</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Quick Links */}
            <ScrollReveal delay={0.1}>
              <div className="space-y-4">
                <Heading as="h4" size="h6" variant="romantic">
                  Quick Links
                </Heading>
                <nav className="space-y-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-muted-foreground hover:text-sage-green transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </ScrollReveal>

            {/* Important Links */}
            <ScrollReveal delay={0.2}>
              <div className="space-y-4">
                <Heading as="h4" size="h6" variant="romantic">
                  Wedding Info
                </Heading>
                <nav className="space-y-2">
                  {importantLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-muted-foreground hover:text-sage-green transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </ScrollReveal>

            {/* Social & Contact */}
            <ScrollReveal delay={0.3}>
              <div className="space-y-4">
                <Heading as="h4" size="h6" variant="romantic">
                  Stay Connected
                </Heading>
                <Text size="sm" variant="muted">
                  Follow our journey and share in our special moments.
                </Text>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Link
                        key={social.href}
                        href={social.href}
                        className="p-2 text-muted-foreground hover:text-sage-green transition-colors hover:bg-sage-green/10 rounded-lg"
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Bottom Section */}
          <ScrollReveal delay={0.4}>
            <div className="mt-12 pt-8 border-t border-border/50">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <Text size="sm" variant="muted">
                    © 2024 Sakshi & Lakshay. Made with
                  </Text>
                  <Heart className="h-4 w-4 text-sage-green fill-current" />
                </div>
                <div className="flex items-center space-x-6">
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-sage-green transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-sage-green transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </footer>
  );
}
