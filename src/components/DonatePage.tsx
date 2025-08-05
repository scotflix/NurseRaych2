import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Droplets,
  BookOpen,
  Bus,
  HeartHandshake,
  Play,
  Quote,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const donationTiers = [
  {
    amount: '$5',
    title: 'Protect a Family',
    description: 'Support safe water and soap for basic hygiene needs',
    icon: Droplets,
    gradient: 'from-cyan-500 to-blue-500',
    impact: 'Helps 1 family stay healthy for a month',
  },
  {
    amount: '$10',
    title: 'Educate a Classroom',
    description: 'Print illustrated health education posters',
    icon: BookOpen,
    gradient: 'from-purple-500 to-pink-500',
    impact: 'Reaches 30+ students with vital health knowledge',
  },
  {
    amount: '$25',
    title: 'Send a Mobile Clinic Out',
    description: 'Sponsor a full day of community health outreach',
    icon: Bus,
    gradient: 'from-pink-500 to-purple-500',
    impact: 'Serves an entire village for one day',
  },
  {
    amount: '$50+',
    title: 'Save a Life',
    description: 'Fund a complete first aid kit for emergency care',
    icon: HeartHandshake,
    gradient: 'from-purple-500 to-cyan-500',
    impact: 'Provides life-saving emergency supplies',
  },
];

const testimonials = [
  {
    quote: "Nurse Raych's program helped me understand my pregnancy better. My baby was born healthy because of the knowledge I gained.",
    author: 'Grace Wanjiku',
    role: 'Mother of Two',
    avatar: '👩🏾',
  },
  {
    quote: "At 70 years old, I thought I knew everything about health. Nurse Raych taught me things that could have saved my husband.",
    author: 'Mama Sarah',
    role: 'Village Elder',
    avatar: '👵🏿',
  },
  {
    quote: "Every donation, no matter how small, creates ripples of change. Together, we're building healthier communities.",
    author: 'Nurse Raych',
    role: 'Founder & Community Health Advocate',
    avatar: '👩🏽‍⚕️',
  },
];

interface YouTubeInlinePlayerProps {
  videoId: string; // e.g. "dQw4w9WgXcQ"
  title?: string;
  subtitle?: string;
} 

export function YouTubeInlinePlayer({
  videoId,
  title = 'Watch My Video',
  subtitle = 'Thank You From Nurse Raych',
}: YouTubeInlinePlayerProps) {
  const [playing, setPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setPlaying(true);
    }
  };

  return (
    <div className="text-center max-w-lg mx-auto">
      <div className="w-full mb-2">
        {!playing ? (
          <div
            role="button"
            aria-label="Play video"
            tabIndex={0}
            onClick={() => setPlaying(true)}
            onKeyDown={handleKeyDown}
            className="relative cursor-pointer rounded overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400"
          >
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <img
                src={thumbnailUrl}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-2">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded overflow-hidden shadow-lg" style={{ paddingTop: '56.25%' }}>
            <iframe
              title="YouTube video player"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
            ></iframe>
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-white/80">{subtitle}</p>
    </div>
  );
}

export function DonatePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState('$25');
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // once visible, no need to keep observing
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const handleDonate = (amount: string) => {
    setSelectedAmount(amount);
    // route to donate details or payment page; adjust path/query as needed
    navigate('/donate', { state: { amount } });
  };

  // Example video props; replace videoId with dynamic value if needed
  const videoId = '9bw4TeFdO2U'; // placeholder
  const videoTitle = 'A Message from Nurse Raych';
  const videoSubtitle = 'See how your gift changes lives';

  return (
    <section ref={sectionRef} id="donate-section" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Hero Message from Nurse Raych */}
        <div
          className={`mb-20 transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl p-12 border border-white/20 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    A Message from Nurse Raych
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Photo Section */}
                  <div className="order-2 lg:order-1">
                    <div className="backdrop-blur-md bg-white/10 rounded-3xl p-6 border border-white/20">
                      <div className="w-full h-80 relative rounded-2xl overflow-hidden">
                        <img
                          src="/NurseRaych2/images/image2.jpeg"
                          alt="Nurse Raych with Community Family"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Personal Message */}
                  <div className="order-1 lg:order-2">
                    <Quote className="w-12 h-12 text-purple-400 mb-6" />
                    <blockquote className="text-2xl md:text-3xl text-white leading-relaxed mb-8 font-light italic">
                      "I've walked through villages where a mother's love couldn't cure her child's fever, where knowledge could have prevented tragedy. Your support doesn't just fund programs—it saves lives, one family at a time."
                    </blockquote>
                    <cite className="text-cyan-300 text-xl font-semibold">— Nurse Raych</cite>
                    <p className="text-white/80 mt-4">Community Health Advocate & Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Tiers */}
        <div
          className={`mb-20 transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your Impact
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Every contribution creates meaningful change in underserved communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {donationTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div
                  key={index}
                  className={`backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 cursor-pointer group ${
                    selectedAmount === tier.amount ? 'ring-2 ring-purple-400 bg-white/20' : ''
                  }`}
                  onClick={() => setSelectedAmount(tier.amount)}
                  aria-label={`Select donation tier ${tier.title} ${tier.amount}`}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${tier.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">{tier.amount}</h3>
                    <h4 className="text-xl font-semibold text-cyan-300 mb-4">{tier.title}</h4>
                    <p className="text-white/80 mb-6 leading-relaxed">{tier.description}</p>

                    <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-4 border border-white/20 mb-6">
                      <p className="text-white/90 text-sm font-medium">{tier.impact}</p>
                    </div>

                    <button
                      className={`w-full bg-gradient-to-r ${tier.gradient} text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDonate(tier.amount);
                      }}
                      aria-label={`Donate ${tier.amount}`}
                    >
                      Donate {tier.amount}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* See the Difference Section */}
        <div
          className={`mb-20 transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              See the Difference You're Making
            </h2>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Video Message */}
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20">
              <YouTubeInlinePlayer
                videoId={videoId}
                title={videoTitle}
                subtitle={videoSubtitle}
              />
              
            </div>

            {/* Testimonial Carousel */}
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 relative">
              <div className="flex items-center justify-between absolute top-4 left-4 right-4 z-10">
                <button
                  onClick={prevTestimonial}
                  aria-label="Previous testimonial"
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  aria-label="Next testimonial"
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center pt-8">
                <div className="text-4xl mb-4">{testimonials[currentTestimonial].avatar}</div>
                <blockquote className="text-lg text-white/90 leading-relaxed mb-6 italic">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <cite className="text-cyan-300 font-semibold">
                  — {testimonials[currentTestimonial].author}
                </cite>
                <p className="text-white/70 text-sm mt-1">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    aria-label={`Select testimonial ${index + 1}`}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 scale-125'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Final Message */}
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 delay-1100 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl p-8 border border-white/20 text-center">
            <Quote className="w-12 h-12 text-purple-400 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl text-white leading-relaxed mb-8 font-light italic">
              "You don't need millions to make a difference. Just compassion and action."
            </blockquote>
            <div className="text-right max-w-md ml-auto">
              <cite className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                — Nurse Raych
              </cite>
            </div>

            <div className="mt-12">
              <button
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-pulse"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleDonate(selectedAmount);
                }}
                aria-label="Donate now"
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
