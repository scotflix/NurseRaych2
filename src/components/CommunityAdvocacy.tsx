import { useState, useEffect, useRef } from 'react';
import { Users, Heart, MessageCircle, Handshake, 
  //Quote, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/*
const testimonials = [
  {
    quote: "I joined this platform because of Raych's passion. She walks with the people she helps.",
    author: "Community Nurse Sarah",
    role: "Rural Health Worker",
    avatar: "👩🏾‍⚕️"
  },
  {
    quote: "Nurse Raych changed how our community thinks about healthcare. She made it accessible and understandable.",
    author: "Mary Wanjiku",
    role: "Community Health Volunteer",
    avatar: "👩🏿‍🦳"
  },
  {
    quote: "The maternal health campaign led by Nurse Raych saved my daughter's life. Forever grateful.",
    author: "Grace Achieng",
    role: "Mother of Three",
    avatar: "👩🏾"
  }
];
*/
const campaigns = [
  {
    id: 'maternal-wellness',
    title: "Maternal Wellness Campaign",
    description: "Ensuring every mother has access to essential health information",
    icon: Heart,
    gradient: "from-pink-500 to-purple-500"
  },
  {
    id: 'youth-health',
    title: "Youth Health Education",
    description: "Empowering young people with knowledge about their bodies and rights",
    icon: Users,
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: 'mental-health',
    title: "Mental Health Awareness",
    description: "Breaking stigma and promoting mental wellness in rural communities",
    icon: MessageCircle,
    gradient: "from-purple-500 to-cyan-500"
  }
];

export function CommunityAdvocacy() {
  const [isVisible, setIsVisible] = useState(false);
  //const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  {/*
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
*/}
  const handleJoinCampaign = () => {
    navigate('/join-campaign');
  };

  return (
    <section ref={sectionRef} id="community-section" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Community Advocacy & Leadership
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Leading by example, walking alongside communities, and creating lasting change through compassionate action
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Active Campaigns */}
        <div className={`mb-10 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-3xl font-bold text-white text-center mb-12">Our Active Campaigns</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campaigns.map((campaign, index) => {
              const Icon = campaign.icon;
              return (
                <div
                  key={index}
                  className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 text-center group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${campaign.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">{campaign.title}</h4>
                  <p className="text-white/80 leading-relaxed">{campaign.description}</p>
                </div>
              );
            })}
          </div>

          {/* Single Join Campaign Button */}
          <div className="text-center mt-8">
            <button 
              onClick={handleJoinCampaign}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Join Campaign
            </button>
          </div>
        </div>

        {/* Testimonials Slider *
        <div className={`mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-3xl font-bold text-white text-center mb-12">Community Voices</h3>
          
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 relative">
              <div className="flex items-center justify-between absolute top-1/2 left-4 right-4 transform -translate-y-1/2 z-10">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              
              <div className="text-center px-16">
                <div className="text-6xl mb-6">{testimonials[currentTestimonial].avatar}</div>
                <Quote className="w-12 h-12 text-purple-400 mx-auto mb-6" />
                <blockquote className="text-2xl text-white/90 leading-relaxed mb-8 italic">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <cite className="text-cyan-300 font-semibold text-lg">
                  — {testimonials[currentTestimonial].author}
                </cite>
                <p className="text-white/70 mt-2">{testimonials[currentTestimonial].role}</p>
              </div>
              
              {/* Testimonial Dots 
              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
*/}
        {/* Donor Quote */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl p-8 border border-white/20 text-center">
            <Handshake className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-6"> Trust</h3>
            <blockquote className="text-xl text-white/90 italic leading-relaxed mb-6">
              "We keep it local. We keep it transparent. Every shilling goes directly into improving lives."
            </blockquote>
            <cite className="text-purple-300 font-semibold">— Nurse Raych</cite>
          </div>
        </div>
      </div>
    </section>
  );
}
