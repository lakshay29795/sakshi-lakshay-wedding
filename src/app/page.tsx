import Link from 'next/link';
import { Heart, Sparkles, Calendar, Gift, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-rose-50">
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
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#themes" className="text-gray-700 hover:text-rose-600 transition">
                Themes
              </Link>
              <Link href="#features" className="text-gray-700 hover:text-rose-600 transition">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-rose-600 transition">
                Pricing
              </Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-rose-600 transition">
                How It Works
              </Link>
            </div>
            <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Animated hearts background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 text-rose-200 opacity-20 animate-pulse">
              <Heart className="h-16 w-16 fill-current" />
            </div>
            <div className="absolute top-40 right-20 text-pink-200 opacity-20 animate-pulse delay-100">
              <Heart className="h-12 w-12 fill-current" />
            </div>
            <div className="absolute bottom-40 left-1/4 text-red-200 opacity-20 animate-pulse delay-200">
              <Heart className="h-20 w-20 fill-current" />
            </div>
          </div>

          <div className="relative z-10">
            <Badge className="mb-6 bg-rose-100 text-rose-700 border-rose-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Perfect for Valentine's Day 2025
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Give More Than Flowers
            </h1>
            
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-6">
              Give Them a Love Story They Can Keep Forever
            </h2>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Create a stunning, personalized website that celebrates your unique love story. 
              Choose from 3 beautiful themes, add your photos and memories, and launch in just 48 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-lg"
                asChild
              >
                <Link href="#themes">
                  Explore Themes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-rose-300 text-rose-600 hover:bg-rose-50 text-lg"
                asChild
              >
                <Link href="#how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>No Coding Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Mobile Responsive</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>48-Hour Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section id="themes" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Choose Your Perfect Theme
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each theme is beautifully designed and fully customizable. Pick the one that best represents your love story.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Classic Romance Theme */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-rose-300 overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-red-100 via-rose-100 to-pink-100 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="h-24 w-24 text-rose-500 fill-rose-500 mx-auto mb-4 group-hover:scale-110 transition" />
                    <div className="text-4xl font-serif text-rose-800">Classic Romance</div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Classic Romance</h3>
                  <p className="text-gray-600">Elegant & Timeless</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">Traditional</Badge>
                  <Badge variant="secondary">Elegant</Badge>
                  <Badge variant="secondary">Sophisticated</Badge>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  Perfect for formal couples who love classic romance. Features vintage styling, 
                  rose petals, and golden accents.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Vintage Timeline</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Classic Gallery with Gold Frames</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Love Letter Section</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-rose-500 to-red-500" asChild>
                    <Link href="/demo/classic-romance">
                      View Full Demo
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full border-rose-300" asChild>
                    <Link href="/pricing?theme=classic">
                      Choose This Theme
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Modern Elegance Theme */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-pink-300 overflow-hidden relative">
              <Badge className="absolute top-4 right-4 z-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                Most Popular
              </Badge>
              <div className="relative h-64 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="h-24 w-24 text-pink-500 mx-auto mb-4 group-hover:scale-110 transition" />
                    <div className="text-4xl font-sans text-pink-800">Modern Elegance</div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Modern Elegance</h3>
                  <p className="text-gray-600">Clean & Minimalist</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">Contemporary</Badge>
                  <Badge variant="secondary">Sleek</Badge>
                  <Badge variant="secondary">Minimal</Badge>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  For tech-savvy couples with modern taste. Features clean design, 
                  gradients, and smooth animations.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Horizontal Scrolling Timeline</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Instagram-Style Gallery</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Video Message Player</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500" asChild>
                    <Link href="/demo/modern-elegance">
                      View Full Demo
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full border-pink-300" asChild>
                    <Link href="/pricing?theme=modern">
                      Choose This Theme
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Playful Love Theme */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-yellow-300 overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Gift className="h-24 w-24 text-orange-500 mx-auto mb-4 group-hover:scale-110 transition animate-bounce" />
                    <div className="text-4xl font-bold text-orange-800">Playful Love</div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Playful Love</h3>
                  <p className="text-gray-600">Fun & Energetic</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">Quirky</Badge>
                  <Badge variant="secondary">Colorful</Badge>
                  <Badge variant="secondary">Fun</Badge>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  For young couples with vibrant personalities. Features bright colors, 
                  playful animations, and interactive games.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Comic-Style Love Story</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Fun Photo Booth with Filters</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Relationship Games & Quizzes</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500" asChild>
                    <Link href="/demo/playful-love">
                      View Full Demo
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full border-yellow-300" asChild>
                    <Link href="/pricing?theme=playful">
                      Choose This Theme
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Everything You Need to Tell Your Story
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every theme includes these powerful features to make your love story unforgettable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-gray-600">
              From selection to launch in just a few days
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-6 bg-white p-8 rounded-xl shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <div className="text-sm text-rose-600 font-medium">{step.duration}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600" asChild>
              <Link href="/pricing">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Create Something Unforgettable?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of couples creating unique Valentine's gifts this year
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg" asChild>
              <Link href="#themes">
                View All Themes
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg border-2 border-white text-white hover:bg-white/10" asChild>
              <Link href="/pricing">
                See Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                <span className="text-xl font-bold text-white">LoveStory Sites</span>
              </div>
              <p className="text-sm">
                Creating unforgettable Valentine's gifts since 2025
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Themes</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/demo/classic-romance" className="hover:text-rose-400">Classic Romance</Link></li>
                <li><Link href="/demo/modern-elegance" className="hover:text-rose-400">Modern Elegance</Link></li>
                <li><Link href="/demo/playful-love" className="hover:text-rose-400">Playful Love</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pricing" className="hover:text-rose-400">Pricing</Link></li>
                <li><Link href="#how-it-works" className="hover:text-rose-400">How It Works</Link></li>
                <li><Link href="#features" className="hover:text-rose-400">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>hello@lovestorysites.com</li>
                <li>Support available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 LoveStory Sites. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Heart,
    title: 'Personalized Hero Section',
    description: 'Beautiful greeting with your names and photos that sets the romantic tone',
    color: 'bg-gradient-to-br from-rose-500 to-pink-500'
  },
  {
    icon: Calendar,
    title: 'Interactive Timeline',
    description: 'Showcase your relationship journey with dates, photos, and stories',
    color: 'bg-gradient-to-br from-purple-500 to-indigo-500'
  },
  {
    icon: Sparkles,
    title: 'Photo Gallery',
    description: 'Display unlimited memories in a beautiful, responsive gallery',
    color: 'bg-gradient-to-br from-yellow-500 to-orange-500'
  },
  {
    icon: Gift,
    title: 'Daily Love Reveals',
    description: '14 days of surprises leading up to Valentine\'s Day',
    color: 'bg-gradient-to-br from-red-500 to-rose-500'
  },
  {
    icon: Heart,
    title: 'Love Letter Section',
    description: 'Express your feelings with beautiful typography and styling',
    color: 'bg-gradient-to-br from-pink-500 to-red-500'
  },
  {
    icon: Sparkles,
    title: 'Video Messages',
    description: 'Add personal video messages that play throughout the site',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
  },
];

const steps = [
  {
    number: '1',
    title: 'Choose Your Theme',
    description: 'Browse our three beautiful themes and pick the one that resonates with your relationship style. View full demos to see all features in action.',
    duration: '5 minutes'
  },
  {
    number: '2',
    title: 'Provide Your Content',
    description: 'Fill out our simple questionnaire with your love story details, upload photos, write messages, and share your special moments.',
    duration: '1-2 hours'
  },
  {
    number: '3',
    title: 'We Build Your Site',
    description: 'Our team customizes your chosen theme with your content, ensuring every detail is perfect. You\'ll receive a preview link to review.',
    duration: '24-48 hours'
  },
  {
    number: '4',
    title: 'Launch & Share',
    description: 'Once approved, your site goes live! Share the link with your valentine on the special day and watch their reaction.',
    duration: 'Instant'
  },
];
