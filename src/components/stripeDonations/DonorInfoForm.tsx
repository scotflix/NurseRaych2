export function DonorInfoForm({
  donorInfo,
  setDonorInfo,
  selectedPayment,
}: {
  donorInfo: { name: string; email: string; phone: string };
  setDonorInfo: (info: any) => void;
  selectedPayment: string;
}) {
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
      <h4 className="text-lg font-semibold text-white mb-4">Donor Information</h4>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={donorInfo.name}
          onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={donorInfo.email}
          onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {selectedPayment === 'flutterwave' && (
          <input
            type="tel"
            placeholder="Phone Number (for M-Pesa)"
            value={donorInfo.phone}
            onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        )}
      </div>
    </div>
  );
}
