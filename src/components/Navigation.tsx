import { useState, useEffect } from 'react';
import { Menu, X, Heart} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleDonateClick = () => {
    navigate('/donate');
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'backdrop-blur-md bg-white/10 border-b border-white/20' : ''
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              {/*<Stethoscope className="w-6 h-6 text-white" />*/}
              <img
                src="./favicon.ico"
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold text-white">NurseRaych</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-white/90 hover:text-white transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('story-section')}
              className="text-white/90 hover:text-white transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('timeline-section')}
              className="text-white/90 hover:text-white transition-colors"
            >
              Journey
            </button>
           {/*<button 
              onClick={() => scrollToSection('knowledge-section')}
              className="text-white/90 hover:text-white transition-colors"
            >
              Expertise
            </button>
            */}
            <button 
              onClick={() => scrollToSection('community-section')}
              className="text-white/90 hover:text-white transition-colors"
            >
              Community
            </button>
            <button 
              onClick={() => scrollToSection('meet-raych')}
              className="text-white/90 hover:text-white transition-colors"
            >
              Meet Raych
            </button>
            <button 
              onClick={handleDonateClick}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <Heart className="w-4 h-4 mr-2" />
              Donate
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-6">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-white/90 hover:text-white transition-colors text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('story-section')}
                className="text-white/90 hover:text-white transition-colors text-left"
              >
                Her Story
              </button>
              <button 
                onClick={() => scrollToSection('timeline-section')}
                className="text-white/90 hover:text-white transition-colors text-left"
              >
                Journey
              </button>
              <button 
                onClick={() => scrollToSection('knowledge-section')}
                className="text-white/90 hover:text-white transition-colors text-left"
              >
                Expertise
              </button>
              <button 
                onClick={() => scrollToSection('community-section')}
                className="text-white/90 hover:text-white transition-colors text-left"
              >
                Community
              </button>
              <button 
                onClick={() => scrollToSection('meet-raych')}
                className="text-white/90 hover:text-white transition-colors text-left"
              >
                Meet Raych
              </button>
              <button 
                onClick={handleDonateClick}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 flex items-center"
              >
                <Heart className="w-4 h-4 mr-2" />
                Donate
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}