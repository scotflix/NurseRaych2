export function CommunityJoin() {
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 mt-8">
      <h3 className="text-2xl font-bold text-white mb-4">Stay Connected</h3>
      <p className="text-white/90 mb-6">
        Join our community to receive updates on how your donation is making a difference.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          placeholder="Enter your email for updates"
          className="flex-1 px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
          Join Community
        </button>
      </div>
    </div>
  );
}