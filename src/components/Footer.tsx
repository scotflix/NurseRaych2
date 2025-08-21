
import { Heart, Stethoscope, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">NurseRaych</span>
            </div>
            <p className="text-white/80 leading-relaxed mb-6 max-w-md">
              Built with compassion. Led by care — the vision of Nurse Raych. 
              Transforming healthcare access one community at a time.
            </p>
            <div className="flex items-center text-white/70 mb-2">
              <Heart className="w-5 h-5 mr-2 text-pink-400" />
              <span>Founded by a nurse who knows the struggle firsthand</span>
            </div>
            <div className="text-white/60 text-sm">
              "Raych turned a rural stethoscope into a digital lifeline."
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#hero" className="text-white/70 hover:text-white transition-colors">Home</a></li>
              <li><a href="#story-section" className="text-white/70 hover:text-white transition-colors">Her Story</a></li>
              <li><a href="#timeline-section" className="text-white/70 hover:text-white transition-colors">Journey</a></li>
              <li><a href="#knowledge-section" className="text-white/70 hover:text-white transition-colors">Expertise</a></li>
              <li><a href="#community-section" className="text-white/70 hover:text-white transition-colors">Community</a></li>
              <li><a href="#meet-raych" className="text-white/70 hover:text-white transition-colors">Meet Raych</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center text-white/70">
                <Mail className="w-5 h-5 mr-3 text-cyan-400" />
                <span>nurseraych@gmail.com</span>
              </div>
              
              <div className="flex items-center text-white/70">
                <MapPin className="w-5 h-5 mr-3 text-pink-400" />
                <span>New Jersey, USA</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="text-white font-semibold mb-3">Follow Our Journey</h5>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white/60 text-center md:text-left mb-4 md:mb-0">
              © 2025 NurseRaych Health Initiative. Designed and Developed Bradley Ongus
            </div>
            
            {/* Signature */}
            <div className="flex items-center">
              <span className="text-white/60 mr-3">Inspired by the dedication of</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                — Nurse Raych
              </span>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-white/50 text-sm italic">
              "One nurse's vision is transforming the health of many."
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}