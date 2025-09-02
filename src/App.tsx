import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SEO from './components/SEO';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { StorySection } from './components/StorySection';
import { Timeline } from './components/Timeline';
// import { KnowledgeCurator } from './components/KnowledgeCurator';
import { CommunityAdvocacy } from './components/CommunityAdvocacy';
import { MeetNurseRaych } from './components/MeetNurseRaych';
import { DonatePage } from './components/DonatePage';
import { Footer } from './components/Footer';
import { JoinCampaignPage } from './components/JoinCampaignPage';
import { DonationCheckoutPage } from './components/DonationCheckoutPage';
import './App.css';
import { DonationSuccessPage } from './components/DonationSuccessPage';
import Founders from './components/Founders';
import { AboutPage } from './components/about-us';

function HomePage() {
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Nurse Raych - Healthcare Advocacy & Community Support",
    "description": "Join Nurse Raych in transforming healthcare through advocacy, education, and community support.",
    "url": "https://nurseraychfoundation.org",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nurseraychfoundation.org"
      }]
    }
  };

  return (
    <>
      <SEO 
        title="Nurse Raych - Healthcare Advocacy & Community Support"
        description="Join Nurse Raych in transforming healthcare through advocacy, education, and community support. Empowering patients and healthcare professionals to create meaningful change."
        structuredData={homeStructuredData}
      />
      <Navigation />
      <Hero />
      <AboutPage />
      <StorySection />
      <Timeline />
      {/* <KnowledgeCurator /> */}
      <CommunityAdvocacy />
      <MeetNurseRaych />
      <DonatePage />
      <Founders />
      
    </>
  );
}

function App() {
  return (
    <Router >
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Story */}
        <Route path="/story" element={
          <>
            <SEO 
              title="Raych's Story - Nurse Raych Foundation"
              description="Discover the inspiring journey and mission behind the Nurse Raych Foundation."
              canonical="https://nurseraychfoundation.org/story"
            />
            <Navigation />
            <StorySection />
            <Footer />
          </>
        } />

        {/* Timeline */}
        <Route path="/timeline" element={
          <>
            <SEO 
              title="Timeline - Nurse Raych Foundation"
              description="Explore the milestones and impact timeline of Nurse Raych Foundation."
              canonical="https://nurseraychfoundation.org/timeline"
            />
            <Navigation />
            <Timeline />
            <Footer />
          </>
        } />

        {/* Community Advocacy */}
        <Route path="/community-advocacy" element={
          <>
            <SEO 
              title="Community Advocacy - Nurse Raych Foundation"
              description="Learn about our community advocacy initiatives for healthcare awareness and education."
              canonical="https://nurseraychfoundation.org/community-advocacy"
            />
            <Navigation />
            <CommunityAdvocacy />
            <Footer />
          </>
        } />

        {/* Meet Nurse Raych */}
        <Route path="/meet-nurse-raych" element={
          <>
            <SEO 
              title="Meet Nurse Raych - Nurse Raych Foundation"
              description="Meet the founder of Nurse Raych Foundation and her dedication to healthcare advocacy."
              canonical="https://nurseraychfoundation.org/meet-nurse-raych"
            />
            <Navigation />
            <MeetNurseRaych />
            <Footer />
          </>
        } />

        {/* Founders */}
        <Route path="/founders" element={
          <>
            <SEO 
              title="Founders - Nurse Raych Foundation"
              description="Learn about the founders and leadership of the Nurse Raych Foundation."
              canonical="https://nurseraychfoundation.org/founders"
            />
            <Navigation />
            <Founders />
            
          </>
        } />

        {/* Join Campaign */}
        <Route path="/join-campaign" element={
          <>
            <SEO 
              title="Join Our Campaign - Nurse Raych Foundation"
              description="Be part of the Nurse Raych Foundation campaign for better healthcare advocacy."
              canonical="https://nurseraychfoundation.org/join-campaign"
            />
            
            <JoinCampaignPage />
            <Footer />
          </>
        } />

        {/* Donate */}
        <Route path="/donate" element={
          <>
            <SEO 
              title="Donate - Nurse Raych Foundation"
              description="Support the Nurse Raych Foundation through your generous donations."
              canonical="https://nurseraychfoundation.org/donate"
            />
           
            <DonationCheckoutPage />
            <Footer />
          </>
        } />

        {/* Donation Success */}
        <Route path="/donation-success" element={
          <>
            <SEO 
              title="Donation Success - Nurse Raych Foundation"
              description="Thank you for supporting the Nurse Raych Foundation! Your donation makes a difference."
              canonical="https://nurseraychfoundation.org/donation-success"
              noIndex={true}  /* prevent indexing since it's transactional */
            />
            
            <DonationSuccessPage />
            <Footer />
          </>
        } />

        <Route path="/about" element={<AboutPage />} />

      </Routes>
    </Router>
  );
}

export default App;
