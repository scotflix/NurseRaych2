import { useState, useEffect } from 'react';
import { Heart, Users, Award, ChevronDown, TrendingUp } from 'lucide-react';
import { useDonationStats } from '@/hooks/useDonationStats';

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const stats = useDonationStats();

  // Typing effect state
  const fullQuote = 'Every underserved voice deserves the right to understand and access healthcare.';
  const [typedQuote, setTypedQuote] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Run typing animation once visible
  useEffect(() => {
    if (isVisible) {
      let i = 0;
      const typingInterval = setInterval(() => {
        setTypedQuote(fullQuote.slice(0, i + 1));
        i++;
        if (i === fullQuote.length) {
          clearInterval(typingInterval);
        }
      }, 40);
      return () => clearInterval(typingInterval);
    }
  }, [isVisible]);

  const scrollToNext = () => {
    document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-80 animate-pulse overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/image5.jpeg`}
          alt="Decorative element"
          className="w-full h-full object-cover mix-blend-screen"
        />
      </div>

      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full opacity-80 animate-pulse delay-1000 overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/image6.png`}
          alt="Decorative element"
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Hero Image */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-80 h-80 mx-auto rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center relative border-4 border-white/20">
              <img
                src={`${import.meta.env.BASE_URL}images/image1.jpeg`}
                alt="Nurse Raych"
                className="w-full h-full object-center"
              />
            </div>
          </div>
        </div>

        {/* Typing Effect Quote */}
        <div className={`mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl max-w-4xl mx-auto hover:bg-white/15 transition-all duration-300">
            <blockquote className="text-2xl md:text-4xl font-bold text-white leading-relaxed mb-6">
              {typedQuote}
              <span className="inline-block w-2 h-6 bg-white ml-1 animate-pulse"></span>
            </blockquote>
            <cite className="text-xl text-cyan-300 font-semibold">— Nurse Raych</cite>
          </div>
        </div>

        {/* Description */}
        <div className={`mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Meet the visionary behind our mission. A nurse, educator, and relentless advocate for equitable care.
          </p>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Lives Touched */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 relative group">
            <Heart className="w-8 h-8 text-pink-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
              {stats.isLoading ? (
                <div className="animate-pulse bg-white/20 rounded h-8 w-20"></div>
              ) : (
                <>
                  {formatNumber(stats.livesTouched)}
                  {!stats.isLoading && <TrendingUp className="w-4 h-4 text-green-400 ml-2 animate-pulse" />}
                </>
              )}
            </div>
            <div className="text-white/80">Lives Touched</div>
            {!stats.isLoading && <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Updates with each donation: $10 = 1 life
            </div>
          </div>

          {/* Communities Served */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 relative group">
            <Users className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
              {stats.isLoading ? (
                <div className="animate-pulse bg-white/20 rounded h-8 w-16"></div>
              ) : (
                <>
                  {stats.communitiesServed}
                  {!stats.isLoading && <TrendingUp className="w-4 h-4 text-green-400 ml-2 animate-pulse" />}
                </>
              )}
            </div>
            <div className="text-white/80">Communities Served</div>
            {!stats.isLoading && <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Auto-calculated: 5,000 lives = 1 community
            </div>
          </div>

          {/* Years of Impact */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 relative group">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">{stats.yearsOfImpact}</div>
            <div className="text-white/80">Years of Impact</div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Since 2025 - Updates automatically each year
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {!stats.isLoading && stats.totalDonations > 0 && (
          <div className={`mb-8 transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="backdrop-blur-md bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-2xl p-4 border border-white/20 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-6 text-sm text-white/90">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span>{stats.totalDonations} donations received</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                  <span>${stats.totalAmount.toFixed(0)} raised</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {stats.error && (
          <div className="mb-8 max-w-md mx-auto">
            <div className="backdrop-blur-md bg-red-500/20 rounded-2xl p-4 border border-red-500/30 text-center">
              <p className="text-red-200 text-sm">
                Stats temporarily unavailable - showing base numbers
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className={`mb-12 transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button
            onClick={scrollToNext}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:from-purple-600 hover:to-cyan-600"
          >
            Learn More About Nurse Raych
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className={`transition-all duration-1000 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button
            onClick={scrollToNext}
            className="text-white/60 hover:text-white transition-colors animate-bounce"
            aria-label="Scroll to next section"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </div>
    </section>
  );
}
