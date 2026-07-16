import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoadingView from './components/LoadingView';
import FeaturesSection from './components/FeaturesSection';
import BentoSection from './components/BentoSection';
import AppScreensSection from './components/AppScreensSection';
import HowItWorksSection from './components/HowItWorksSection';
import TrustSection from './components/TrustSection';
import PremiumTeaserSection from './components/PremiumTeaserSection';
import FaqSection from './components/FaqSection';
import ContactTicketSection from './components/ContactTicketSection';
import DownloadCtaSection from './components/DownloadCtaSection';
import SiteFooter from './components/SiteFooter';
import './App.css';

function scrollToHash() {
  const hash = window.location.hash?.replace(/^#/, '');
  if (!hash) return;
  const el = document.getElementById(hash);
  if (!el) return;
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    scrollToHash();
  }, [isLoading]);

  return (
    <div className="app app--ios26">
      <LoadingView isLoading={isLoading} />
      {!isLoading && (
        <>
          <Header />
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <BentoSection />
          <AppScreensSection />
          <TrustSection />
          <PremiumTeaserSection />
          <FaqSection />
          <ContactTicketSection />
          <DownloadCtaSection />
          <SiteFooter />
        </>
      )}
    </div>
  );
};

export default App;
