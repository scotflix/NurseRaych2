import { CheckCircle,  } from 'lucide-react';

export function SuccessScreen({

  
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
             
            </div>

            {/* Personal Thank You */}
            <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl p-8 border border-white/20 mb-8">
              <div className="text-6xl mb-4">👩🏽‍⚕️</div>
              <blockquote className="text-2xl text-white/90 italic leading-relaxed mb-6">
                "Your generosity brings us one step closer to a world where healthcare knowledge reaches every corner of our communities. Thank you for believing in our mission."
              </blockquote>
              <cite className="text-cyan-300 font-semibold text-lg">— Nurse Raych</cite>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}