import SEO from './SEO';
import { Navigation } from './Navigation';
import Founders from './Founders';
import { Heart, Users, Award } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

export function AboutPage() {
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Nurse Raych Foundation",
    "description": "Learn about Nurse Raych Foundation – our mission, vision, values, advocacy, and leadership team working to improve healthcare access.",
    "url": "https://nurseraychfoundation.org/about",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "About Us",
        "item": "https://nurseraychfoundation.org/about"
      }]
    }
  };

  return (
    <>
      <SEO 
        title="About Us - Nurse Raych Foundation"
        description="Discover our mission, vision, values, and the inspiring journey behind Nurse Raych Foundation."
        structuredData={aboutStructuredData}
        canonical="https://nurseraychfoundation.org/about"
      />
      <Navigation />

      <div className="pt-24">
        {/* Intro */}
        <section className="relative text-center px-6 py-24 overflow-hidden 
          bg-gradient-to-br from-purple-600/30 via-cyan-500/20 to-pink-500/20 
          backdrop-blur-xl border-b border-white/20 shadow-xl">
          <Tilt glareEnable={true} glareMaxOpacity={0.3} scale={1.05} transitionSpeed={1000}>
            {/* Animated gradient blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply blur-3xl animate-pulse delay-700"></div>

            {/* Overlay for subtle 3D grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]"></div>

            {/* Content */}
            <div className="relative z-10">
              <h1 className="text-6xl font-extrabold bg-clip-text text-transparent 
                bg-gradient-to-r from-purple-400 via-cyan-300 to-pink-400 
                drop-shadow-lg animate-fadeIn">
                About Us
              </h1>
              <p className="mt-6 text-xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-slideUp">
                The Nurse Raych Foundation is a movement built on compassion, advocacy, 
                and education. We believe that healthcare is a right, not a privilege, 
                and work tirelessly to close gaps in underserved communities.
              </p>
            </div>
          </Tilt>
        </section>

        {/* Mission & Vision + Images */}
        <section className="py-20 px-6 container mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Mission card */}
          <Tilt glareEnable={true} glareMaxOpacity={0.3} scale={1.05}>
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 hover:bg-white/15 shadow-lg shadow-purple-500/20">
              <h2 className="text-3xl font-bold text-white mb-4">🌍 Our Mission</h2>
              <p className="text-white/80 leading-relaxed">
                To empower communities with knowledge, resources, and advocacy for better 
                healthcare outcomes. We focus on education, preventive care, and community-driven 
                solutions that bring healthcare closer to the people who need it most.
              </p>
            </div>
          </Tilt>

          {/* Stylish Image */}
          <Tilt scale={1.05} glareEnable={true} glareMaxOpacity={0.4}>
            <img 
              src={`${import.meta.env.BASE_URL}images/image2.jpeg`} 
              alt="Mission in action" 
              className="rounded-3xl shadow-lg border border-white/20 object-cover w-full h-96 hover:scale-105 transition-transform duration-500"
            />
          </Tilt>
        </section>

        <section className="py-20 px-6 container mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Stylish Image */}
          <Tilt scale={1.05} glareEnable={true} glareMaxOpacity={0.4}>
            <img 
              src={`${import.meta.env.BASE_URL}images/image10.jpeg`} 
              alt="Vision for the future" 
              className="rounded-3xl shadow-lg border border-white/20 object-cover w-full h-96 hover:scale-105 transition-transform duration-500"
            />
          </Tilt>

          {/* Vision card */}
          <Tilt glareEnable={true} glareMaxOpacity={0.3} scale={1.05}>
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 hover:bg-white/15 shadow-lg shadow-cyan-500/20">
              <h2 className="text-3xl font-bold text-white mb-4">✨ Our Vision</h2>
              <p className="text-white/80 leading-relaxed">
                A world where every individual, regardless of location or background, 
                has the knowledge and access needed to make informed healthcare decisions 
                and receive dignified care.
              </p>
            </div>
          </Tilt>
        </section>

        {/* Core Values */}
        <section className="py-20 px-6 container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">💡 Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Tilt glareEnable={true} glareMaxOpacity={0.4} scale={1.05}>
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg shadow-pink-500/20 hover:scale-105 transition-all">
                <Heart className="w-10 h-10 text-pink-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">Compassion</h3>
                <p className="text-white/70">We put humanity at the heart of every initiative we lead.</p>
              </div>
            </Tilt>

            <Tilt glareEnable={true} glareMaxOpacity={0.4} scale={1.05}>
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all">
                <Users className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">Community</h3>
                <p className="text-white/70">We believe in empowering communities to lead their own change.</p>
              </div>
            </Tilt>

            <Tilt glareEnable={true} glareMaxOpacity={0.4} scale={1.05}>
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg shadow-purple-500/20 hover:scale-105 transition-all">
                <Award className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">Excellence</h3>
                <p className="text-white/70">We hold ourselves accountable to deliver sustainable impact.</p>
              </div>
            </Tilt>
          </div>
        </section>

        <Founders />
      </div>
    </>
  );
}
