import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { BookOpen, Languages, Moon, Sun, ArrowRight, Globe, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="font-scripture text-lg font-bold text-primary-foreground">א</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground">AlephBible</span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              <Link to="/read">
                <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Reading
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-8 animate-fade-up">
              <Globe className="w-4 h-4" />
              <span>25+ Languages • Side-by-Side Reading</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Scripture in Two Languages,
              <br />
              <span className="text-gold">One Beautiful Experience</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              A modern bilingual Bible reader with synchronized navigation, RTL support for Arabic & Hebrew, and elegant typography designed for deep study.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/read">
                <Button size="lg" className="w-full sm:w-auto rounded-xl bg-white text-primary hover:bg-white/90 font-semibold px-8">
                  Open Reader
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" className="w-full sm:w-auto rounded-xl bg-white/20 backdrop-blur-sm border border-white/50 text-white hover:bg-white/30 font-semibold px-8">
                Learn More
              </Button>
            </div>
          </div>

          {/* Preview Card */}
          <div className="mt-16 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass-card p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* English Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-semibold text-primary">English (KJV)</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="verse-pill">1</span>
                    <p className="font-scripture text-foreground leading-relaxed">
                      In the beginning God created the heaven and the earth.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="verse-pill">2</span>
                    <p className="font-scripture text-foreground leading-relaxed">
                      And the earth was without form, and void; and darkness <em>was</em> upon the face of the deep.
                    </p>
                  </div>
                </div>

                {/* Arabic Column */}
                <div className="space-y-4 text-right border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-6">
                  <div className="flex items-center justify-end gap-2 mb-4">
                    <span className="text-sm font-semibold text-primary">العربية</span>
                  </div>
                  <div className="flex flex-row-reverse gap-3">
                    <span className="verse-pill">١</span>
                    <p className="font-scripture text-foreground leading-relaxed" dir="rtl">
                      فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ.
                    </p>
                  </div>
                  <div className="flex flex-row-reverse gap-3">
                    <span className="verse-pill">٢</span>
                    <p className="font-scripture text-foreground leading-relaxed" dir="rtl">
                      وَكَانَتِ الأَرْضُ خَرِبَةً وَخَالِيَةً، وَعَلَى وَجْهِ الْغَمْرِ ظُلْمَةٌ.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Designed for Deep Study
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature crafted to enhance your scripture reading experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="feature-card">
              <div className="feature-icon">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Bilingual Reading
              </h3>
              <p className="text-muted-foreground">
                Read two translations side by side with synchronized verse navigation
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                RTL Support
              </h3>
              <p className="text-muted-foreground">
                Native support for right-to-left languages like Arabic, Hebrew, and Farsi
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Fast & Modern
              </h3>
              <p className="text-muted-foreground">
                Lightning-fast navigation with a clean, distraction-free interface
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Start Your Journey
            </h2>
            <p className="text-muted-foreground mb-8">
              Experience scripture in a new way with our beautiful bilingual reader
            </p>
            <Link to="/read">
              <Button size="lg" className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                Open Reader
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-scripture text-sm font-bold text-primary-foreground">א</span>
              </div>
              <span className="font-display text-lg font-semibold">AlephBible</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 AlephBible. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
