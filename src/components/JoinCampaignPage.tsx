import   { useState, useEffect, useRef, useCallback } from 'react';
import { joinCampaign } from '@/lib/campaignService';
import { useCampaignStats } from '@/hooks/useCampaignStats';
import { 
  Heart, 
  BookOpen, 
  DollarSign, 
  Wrench, 
  ArrowRight, 
  CheckCircle, 
  Share2, 
  Download, 
  MessageCircle,
  Clock,
  Award,
  Facebook,
  Instagram,
  Copy,
  Sparkles,
  Target,
  MapPin,
  User,
  ChevronRight,
  X,
  Twitter
} from 'lucide-react';

const roleCards = [
  {
    id: 'advocate',
    title: 'Advocate',
    icon: MessageCircle,
    description: 'Share posters, spread messages on WhatsApp/Facebook',
    cta: "Yes, I'll speak for health.",
    gradient: 'from-pink-500 to-purple-500',
    impact: 'Reach 100+ people monthly'
  },
  {
    id: 'educator',
    title: 'Educator',
    icon: BookOpen,
    description: 'Teach others through health tips and flyers',
    cta: 'I want to teach health knowledge.',
    gradient: 'from-purple-500 to-cyan-500',
    impact: 'Educate 50+ community members'
  },
  {
    id: 'donor',
    title: 'Donor',
    icon: DollarSign,
    description: 'Support outreach work, receive transparent reports',
    cta: 'I want to fund change.',
    gradient: 'from-cyan-500 to-blue-500',
    impact: 'Fund vital health programs'
  },
  {
    id: 'volunteer',
    title: 'Volunteer',
    icon: Wrench,
    description: 'Remote/in-person help: kit packing, design, fieldwork',
    cta: "I'll offer my time.",
    gradient: 'from-blue-500 to-purple-500',
    impact: 'Contribute 5-20 hours monthly'
  }
];

const quizQuestions = [
  {
    id: 'location',
    question: 'Where are you based?',
    options: ['Kenya', 'Nigeria', 'Ghana', 'Tanzania', 'Uganda', 'Other African Country', 'International']
  },
  {
    id: 'role',
    question: 'Which best describes you?',
    options: ['Health Worker', 'Teacher', 'Parent', 'Student', 'Community Leader', 'Supporter']
  },
  {
    id: 'time',
    question: 'How much time can you give?',
    options: ['5 mins/week', '1-2 hours/week', '5+ hours/week', 'Full time volunteer']
  }
];

type CertificateData = {
  name: string;
  role: string;
  dateJoined: string;
};

