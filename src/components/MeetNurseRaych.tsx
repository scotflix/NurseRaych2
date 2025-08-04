import  { useState, useEffect, useRef } from 'react';
import { Mail, Send, Heart, Users, BookOpen, Brain, HelpingHand } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const topTips = [
  {
    tip: "Always wash hands before treating a child",
    icon: HelpingHand,
    color: "from-pink-500 to-purple-500"
  },
  {
    tip: "Never ignore early warning signs",
    icon: Heart,
    color: "from-purple-500 to-cyan-500"
  },
  {
    tip: "Ask questions during every clinic visit",
    icon: Users,
    color: "from-cyan-500 to-blue-500"
  },
  {
    tip: "Empower your daughters with knowledge",
    icon: BookOpen,
    color: "from-blue-500 to-purple-500"
  },
  {
    tip: "Mental health matters just as much as physical",
    icon: Brain,
    color: "from-purple-500 to-pink-500"
  }
];

export function MeetNurseRaych() {
  const [isVisible, setIsVisible] = useState(false);
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



  return (
    <section ref={sectionRef} id="meet-raych" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet Nurse Raych
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            A personal connection to the heart behind the mission
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mt-6"></div>
        </div>
        
{/* EXPERTISE */}
        <div className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20">
            <div className="flex items-center mb-8">
                 <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500                 rounded-full flex items-center justify-center mr-6">
                   <Mail className="w-8 h-8 text-white" />
                  </div>
              <div>
                <h3 className="text-3xl font-bold text-white">Nurse Raych Expertise</h3>
              </div>
            </div>
            
            <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-8 border border-white/20">
              
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                Currently, I am deeply immersed in my graduate studies, passionately pursuing a Doctorate in Nurse Anesthesia (DNAP), which will equip me with advanced clinical expertise in anesthesia administration, perioperative care, and pain management. This rigorous program not only enhances my technical skills but also strengthens my leadership and research capabilities, preparing me to deliver high-quality, evidence-based anesthesia care. Alongside my academic journey, I am actively working to expand the scope of my nonprofit organization, with a visionary goal of offering free surgical and anesthesia services to underserved communities in the future. By leveraging my doctoral training, I aim to bridge critical healthcare gaps, particularly for vulnerable populations who lack access to life-changing surgical interventions. This initiative will involve collaborating with medical professionals, securing funding, and establishing partnerships with hospitals and charitable organizations to ensure sustainable, high-impact care delivery. Ultimately, my mission is to combine my clinical expertise with humanitarian efforts to improve health equity and transform lives through accessible surgical and anesthesia services.  </p>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-white mt-2">— Nurse Raych</p>
              </div>
            </div>
          </div>
        </div>
        {/* Welcome Letter */}
        <div className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20">
            <div className="flex items-center mb-8">
                 <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500                 rounded-full flex items-center justify-center mr-6">
                   <Mail className="w-8 h-8 text-white" />
                  </div>
              <div>
                <h3 className="text-3xl font-bold text-white">Welcome Letter from                        Nurse Raych</h3>
                <p className="text-white/70">A personal message to our community</p>
              </div>
            </div>
            
            <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-8 border border-white/20">
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                Dear Friend,
              </p>
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                I built this platform for you — the mother without a clinic nearby, the grandmother raising children, 
                the youth with burning questions. You deserve to understand your body and your rights.
              </p>
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                Healthcare should never be a privilege reserved for the few. It should be a right accessible to all, 
                regardless of where you live or your economic situation. This platform is my commitment to making that vision a reality.
              </p>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                Every day, I'm reminded that small actions can create big changes. Together, we can transform how 
                communities access and understand healthcare.
              </p>
              <div className="text-right">
                <p className="text-cyan-300 text-lg font-semibold">With love and dedication,</p>
                <p className="text-2xl font-bold text-white mt-2">— Nurse Raych</p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Carousel */}
<div className={`mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
  <h3 className="text-3xl font-bold text-white text-center mb-8">Moments from the Field</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
    {/* Card 1 */}
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group overflow-hidden">
      <div className="w-full h-48 relative rounded-lg overflow-hidden mb-4">
        <img
          src="/images/image1.jpeg"
          alt="Raych providing care"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <div className="text-white text-center w-full">
            <Heart className="w-8 h-8 mx-auto mb-2 text-white/90 group-hover:text-white" />
            
          </div>
        </div>
      </div>
      <p className="text-white/80 text-center group-hover:text-white/90 transition-colors">Providing care in remote communities</p>
    </div>

    {/* Card 2 */}
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group overflow-hidden">
      <div className="w-full h-48 relative rounded-lg overflow-hidden mb-4">
        <img
          src="/images/image2.jpeg"
          alt="health events"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <div className="text-white text-center w-full">
            <Users className="w-8 h-8 mx-auto mb-2 text-white/90 group-hover:text-white" />
            <span className="text-sm font-medium">health events</span>
          </div>
        </div>
      </div>
      <p className="text-white/80 text-center group-hover:text-white/90 transition-colors">Educating young minds about health</p>
    </div>

    {/* Card 3 */}
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group overflow-hidden">
      <div className="w-full h-48 relative rounded-lg overflow-hidden mb-4">
        <img
          src="/images/image3.jpeg"
          alt="Community talks"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <div className="text-white text-center w-full">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-white/90 group-hover:text-white" />
            <span className="text-sm font-medium">Community talks</span>
          </div>
        </div>
      </div>
      <p className="text-white/80 text-center group-hover:text-white/90 transition-colors">Leading health awareness sessions</p>
    </div>
  </div>
</div>

        {/* Raych's Top 5 Tips */}
        <div className={`mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-3xl font-bold text-white text-center mb-12">⭐ Raych's Top 5 Health Tips</h3>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {topTips.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02] flex items-center"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mr-6 flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-purple-300 text-sm font-semibold">Tip #{index + 1}</span>
                    <p className="text-lg text-white font-medium">{item.tip}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ask Raych Section */}
<div className={`mb-16 transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
  <div className="max-w-2xl mx-auto">
    <h3 className="text-3xl font-bold text-white text-center mb-8">📬 Ask Raych</h3>
    
    <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20">
      <p className="text-white/90 text-center mb-8">
        Have a question or want to share your story? Nurse Raych reads every message personally.
      </p>
      
      <div className="text-center">
        <a
          href="mailto:raych61@gmail.com" // Replace with actual email
          className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
        >
          <Send className="w-5 h-5 mr-2" />
          Email Raych Directly
        </a>
        
        <p className="text-white/70 mt-4 text-sm">
          Or send a text to : +1 (201) 282-9408
        </p>
      </div>
    </div>
  </div>
</div>

        {/* Message to Youth & Donors */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl p-8 border border-white/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-6">🤝 Message to Youth & Donors</h3>
            <blockquote className="text-xl text-white/90 italic leading-relaxed mb-6">
              "You don't need millions to change lives. You need care, clarity, and commitment. 
              Every young person who learns about their health, every donor who believes in our mission, 
              every community member who shares our content—you are all part of this transformation."
            </blockquote>
            <cite className="text-purple-300 font-semibold text-lg">— Nurse Raych</cite>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={(e) => {
                e.stopPropagation();
                navigate('/donate'); // Navigate to the donation page
              }}
            >
                Support Our Mission
              </button>
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/join-campaign');
              }}
              >
                Volunteer With Us
              </button> 
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}