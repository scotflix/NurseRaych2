import  { useState, useEffect, useRef } from 'react';
import { Stethoscope, BookOpen, Video, FileText, Star, ChevronRight } from 'lucide-react';

const recommendations = [
  {
    title: "Maternal Health Essentials",
    type: "Guide",
    description: "Complete guide for expecting mothers in rural communities",
    icon: FileText,
    gradient: "from-pink-500 to-purple-500"
  },
  {
    title: "Child Nutrition Basics",
    type: "Video Series",
    description: "Easy-to-follow nutrition tips for healthy child development",
    icon: Video,
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    title: "Mental Health Awareness",
    type: "Article",
    description: "Breaking stigma and promoting mental wellness in communities",
    icon: BookOpen,
    gradient: "from-purple-500 to-cyan-500"
  }
];

export function KnowledgeCurator() {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section ref={sectionRef} id="knowledge-section" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Curator of Health Knowledge
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Trusted expertise and carefully curated content to empower communities with essential health knowledge
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Curator Badge */}
        <div className={`max-w-2xl mx-auto mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl p-8 border border-white/20 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white">🩺 Curated by Nurse Raych & Team</h3>
                <p className="text-white/80">Verified • Evidence-based • Community-focused</p>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed">
              Every piece of content on our platform is carefully reviewed and approved by qualified healthcare professionals, 
              ensuring you receive accurate, relevant, and actionable health information.
            </p>
          </div>
        </div>

        {/* Nurse Recommends Section */}
        <div className={`mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20">
            <div className="flex items-center mb-8">
              <Star className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-3xl font-bold text-white">Nurse Recommends</h3>
              <span className="ml-auto text-white/60 text-sm">My top 3 guides this week</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-cyan-300 text-sm font-semibold mb-2 block">{item.type}</span>
                    <h4 className="text-lg font-bold text-white mb-3">{item.title}</h4>
                    <p className="text-white/80 text-sm mb-4">{item.description}</p>
                    <div className="flex items-center text-purple-300 text-sm font-semibold group-hover:text-purple-200 transition-colors">
                      Read More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quote Block */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-md bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl p-8 border border-white/20 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">👩🏽‍⚕️</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">In Raych's Words</h3>
            <blockquote className="text-xl text-white/90 italic leading-relaxed">
              "Knowledge is the most powerful medicine we can provide. When communities understand their health, 
              they become empowered to make decisions that can save lives. Every article, every guide, every video 
              we share is a step towards a healthier, more informed community."
            </blockquote>
            <cite className="text-cyan-300 font-semibold mt-4 block">— Nurse Raych</cite>
          </div>
        </div>
      </div>
    </section>
  );
}