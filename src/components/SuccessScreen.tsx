import { CheckCircle, Download, Share2, Users, Calendar, Trophy } from 'lucide-react';
import { CommunityJoin } from './stripeDonations/CommunityJoin';
import { ShareModal } from './stripeDonations/ShareModal';

export function SuccessScreen({
  amount,
  currency,
  selectedTier,
  isRecurring,
  
  showShareModal,
  setShowShareModal,
}: {
  amount: string;
  currency: string;
  selectedTier: any;
  isRecurring: boolean;
  onShare: () => void;
  showShareModal: boolean;
  setShowShareModal: (v: boolean) => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="pt-20 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Success Animation */}
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Thank You! 🎉
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Your donation of <span className="text-cyan-300 font-bold">{amount} {currency}</span> will make a real difference in underserved communities.
              </p>
            </div>

            {/* Personal Thank You */}
            <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl p-8 border border-white/20 mb-8">
              <div className="text-6xl mb-4">👩🏽‍⚕️</div>
              <blockquote className="text-2xl text-white/90 italic leading-relaxed mb-6">
                "Your generosity brings us one step closer to a world where healthcare knowledge reaches every corner of our communities. Thank you for believing in our mission."
              </blockquote>
              <cite className="text-cyan-300 font-semibold text-lg">— Nurse Raych</cite>
            </div>

            {/* Impact Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">
                  {selectedTier.title}
                </div>
                <div className="text-white/80 text-sm">{selectedTier.impact}</div>
              </div>
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">
                  {isRecurring ? 'Monthly' : 'One-time'}
                </div>
                <div className="text-white/80 text-sm">
                  {isRecurring ? 'Ongoing support' : 'Immediate impact'}
                </div>
              </div>
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">Verified</div>
                <div className="text-white/80 text-sm">100% goes to programs</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                Download Receipt
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/15 transition-all duration-300 flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Your Impact
              </button>
            </div>

            {/* Share Modal */}
            <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />

            {/* Join Community */}
            <CommunityJoin />
          </div>
        </div>
      </div>
    </div>
  );
}