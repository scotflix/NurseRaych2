import { useState, useEffect, useRef } from 'react';
import { GraduationCap, HeartPulse, Plane, Globe, Trophy, Stethoscope} from 'lucide-react';

const timelineEvents = [
  {
    year: '2010',
    yearIcon: Stethoscope,
    title: 'Began Nursing Career',
    description: 'Started as a Licensed Practical Nurse, working with geriatric populations for two years.',
    icon: HeartPulse,
    color: 'from-purple-500 to-pink-500'
  },
  {
    year: '2011–2015',
    yearIcon: GraduationCap,
    title: 'Advanced Education',
    description: 'Returned to school in 2011 and earned her Registered Nurse license in 2015.',
    icon: GraduationCap,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    year: '2015–2017',
    yearIcon: HeartPulse,
    title: 'Cardiac Nurse',
    description: 'Worked for two years as a cardiac nurse in a hospital, gaining critical care experience.',
    icon: HeartPulse,
    color: 'from-pink-500 to-purple-500'
  },
  {
    year: '2017–2024',
    yearIcon: Trophy,
    title: 'Cardiac ICU Nurse in NYC',
    description: 'Served for 7 years at a Magnet Hospital in New York City, specializing in cardiac intensive care.',
    icon: Trophy,
    color: 'from-purple-500 to-cyan-500'
  },
  {
    year: '2018–2024',
    yearIcon: Plane,
    title: 'Passion for Volunteering',
    description: 'Discovered a love for volunteer work while in Manhattan and during medical missions to the Dominican Republic.',
    icon: Plane,
    color: 'from-cyan-500 to-purple-500'
  },
  {
    year: '2024',
    yearIcon: Globe,
    title: 'Doctoral Studies',
    description: 'Began pursuing a Doctorate in Nurse Anesthesia, aiming to expand volunteer work post-graduation.',
    icon: Globe,
    color: 'from-purple-500 to-pink-500'
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

  const renderYear = (
  year: string | number,
  YearIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
  isActive: boolean
) => (
  <div className="flex items-center justify-center space-x-2">
    <YearIcon
      className={`w-5 h-5 text-cyan-300 transition-transform duration-500 ${
        isActive ? 'animate-bounce' : ''
      }`}
    />
    <span>{year}</span>
  </div>
);


  return (
    <section ref={sectionRef} id="timeline-section" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            My Nursing Journey
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            From LPN beginnings to ICU nursing and beyond — a journey of compassion, skill, and service.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"></div>
          <div className="space-y-16">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const YearIcon = event.yearIcon;
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
                      <div className="w-5/12 text-right pr-8">
                        <div
                          className={`backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 transition-all duration-500 ${
                            isActive
                              ? 'bg-white/20 scale-105 shadow-2xl'
                              : 'hover:bg-white/15'
                          }`}
                        >
                          <div
                            className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${event.color} mb-4`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {renderYear(event.year, YearIcon, isActive)}
                          </h3>
                          <h4 className="text-lg font-semibold text-cyan-300 mb-3">
                            {event.title}
                          </h4>
                          <p className="text-white/80">{event.description}</p>
                        </div>
                      </div>
                      <div className="w-2/12 flex justify-center">
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-r ${event.color} border-4 border-white/20 transition-all duration-500 ${
                            isActive ? 'scale-150 shadow-lg' : ''
                          }`}
                        ></div>
                      </div>
                      <div className="w-5/12"></div>
                    </>
                  ) : (
                    <>
                      <div className="w-5/12"></div>
                      <div className="w-2/12 flex justify-center">
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-r ${event.color} border-4 border-white/20 transition-all duration-500 ${
                            isActive ? 'scale-150 shadow-lg' : ''
                          }`}
                        ></div>
                      </div>
                      <div className="w-5/12 text-left pl-8">
                        <div
                          className={`backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 transition-all duration-500 ${
                            isActive
                              ? 'bg-white/20 scale-105 shadow-2xl'
                              : 'hover:bg-white/15'
                          }`}
                        >
                          <div
                            className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${event.color} mb-4`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {renderYear(event.year, YearIcon, isActive)}
                          </h3>
                          <h4 className="text-lg font-semibold text-cyan-300 mb-3">
                            {event.title}
                          </h4>
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
            const YearIcon = event.yearIcon;
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`transition-all duration-1000 delay-${index * 200} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div
                  className={`backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 transition-all duration-500 ${
                    isActive ? 'bg-white/20 scale-105 shadow-2xl' : 'hover:bg-white/15'
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${event.color} mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {renderYear(event.year, YearIcon, isActive)}
                  </h3>
                  <h4 className="text-lg font-semibold text-cyan-300 mb-3">
                    {event.title}
                  </h4>
                  <p className="text-white/80">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Dots */}
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
