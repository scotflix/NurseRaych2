import { useState } from 'react';
import { Heart, Facebook, Twitter, Instagram, Copy } from 'lucide-react';

export function ShareModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just donated to Nurse Raych's campaign to bring healthcare to underserved communities! Join me in making a difference. #NurseRaych #HealthForAll`;
  const shareUrl = 'https://nurseraych.org/donate';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 max-w-md w-full">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Share Your Impact</h3>
        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl p-6 mb-6 text-center">
          <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-white font-bold mb-2">I Made a Difference Today!</h4>
          <p className="text-white/90 text-sm">Supporting Nurse Raych's Health Initiative</p>
        </div>
        <div className="space-y-4">
          <div className="flex space-x-3">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Facebook className="w-5 h-5 mr-2" />
              Facebook
            </button>
            <button className="flex-1 bg-cyan-500 text-white py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-colors flex items-center justify-center">
              <Twitter className="w-5 h-5 mr-2" />
              Twitter
            </button>
          </div>
          <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center">
            <Instagram className="w-5 h-5 mr-2" />
            Instagram Story
          </button>
          <button 
            onClick={copyToClipboard}
            className="w-full backdrop-blur-md bg-white/10 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/15 transition-colors flex items-center justify-center"
          >
            <Copy className="w-5 h-5 mr-2" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        <button 
          onClick={onClose}
          className="w-full mt-6 text-white/70 hover:text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}