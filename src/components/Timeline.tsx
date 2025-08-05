import { useState, useEffect, useRef } from 'react';
import { GraduationCap, MapPin, Megaphone, Globe, Trophy} from 'lucide-react';

const timelineEvents = [
  {
    year: 'Year 1',
    title: 'Enrolled in nursing school',
    description: 'Started her journey with a dream to serve underserved communities',
    icon: GraduationCap,
    color: 'from-purple-500 to-pink-500'
  },
  {
    year: 'Year 3',
    title: 'First rural placement',
    description: 'Discovered the health equity gap during her rural clinic placement',
    icon: MapPin,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    year: 'Year 5',
    title: 'Started community outreach',
    description: 'Began using posters & SMS to reach underserved communities',
    icon: Megaphone,
    color: 'from-pink-500 to-purple-500'
  },
  {
    year: 'Year 7',
    title: 'Launched NurseRaych platform',
    description: 'Created the Health Initiative website to scale her impact',
    icon: Globe,
    color: 'from-purple-500 to-cyan-500'
  },
  {
    year: 'Year 9',
    title: 'Milestone Achievement',
    description: 'running local campaigns',
    icon: Trophy,
    color: 'from-cyan-500 to-purple-500'
  }
];

export function Timeline() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % timelineEvents.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} id="timeline-section" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Raych's Journey of Impact
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            From humble beginnings to transforming healthcare access for thousands
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"></div>
          
          {/* Timeline Events */}
          <div className="space-y-16">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isLeft = index % 2 === 0;
              const isActive = index === activeIndex;
              
              return (
                <div
                  key={index}
                  className={`flex items-center transition-all duration-1000 delay-${index * 200} ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                >
                  {isLeft ? (
                    <>
                      {/* Left Content */}
                      <div className="w-5/12 text-right pr-8">
                        <div className={`backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 transition-all duration-500 ${
                          isActive ? 'bg-white/20 scale-105 shadow-2xl' : 'hover:bg-white/15'
                        }`}>
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${event.color} mb-4`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">{event.year}</h3>
                          <h4 className="text-lg font-semibold text-cyan-300 mb-3">{event.title}</h4>
                          <p className="text-white/80">{event.description}</p>
                        </div>
                      </div>
                      
                      {/* Center Node */}
                      <div className="w-2/12 flex justify-center">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${event.color} border-4 border-white/20 transition-all duration-500 ${
                          isActive ? 'scale-150 shadow-lg' : ''
                        }`}></div>
                      </div>
                      
                      {/* Right Spacer */}
                      <div className="w-5/12"></div>
                    </>
                  ) : (
                    <>
                      {/* Left Spacer */}
                      <div className="w-5/12"></div>
                      
                      {/* Center Node */}
                      <div className="w-2/12 flex justify-center">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${event.color} border-4 border-white/20 transition-all duration-500 ${
                          isActive ? 'scale-150 shadow-lg' : ''
                        }`}></div>
                      </div>
                      
                      {/* Right Content */}
                      <div className="w-5/12 text-left pl-8">
                        <div className={`backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 transition-all duration-500 ${
                          isActive ? 'bg-white/20 scale-105 shadow-2xl' : 'hover:bg-white/15'
                        }`}>
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${event.color} mb-4`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">{event.year}</h3>
                          <h4 className="text-lg font-semibold text-cyan-300 mb-3">{event.title}</h4>
                          <p className="text-white/80">{event.description}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-8">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon;
            const isActive = index === activeIndex;
            
            return (
              <div
                key={index}
                className={`transition-all duration-1000 delay-${index * 200} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className={`backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 transition-all duration-500 ${
                  isActive ? 'bg-white/20 scale-105 shadow-2xl' : 'hover:bg-white/15'
                }`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${event.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{event.year}</h3>
                  <h4 className="text-lg font-semibold text-cyan-300 mb-3">{event.title}</h4>
                  <p className="text-white/80">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline Navigation Dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {timelineEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}