type CertificateGeneratorProps = {
  certificateData: CertificateData;
  setCertificateData: React.Dispatch<React.SetStateAction<CertificateData>>;
  certificateCanvasRef: React.RefObject<HTMLCanvasElement>;
};

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
    certificateData,
    setCertificateData,
    certificateCanvasRef
  }) => {
      const generateCertificatePNG = useCallback(() => {
        const canvas = certificateCanvasRef.current;
        if (!canvas) return;
  
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
  
        // Set canvas size
        canvas.width = 800;
        canvas.height = 600;
  
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        // Border
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  
        // Header background
        const headerGradient = ctx.createLinearGradient(0, 50, canvas.width, 150);
        headerGradient.addColorStop(0, '#8b5cf6');
        headerGradient.addColorStop(1, '#06b6d4');
        ctx.fillStyle = headerGradient;
        ctx.fillRect(50, 50, canvas.width - 100, 100);
  
        // Header text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Participation', canvas.width / 2, 110);
        
        ctx.font = '18px Arial';
        ctx.fillText('Youth Health Education Campaign', canvas.width / 2, 135);
  
        // Main content
        ctx.fillStyle = '#1f2937';
        ctx.font = '20px Arial';
        ctx.fillText('This certifies that', canvas.width / 2, 220);
  
        // Name
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#8b5cf6';
        ctx.fillText(certificateData.name || 'Your Name', canvas.width / 2, 280);
  
        // Role text
        ctx.fillStyle = '#1f2937';
        ctx.font = '20px Arial';
        ctx.fillText(`has officially joined as a ${certificateData.role.charAt(0).toUpperCase() + certificateData.role.slice(1)}`, canvas.width / 2, 330);
  
        // Organization
        ctx.fillText('in Nurse Raych\'s Health Initiative', canvas.width / 2, 370);
        ctx.fillText(`on ${certificateData.dateJoined}`, canvas.width / 2, 410);
  
        // Award icon (simple circle with star)
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 470, 30, 0, 2 * Math.PI);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('★', canvas.width / 2, 480);
  
        // Signature
        ctx.fillStyle = '#8b5cf6';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('Nurse Raych', canvas.width - 80, 530);
        
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.fillText('Founder & Community Health Advocate', canvas.width - 80, 550);
  
        // Download the image
        const link = document.createElement('a');
        link.download = `${certificateData.name.replace(/\s+/g, '_')}_Certificate.png`;
        link.href = canvas.toDataURL();
        link.click();
      }, [certificateData, certificateCanvasRef]);
  
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Your Official Certificate
                </h2>
                <p className="text-xl text-white/80">
                  Download your personalized certificate of participation
                </p>
              </div>
  
              {/* Certificate Preview */}
              <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 mb-8">
                <div className="bg-white rounded-2xl p-8 text-center">
                  {/* Cultural Pattern Border */}
                  <div className="border-4 border-purple-200 rounded-2xl p-8 bg-gradient-to-br from-purple-50 to-cyan-50">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-4 rounded-xl mb-8">
                      <h3 className="text-2xl font-bold">Certificate of Participation</h3>
                      <p className="text-purple-100">Youth Health Education Campaign</p>
                    </div>
  
                    {/* Content */}
                    <div className="space-y-6 text-gray-800">
                      <div className="text-lg">This certifies that</div>
                      
                      <div className="text-3xl font-bold text-purple-600 border-b-2 border-purple-200 pb-2">
                        {certificateData.name || 'Your Name'}
                      </div>
                      
                      <div className="text-lg">
                        has officially joined as a <span className="font-bold text-cyan-600 capitalize">{certificateData.role}</span>
                      </div>
                      
                      <div className="text-lg">
                        in Nurse Raych's Health Initiative on <span className="font-semibold">{certificateData.dateJoined}</span>
                      </div>
  
                      {/* Badge */}
                      <div className="flex justify-center my-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <Award className="w-10 h-10 text-white" />
                        </div>
                      </div>
  
                      {/* Signature */}
                      <div className="text-right mt-8">
                        <div className="text-2xl font-bold text-purple-600 mb-2">Nurse Raych</div>
                        <div className="text-sm text-gray-600">Founder & Community Health Advocate</div>
                        <div className="text-xs text-gray-500 mt-2">Signature Watermark</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Customization Form - FIXED INPUT HANDLING */}
              <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Customize Your Certificate</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
  <input
    type="text"
    placeholder="Your Full Name"
    value={certificateData.name}
    onChange={(e) => setCertificateData(prev => ({ ...prev, name: e.target.value }))}
    className="px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <select
    value={certificateData.role}
    onChange={(e) => setCertificateData(prev => ({ ...prev, role: e.target.value }))}
    className="px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="advocate">Advocate</option>
    <option value="educator">Educator</option>
    <option value="donor">Donor</option>
    <option value="volunteer">Volunteer</option>
  </select>
  <input
    type="date"
    value={certificateData.dateJoined}
    onChange={(e) => setCertificateData(prev => ({ ...prev, dateJoined: e.target.value }))}
    className="px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
</div>
              </div>
  
              {/* Hidden Canvas for PNG Generation */}
              <canvas
                ref={certificateCanvasRef}
                style={{ display: 'none' }}
                width={800}
                height={600}
              />
  
              {/* Download Actions */}
              <div className="text-center space-y-4">
                <button 
                  onClick={generateCertificatePNG}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
                >
                  <Download className="w-6 h-6 mr-2" />
                  Download Certificate (PNG)
                </button>
                
                <p className="text-white/70">
                  Perfect for LinkedIn profiles, social media, or printing
                </p>
  
                <div className="mt-8">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/15 transition-all duration-300"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
