export function RecurringToggle({
  isRecurring,
  setIsRecurring,
}: {
  isRecurring: boolean;
  setIsRecurring: (v: boolean) => void;
}) {
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Make it Monthly</h4>
          <p className="text-white/70 text-sm">Provide ongoing support to our campaigns</p>
        </div>
        <button
          onClick={() => setIsRecurring(!isRecurring)}
          className={`w-12 h-6 rounded-full transition-colors ${
            isRecurring ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-white/20'
          }`}
        >
          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
            isRecurring ? 'translate-x-6' : 'translate-x-0.5'
          }`}></div>
        </button>
      </div>
    </div>
  );
}