'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Heart, Sparkles, Zap, Crown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                LoveStory Sites
              </span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-rose-100 text-rose-700 border-rose-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Simple, Transparent Pricing
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Choose Your Perfect Package
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              All packages include your choice of theme and full customization. No hidden fees, ever.
            </p>

            <div className="inline-flex items-center gap-4 px-6 py-3 bg-green-50 border-2 border-green-200 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Valentine's Day Special: Launch within 48 hours! 
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Package */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full border-2 border-gray-200 hover:border-pink-300 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="text-center pb-8 pt-8 bg-gradient-to-br from-gray-50 to-gray-100">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                  <p className="text-gray-600 mb-6">Perfect for simple gifts</p>
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    $49
                  </div>
                  <p className="text-sm text-gray-600">One-time payment</p>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-4 mb-8">
                    {basicFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800" asChild>
                    <Link href="#contact">
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Package - Most Popular */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1">
                <Zap className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
              <Card className="h-full border-4 border-pink-400 shadow-2xl transform md:scale-105">
                <CardHeader className="text-center pb-8 pt-10 bg-gradient-to-br from-pink-50 to-purple-50">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-pink-500" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                  <p className="text-gray-600 mb-6">Best value for couples</p>
                  <div className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    $99
                  </div>
                  <p className="text-sm text-gray-600">One-time payment</p>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-4 mb-8">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold" size="lg" asChild>
                    <Link href="#contact">
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Ultimate Package */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full border-2 border-amber-300 hover:border-amber-400 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="text-center pb-8 pt-8 bg-gradient-to-br from-amber-50 to-yellow-50">
                  <Crown className="h-12 w-12 mx-auto mb-4 text-amber-500" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ultimate</h3>
                  <p className="text-gray-600 mb-6">Everything + VIP treatment</p>
                  <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                    $199
                  </div>
                  <p className="text-sm text-gray-600">One-time payment</p>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-4 mb-8">
                    {ultimateFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold" asChild>
                    <Link href="#contact">
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Optional Add-Ons</h2>
            <p className="text-xl text-gray-600">Enhance your website with these extras</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {addOns.map((addon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <addon.icon className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{addon.name}</h3>
                        <span className="text-lg font-bold text-pink-600">{addon.price}</span>
                      </div>
                      <p className="text-gray-600">{addon.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Feature Comparison</h2>
            <p className="text-xl text-gray-600">See what's included in each package</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-pink-50 to-purple-50">
                  <tr>
                    <th className="text-left p-4 font-bold text-gray-900">Feature</th>
                    <th className="text-center p-4 font-bold text-gray-600">Basic</th>
                    <th className="text-center p-4 font-bold text-pink-600 bg-pink-50">Premium</th>
                    <th className="text-center p-4 font-bold text-amber-600">Ultimate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-4 text-gray-900">{feature.name}</td>
                      <td className="p-4 text-center">
                        {renderFeatureValue(feature.basic)}
                      </td>
                      <td className="p-4 text-center bg-pink-50/50">
                        {renderFeatureValue(feature.premium)}
                      </td>
                      <td className="p-4 text-center">
                        {renderFeatureValue(feature.ultimate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create Your Love Story Website?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get in touch and we'll create something unforgettable together
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-bold mb-2">📧 Email Us</h3>
                  <p className="opacity-90">hello@lovestorysites.com</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">💬 Live Chat</h3>
                  <p className="opacity-90">Available 24/7</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg" asChild>
                <Link href="/">
                  View Theme Demos
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-2 border-white text-white hover:bg-white/10" asChild>
                <Link href="/#how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function renderFeatureValue(value: string | boolean | number) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <span className="text-gray-300">—</span>
    );
  }
  return <span className="font-medium text-gray-900">{value}</span>;
}

const basicFeatures = [
  'Choice of 1 theme',
  'Up to 5 pages/sections',
  'Up to 20 photos',
  'Basic features (hero, gallery, timeline)',
  'Mobile responsive design',
  'Standard delivery (5-7 days)',
  'Hosted for 1 year',
  'Email support',
];

const premiumFeatures = [
  'Everything in Basic, plus:',
  'Up to 10 pages/sections',
  'Up to 50 photos',
  'Advanced features (videos, music, maps)',
  'All interactive elements',
  'Priority support',
  'Fast delivery (3-5 days)',
  'Hosted for 2 years',
  'Minor customizations included',
  'One round of revisions',
];

const ultimateFeatures = [
  'Everything in Premium, plus:',
  'Unlimited pages/sections',
  'Unlimited photos & videos',
  'All premium features',
  'Custom domain included',
  'White-glove service',
  'Rush delivery (48 hours)',
  'Hosted for 5 years',
  'Full customization',
  'Video consultation',
  'Unlimited revisions',
  'Priority 24/7 support',
];

const addOns = [
  {
    icon: Heart,
    name: 'Custom Domain',
    price: '+$25/year',
    description: 'Get your own domain like yournames.com',
  },
  {
    icon: Sparkles,
    name: 'Additional Theme',
    price: '+$30',
    description: 'Add a second theme variation',
  },
  {
    icon: Zap,
    name: 'Rush Delivery (24h)',
    price: '+$50',
    description: 'Need it ASAP? We got you!',
  },
  {
    icon: Heart,
    name: 'Video Editing Service',
    price: '+$40',
    description: 'Professional editing for your video clips',
  },
];

const comparisonFeatures = [
  { name: 'Theme Selection', basic: '1 theme', premium: '1 theme', ultimate: '1 theme + variations' },
  { name: 'Number of Pages', basic: '5', premium: '10', ultimate: 'Unlimited' },
  { name: 'Photos', basic: '20', premium: '50', ultimate: 'Unlimited' },
  { name: 'Videos', basic: false, premium: true, ultimate: true },
  { name: 'Music/Audio', basic: false, premium: true, ultimate: true },
  { name: 'Interactive Map', basic: false, premium: true, ultimate: true },
  { name: 'Custom Domain', basic: false, premium: false, ultimate: true },
  { name: 'Delivery Time', basic: '5-7 days', premium: '3-5 days', ultimate: '48 hours' },
  { name: 'Hosting Duration', basic: '1 year', premium: '2 years', ultimate: '5 years' },
  { name: 'Revisions', basic: 'None', premium: '1 round', ultimate: 'Unlimited' },
  { name: 'Support', basic: 'Email', premium: 'Priority', ultimate: '24/7 VIP' },
];

const faqs = [
  {
    question: 'How long does it take to create my website?',
    answer: 'Delivery time depends on your package: Basic (5-7 days), Premium (3-5 days), Ultimate (48 hours). We can also offer rush delivery for an additional fee.',
  },
  {
    question: 'Can I switch themes after selecting one?',
    answer: 'Yes! You can switch themes during the initial design phase at no extra cost. After the website is launched, theme changes can be made for a small fee.',
  },
  {
    question: 'What if I need more photos than my package allows?',
    answer: 'No problem! You can upgrade your package or add additional photo capacity for just $10 per 10 extra photos.',
  },
  {
    question: 'Do I need technical skills to use the website?',
    answer: 'Not at all! We build everything for you. You just provide the content (photos, text, stories) and we handle all the technical work.',
  },
  {
    question: 'Can I update the website after it\'s launched?',
    answer: 'Yes! Premium and Ultimate packages include minor updates. For larger changes, we offer maintenance packages starting at $20/month.',
  },
  {
    question: 'What happens after the hosting period ends?',
    answer: 'You\'ll receive a reminder 30 days before expiration. You can renew hosting for $25/year or download all your content.',
  },
];