export function JoinCampaignPage() {
  const [currentScreen, setCurrentScreen] = useState('confirmation'); // confirmation, onboarding, quiz, result, email, share, certificate
  const [selectedRole, setSelectedRole] = useState('');
  const [userName, setUserName] = useState('Friend');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [certificateData, setCertificateData] = useState({
  name: '',
  role: 'advocate',
  dateJoined: new Date().toISOString().split('T')[0]
});

// Fixed: Use useCallback to prevent re-renders that cause input focus loss
const [userInfo, setUserInfo] = useState({ name: '', email: '', whatsapp: '' });

const [showConfetti, setShowConfetti] = useState(false);
  const [isJoiningCampaign, setIsJoiningCampaign] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { refreshStats } = useCampaignStats();
  
  // Certificate canvas ref for PNG generation
  const certificateCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);


 const ConfirmationModal = () => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-10 overflow-auto">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/80 via-pink-500/60 to-cyan-500/80">
      {/* Background Image with Gradient Overlay */}
      <div className="relative h-full w-full ">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="relative rounded-3xl max-w-4xl mx-auto my-8">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/80 via-pink-500/60 to-cyan-500/80"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-cyan-400 opacity-20"></div>
            
            {/* Pulse Animation Border */}
            <div className="absolute inset-0 rounded-3xl border-4 border-white/30 animate-pulse"></div>
            
            {/* Content */}
           <div className="relative z-10 p-8 sm:p-12 text-center">
              {/* Hero Image Placeholder */}
              <div className="w-80 h-60 mx-auto mb-8 rounded-2xl overflow-hidden relative shadow-2xl">
                 <img
                 src="images/image2.jpeg" // Replace with your image URL
                 alt="Nurse Raych with community members"
                 className="absolute inset-0 w-full h-full object-cover"
                 />
               </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Welcome to the movement, {userName}!
              </h1>
              
              <blockquote className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 italic max-w-3xl mx-auto">
                "Every step matters. Every voice counts. You've just become part of a growing force for change. Let me walk you through what's next."
              </blockquote>
              <cite className="text-cyan-200 font-semibold text-lg">— Nurse Raych</cite>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <button
                  onClick={() => setCurrentScreen('onboarding')}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
                >
                  <Target className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
                  Take the Next Step
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setShowShareModal(true)}
                  className="backdrop-blur-md bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
                >
                  <Share2 className="w-6 h-6 mr-2" />
                  Share This Campaign
                </button>
              </div>

              {/* Impact Updates Toggle */}
              <div className="mt-8 flex items-center justify-center">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded border-2 border-white/30 flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 text-lg">💌 Receive Impact Updates</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

  const OnboardingFlow = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Mission
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Every role is vital to our success. Select the way you'd like to contribute to our health initiative.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {roleCards.map((role, index) => {
            const Icon = role.icon;
            function handleRoleSelection(id: string): void {
              throw new Error('Function not implemented.');
            }

            return (
              <div
                key={role.id}
                className={`backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 cursor-pointer group ${
                  selectedRole === role.id ? 'ring-2 ring-purple-400 bg-white/20' : ''
                }`}
                onClick={() => handleRoleSelection(role.id)}
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${role.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">{role.title}</h3>
                  <p className="text-white/80 mb-6 leading-relaxed">{role.description}</p>
                  
                  <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-4 border border-white/20 mb-6">
                    <p className="text-cyan-300 font-medium text-sm">{role.impact}</p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRole(role.id);
                      setCurrentScreen('quiz');
                    }}
                    className={`w-full bg-gradient-to-r ${role.gradient} text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group`}
                  >
                    {role.cta}
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setCurrentScreen('confirmation')}
            className="text-white/70 hover:text-white transition-colors flex items-center mx-auto"
          >
            ← Back to Welcome
          </button>
        </div>
      </div>
    </div>
  );

  const ImpactQuiz = () => {
    const currentQuestion = quizQuestions[currentQuizQuestion];
    const progress = ((currentQuizQuestion + 1) / quizQuestions.length) * 100;

    const handleAnswer = (answer: string) => {
      setQuizAnswers({ ...quizAnswers, [currentQuestion.id]: answer });
      
      if (currentQuizQuestion < quizQuestions.length - 1) {
        setCurrentQuizQuestion(currentQuizQuestion + 1);
      } else {
        setShowConfetti(true);
        setTimeout(() => {
          setCurrentScreen('result');
          setShowConfetti(false);
        }, 2000);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20 relative">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
            ))}
          </div>
        )}

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between text-white/70 text-sm mb-2">
                <span>Question {currentQuizQuestion + 1} of {quizQuestions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {currentQuestion.question}
              </h2>
              <p className="text-xl text-white/80">
                Help us personalize your experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">{option}</span>
                    <ChevronRight className="w-6 h-6 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QuizResult = () => {
    const getRoleBadge = () => {
      const role = roleCards.find(r => r.id === selectedRole);
      return role || roleCards[0];
    };

    const badge = getRoleBadge();
    const Icon = badge.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Celebration Animation */}
            <div className="mb-12">
              <div className={`w-32 h-32 bg-gradient-to-r ${badge.gradient} rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-2xl`}>
                <Icon className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                🎉 Welcome, {badge.title}!
              </h1>
              <p className="text-xl text-white/90 mb-8">
                You're now officially part of Nurse Raych's health initiative as a <span className="text-cyan-300 font-bold">{badge.title}</span>
              </p>
            </div>

            {/* Badge Display */}
            <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl p-8 border border-white/20 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <MapPin className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                  <div className="text-lg font-bold text-white mb-2">Location</div>
                  <div className="text-white/80">{quizAnswers.location || 'Not specified'}</div>
                </div>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <User className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                  <div className="text-lg font-bold text-white mb-2">Role</div>
                  <div className="text-white/80">{quizAnswers.role || 'Supporter'}</div>
                </div>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <Clock className="w-8 h-8 text-pink-400 mx-auto mb-4" />
                  <div className="text-lg font-bold text-white mb-2">Commitment</div>
                  <div className="text-white/80">{quizAnswers.time || '5 mins/week'}</div>
                </div>
              </div>
            </div>

            {/* Contact Information - Email Button */}
