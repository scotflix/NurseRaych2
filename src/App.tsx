import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { StorySection } from './components/StorySection';
import { Timeline } from './components/Timeline';
//import { KnowledgeCurator } from './components/KnowledgeCurator';
import { CommunityAdvocacy } from './components/CommunityAdvocacy';
import { MeetNurseRaych } from './components/MeetNurseRaych';
import { DonatePage } from './components/DonatePage';
import { Footer } from './components/Footer';
import { JoinCampaignPage } from './components/JoinCampaignPage';
import { DonationCheckoutPage } from './components/DonationCheckoutPage';
import './App.css';
import { DonationSuccessPage } from './components/DonationSuccessPage';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <Navigation />
      <Hero />
      <StorySection />
      <Timeline />
      {/*<KnowledgeCurator /> */}
      <CommunityAdvocacy />
      <MeetNurseRaych />
      <DonatePage />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router   basename="/NurseRaych2">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/join-campaign" element={<JoinCampaignPage />} />
        <Route path="/donate" element={<DonationCheckoutPage />} />
        <Route path="/donation-success" element={<DonationSuccessPage />}/>
      </Routes>
    </Router>
  );
}

export default App;