<div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 mb-8">
  <h3 className="text-2xl font-bold text-white mb-6">Complete Your Registration</h3>
  <p className="text-white/90 mb-6">
    Click the button below to email us your details and receive your personalized action pack!
  </p>
  <div className="max-w-md mx-auto mb-6 text-center">
    <button
      onClick={() => {
        const subject = encodeURIComponent("Join Nurse Raych Campaign - Action Pack Request");
        const body = encodeURIComponent(
          `Hello Nurse Raych Team,

I would like to join the campaign and receive my personalized action pack.

My details:
- Full Name: [Your Name]
- Email Address: [Your Email]
- WhatsApp Number (Optional): [Your WhatsApp]

Thank you!`
        );
        window.location.href = `mailto:raych61@gmail.com?subject=${subject}&body=${body}`;
      }}
      className={`bg-gradient-to-r ${badge.gradient} text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto`}
    >
      <Download className="w-6 h-6 mr-2" />
      Email My Details for Action Pack
    </button>
  </div>
</div>
            {/* Next Steps */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentScreen('certificate')}
                className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/15 transition-all duration-300 flex items-center justify-center"
              >
                <Award className="w-5 h-5 mr-2" />
                Get Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleDownloadActionPack = async () => {
    if (!userInfo.name || !userInfo.email) {
      return;
    }

    setIsJoiningCampaign(true);

    try {
      // Map selected role to campaign name
      const campaignMapping: Record<string, string> = {
        'advocate': 'Maternal Wellness Campaign',
        'educator': 'Youth Health Education',
        'donor': 'Mental Health Awareness',
        'volunteer': 'Youth Health Education'
      };

      const campaignName = campaignMapping[selectedRole] || 'Youth Health Education';

      await joinCampaign({
        campaign_name: campaignName,
        participant_name: userInfo.name,
        participant_email: userInfo.email,
        participant_role: selectedRole as any,
        location: quizAnswers.location,
        time_commitment: quizAnswers.time,
        metadata: {
          whatsapp: userInfo.whatsapp,
          quiz_answers: quizAnswers,
          joined_via: 'website',
          timestamp: new Date().toISOString()
        }
      });

      // Refresh campaign stats to show updated numbers
      await refreshStats();

      // Generate and download the action pack
      generateActionPackPDF();

      // Move to next screen
      setCurrentScreen('share');
    } catch (error) {
      console.error('Error joining campaign:', error);
      // Still proceed to next screen even if database update fails
      generateActionPackPDF();
      setCurrentScreen('share');
    } finally {
      setIsJoiningCampaign(false);
    }
  };

  const generateActionPackPDF = () => {
    const getRoleBadge = () => {
      const role = roleCards.find(r => r.id === selectedRole);
      return role || roleCards[0];
    };

    const badge = getRoleBadge();
    
    // Create action pack content
    const actionPackContent = `
NURSE RAYCH HEALTH INITIATIVE
${badge.title.toUpperCase()} ACTION PACK

Welcome ${userInfo.name}!

Thank you for joining our mission to bring healthcare knowledge to underserved communities.

YOUR ROLE: ${badge.title}
CAMPAIGN: ${selectedRole === 'advocate' ? 'Maternal Wellness Campaign' : 
           selectedRole === 'educator' ? 'Youth Health Education' : 
           selectedRole === 'donor' ? 'Mental Health Awareness' : 
           'Youth Health Education'}
LOCATION: ${quizAnswers.location || 'Not specified'}
TIME COMMITMENT: ${quizAnswers.time || '5 mins/week'}

GETTING STARTED:

As a ${badge.title}, here's how you can make an immediate impact:

${selectedRole === 'advocate' ? `
1. Share health awareness posts on social media
2. Distribute educational flyers in your community
3. Organize small group discussions about health topics
4. Connect with local health workers
5. Report community health needs to our team
` : selectedRole === 'educator' ? `
1. Conduct health education sessions
2. Create simple health tip graphics
3. Teach basic first aid skills
4. Mentor other community members
5. Develop local health content
` : selectedRole === 'donor' ? `
1. Set up monthly donations to support programs
2. Sponsor specific health initiatives
3. Fund mobile clinic visits
4. Support health education materials
5. Receive transparent impact reports
` : `
1. Help pack health kits for distribution
2. Assist with community outreach events
3. Support data collection and surveys
4. Help with translation services
5. Participate in awareness campaigns
`}

RESOURCES INCLUDED:
- Community health tips checklist
- Social media templates
- Contact information for local coordinators
- Monthly impact tracking sheet
- Emergency health contact numbers

NEXT STEPS:
1. Join our WhatsApp group: [Link will be sent via email]
2. Attend virtual orientation session
3. Connect with your local coordinator
4. Start your first activity within 7 days
5. Share your progress with the community

CONTACT INFORMATION:
Email:raych61@gmail.com
WhatsApp:+1 (201) 282-9408
Website: nurseraych.org

Remember: Every small action creates ripples of change in our communities.

With gratitude,
Nurse Raych & Team

---
Generated on: ${new Date().toLocaleDateString()}
Participant ID: NR-${Date.now().toString().slice(-6)}
    `.trim();

    // Create and download the file
    const blob = new Blob([actionPackContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${userInfo.name.replace(/\s+/g, '_')}_${badge.title}_Action_Pack.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const SocialShare = () => {
    const [copied, setCopied] = useState(false);
    
    const shareText = "I just joined Nurse Raych's campaign to bring mobile clinics to underserved families. Join me: nurseraych.org/join-campaign #NurseRaych #HealthForAll";
    
    const copyToClipboard = () => {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Share Your Impact
              </h2>
              <p className="text-xl text-white/80">
                Inspire others to join our health initiative
              </p>
            </div>

            {/* Share Graphic */}
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl p-8 text-center mb-6">
                <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">I Joined the Movement!</h3>
                <p className="text-white/90 mb-6">Supporting Nurse Raych's Health Initiative</p>
                <div className="flex items-center justify-center space-x-4 text-white/80">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="font-semibold">{userInfo.name || 'Your Name'}</span>
                </div>
                <div className="mt-6 text-white/90 italic">
                  "Together, we are the heartbeat of change." — Nurse Raych
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-xl font-bold text-white mb-4">Share on Social Media</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <button className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Facebook className="w-5 h-5 mr-2" />
                    Facebook
                  </button>
                  <button className="bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center">
                    <Instagram className="w-5 h-5 mr-2" />
                    Instagram
                  </button>
                  <button className="bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="backdrop-blur-md bg-white/10 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/15 transition-colors flex items-center justify-center"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto">
                  <Download className="w-5 h-5 mr-2" />
                  Download Share Graphic
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentScreen('certificate')}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
              >
                Get Your Certificate
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // FIXED: Certificate Generator with PNG Download

  
  type CertificateData = {
    name: string;
    role: string;
    dateJoined: string;
  };
  
  type CertificateGeneratorProps = {
    certificateData: CertificateData;
    setCertificateData: React.Dispatch<React.SetStateAction<CertificateData>>;
    certificateCanvasRef: React.RefObject<HTMLCanvasElement>;
  };
  
  

  const ShareModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Share Campaign</h3>
          
          <div className="space-y-4">
            <button 
               onClick={() => window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
              '_blank'
               )}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
              <Facebook className="w-5 h-5 mr-2" />
              Share on Facebook
           </button>
            <button 
    onClick={() => {
      // Instagram doesn't have a direct share API, so we'll open the app or suggest posting
      alert("To share on Instagram:\n1. Take a screenshot\n2. Open Instagram\n3. Create a new post with this campaign");
      // Alternatively, you could open the Instagram app with a deep link
      // window.location.href = 'instagram://app';
    }}
    className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center"
  >
    <Instagram className="w-5 h-5 mr-2" />
    Share on Instagram
  </button>
            <button 
    onClick={() => window.open(
      `https://wa.me/?text=${encodeURIComponent("Check out this amazing campaign: " + window.location.href)}`,
      '_blank'
    )}
    className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
  >
    <MessageCircle className="w-5 h-5 mr-2" />
    Share on WhatsApp
  </button>
          <button 
    onClick={() => window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Check out this amazing campaign!")}`,
      '_blank'
    )}
    className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center"
  >
    <Twitter className="w-5 h-5 mr-2" />
    Share on Twitter
  </button>
          </div>
        </div>
      </div>
    );
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
  {/* Animated Background Elements */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
  </div>

  {/* Main Content Container */}
  <div className="relative z-10 min-h-screen flex flex-col w-full">
    {/* Navigation - fixed width to match viewport */}
    
    {/* Screen Content - constrained to viewport width */}
    <div className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
      <div className="w-full mx-auto px-4 py-6">
        {currentScreen === 'confirmation' && <ConfirmationModal />}
        {currentScreen === 'onboarding' && <OnboardingFlow />}
        {currentScreen === 'quiz' && <ImpactQuiz />}
        {currentScreen === 'result' && <QuizResult />}
        {currentScreen === 'share' && <SocialShare />}
        {currentScreen === 'certificate' && (
             <CertificateGenerator
               certificateData={certificateData}
               setCertificateData={setCertificateData}
               certificateCanvasRef={certificateCanvasRef}
             />
           )}
      </div>
    </div>
  </div>
  
  <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
</div>
  );
}