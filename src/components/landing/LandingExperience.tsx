"use client";

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsAndShift } from './components/StatsAndShift';
import { CorePlatformOS } from './components/CorePlatformOS';
import { DimensionsOfTalent } from './components/DimensionsOfTalent';
import { CinematicVideoShowcase } from './components/CinematicVideoShowcase';
import { BlogMatrix } from './components/BlogMatrix';
import { VideoContentSection } from './components/VideoContentSection';
import { NewsUpdatesSection } from './components/NewsUpdatesSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { DemoModal } from './components/DemoModal';
import { CookieConsent } from './components/CookieConsent';
import { ToastProvider } from './hooks/useToast';
import { ViewType } from './types/navigation.types';

// Lazy-load secondary view pages to optimize initial landing page bundle
const ExploreRolesPage = lazy(() => import('./components/ExploreRolesPage').then(m => ({ default: m.ExploreRolesPage })));
const ReferAndEarnPage = lazy(() => import('./components/ReferAndEarnPage').then(m => ({ default: m.ReferAndEarnPage })));
const WhyLetGetInPage = lazy(() => import('./components/WhyLetGetInPage').then(m => ({ default: m.WhyLetGetInPage })));
const FeaturesPage = lazy(() => import('./components/FeaturesPage').then(m => ({ default: m.FeaturesPage })));
const SixDimensionsPage = lazy(() => import('./components/SixDimensionsPage').then(m => ({ default: m.SixDimensionsPage })));
const JobDiscoveryPage = lazy(() => import('./components/JobDiscoveryPage').then(m => ({ default: m.JobDiscoveryPage })));
const DirectCompanyBidsPage = lazy(() => import('./components/DirectCompanyBidsPage').then(m => ({ default: m.DirectCompanyBidsPage })));
const ResourcesPage = lazy(() => import('./components/ResourcesPage').then(m => ({ default: m.ResourcesPage })));
const AboutPage = lazy(() => import('./components/AboutPage').then(m => ({ default: m.AboutPage })));
const EmployersPage = lazy(() => import('./components/EmployersPage').then(m => ({ default: m.EmployersPage })));
const CareersPage = lazy(() => import('./components/CareersPage').then(m => ({ default: m.CareersPage })));
const BlogPage = lazy(() => import('./components/BlogPage').then(m => ({ default: m.BlogPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then(m => ({ default: m.ContactPage })));
const AiRecruitmentSuitePage = lazy(() => import('./components/AiRecruitmentSuitePage').then(m => ({ default: m.AiRecruitmentSuitePage })));
const EnterpriseAiPage = lazy(() => import('./components/EnterpriseAiPage').then(m => ({ default: m.EnterpriseAiPage })));
const HuremasoPage = lazy(() => import('./components/HuremasoPage').then(m => ({ default: m.HuremasoPage })));
const HumanDataPage = lazy(() => import('./components/HumanDataPage').then(m => ({ default: m.HumanDataPage })));
const ContactSalesPage = lazy(() => import('./components/ContactSalesPage').then(m => ({ default: m.ContactSalesPage })));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./components/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const PoliciesPage = lazy(() => import('./components/PoliciesPage').then(m => ({ default: m.PoliciesPage })));
const SecurityPage = lazy(() => import('./components/SecurityPage').then(m => ({ default: m.SecurityPage })));
const CustomerCarePage = lazy(() => import('./components/CustomerCarePage').then(m => ({ default: m.CustomerCarePage })));
const HelpCentrePage = lazy(() => import('./components/HelpCentrePage').then(m => ({ default: m.HelpCentrePage })));
const CookiePolicyPage = lazy(() => import('./components/CookiePolicyPage').then(m => ({ default: m.CookiePolicyPage })));

const PageFallbackLoader: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#f8fbfe]">
    <div className="w-10 h-10 border-3 border-[#0066cc]/20 border-t-[#0066cc] rounded-full animate-spin mb-4" />
    <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Loading experience...</span>
  </div>
);

const getViewFromPath = (path: string): ViewType => {
  const normalized = path.toLowerCase().replace(/\/$/, '') || '/';
  if (normalized === '/roles') return 'roles';
  if (normalized === '/refer-and-earn') return 'refer-and-earn';
  if (normalized === '/why-letgetin') return 'why-letgetin';
  if (normalized === '/features') return 'features';
  if (normalized === '/the-6-dimensions') return 'the-6-dimensions';
  if (normalized === '/jobs/ai-engineering') return 'jobs-ai-engineering';
  if (normalized === '/jobs/finance-accounting') return 'jobs-finance-accounting';
  if (normalized === '/jobs/healthcare') return 'jobs-healthcare';
  if (normalized === '/direct-company-bids') return 'direct-company-bids';
  if (normalized === '/resources') return 'resources';
  if (normalized === '/about') return 'about';
  if (normalized === '/employers') return 'employers';
  if (normalized === '/careers') return 'careers';
  if (normalized === '/blog') return 'blog';
  if (normalized === '/contact') return 'contact';
  if (normalized === '/enterprise/ai-recruitment-suite') return 'enterprise-ai-recruitment-suite';
  if (normalized === '/enterprise/ai') return 'enterprise-ai';
  if (normalized === '/enterprise/huremaso') return 'enterprise-huremaso';
  if (normalized === '/enterprise/human-data') return 'enterprise-human-data';
  if (normalized === '/enterprise/contact-sales') return 'enterprise-contact-sales';
  if (normalized === '/privacy') return 'privacy';
  if (normalized === '/terms') return 'terms';
  if (normalized === '/policies') return 'policies';
  if (normalized === '/security') return 'security';
  if (normalized === '/customer-care') return 'customer-care';
  if (normalized === '/help-centre' || normalized === '/help') return 'help-centre';
  if (normalized === '/cookie-policy') return 'cookie-policy';
  return 'landing';
};

const getPathFromView = (view: ViewType): string => {
  if (view === 'roles') return '/roles';
  if (view === 'refer-and-earn') return '/refer-and-earn';
  if (view === 'why-letgetin') return '/why-letgetin';
  if (view === 'features') return '/features';
  if (view === 'the-6-dimensions') return '/the-6-dimensions';
  if (view === 'jobs-ai-engineering') return '/jobs/ai-engineering';
  if (view === 'jobs-finance-accounting') return '/jobs/finance-accounting';
  if (view === 'jobs-healthcare') return '/jobs/healthcare';
  if (view === 'direct-company-bids') return '/direct-company-bids';
  if (view === 'resources') return '/resources';
  if (view === 'about') return '/about';
  if (view === 'employers') return '/employers';
  if (view === 'careers') return '/careers';
  if (view === 'blog') return '/blog';
  if (view === 'contact') return '/contact';
  if (view === 'enterprise-ai-recruitment-suite') return '/enterprise/ai-recruitment-suite';
  if (view === 'enterprise-ai') return '/enterprise/ai';
  if (view === 'enterprise-huremaso') return '/enterprise/huremaso';
  if (view === 'enterprise-human-data') return '/enterprise/human-data';
  if (view === 'enterprise-contact-sales') return '/enterprise/contact-sales';
  if (view === 'privacy') return '/privacy';
  if (view === 'terms') return '/terms';
  if (view === 'policies') return '/policies';
  if (view === 'security') return '/security';
  if (view === 'customer-care') return '/customer-care';
  if (view === 'help-centre') return '/help-centre';
  if (view === 'cookie-policy') return '/cookie-policy';
  return '/';
};

interface LandingExperienceProps {
  initialPath?: string;
}

export const LandingExperience: React.FC<LandingExperienceProps> = ({ initialPath }) => {
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    if (initialPath) {
      return getViewFromPath(initialPath);
    }
    if (typeof window !== 'undefined') {
      return getViewFromPath(window.location.pathname);
    }
    return 'landing';
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'signup' | 'video' | 'enterprise' | 'signin'>('signup');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleNavigate = (path: string) => {
    const nextView = getViewFromPath(path);
    setCurrentView(nextView);
    const targetPath = getPathFromView(nextView);
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo(0, 0);
  };

  const handleOpenRoles = () => {
    handleNavigate('/roles');
  };

  const handleBackToHome = () => {
    handleNavigate('/');
  };

  const handleOpenDemo = () => {
    setModalMode('signup');
    setModalOpen(true);
  };

  const handleOpenVideoDemo = () => {
    setModalMode('video');
    setModalOpen(true);
  };

  const handleOpenEnterprise = () => {
    setModalMode('enterprise');
    setModalOpen(true);
  };

  const handleOpenSignIn = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'refer-and-earn':
        return <ReferAndEarnPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'why-letgetin':
        return <WhyLetGetInPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'features':
        return <FeaturesPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'the-6-dimensions':
        return <SixDimensionsPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'jobs-ai-engineering':
        return <JobDiscoveryPage sector="ai-engineering" onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'jobs-finance-accounting':
        return <JobDiscoveryPage sector="finance-accounting" onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'jobs-healthcare':
        return <JobDiscoveryPage sector="healthcare" onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'direct-company-bids':
        return <DirectCompanyBidsPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'resources':
        return <ResourcesPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'employers':
        return <EmployersPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'careers':
        return <CareersPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'blog':
        return <BlogPage onOpenVideoDemo={handleOpenVideoDemo} onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'enterprise-ai-recruitment-suite':
        return <AiRecruitmentSuitePage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'enterprise-ai':
        return <EnterpriseAiPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'enterprise-huremaso':
        return <HuremasoPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'enterprise-human-data':
        return <HumanDataPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'enterprise-contact-sales':
        return <ContactSalesPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyPolicyPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsOfServicePage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'policies':
        return <PoliciesPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'security':
        return <SecurityPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'customer-care':
        return <CustomerCarePage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'help-centre':
        return <HelpCentrePage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'cookie-policy':
        return <CookiePolicyPage onOpenDemo={handleOpenDemo} onNavigate={handleNavigate} />;
      case 'landing':
      default:
        return (
          <>
            {/* 2. Hero Section */}
            <HeroSection 
              onOpenDemo={handleOpenDemo}
              onOpenVideoDemo={handleOpenVideoDemo}
            />

            {/* 3. Cinematic Video Showcase Section */}
            <CinematicVideoShowcase 
              onOpenDemo={handleOpenDemo}
              onViewRoles={handleOpenRoles}
            />

            {/* 4. Stats & The Shift */}
            <StatsAndShift />

            {/* 5. Core Features OS & APEX Benchmarks */}
            <CorePlatformOS 
              onOpenDemo={handleOpenDemo}
            />

            {/* 6. The 6 Dimensions of Talent */}
            <DimensionsOfTalent />

            {/* 7. Blog & Research Matrix */}
            <BlogMatrix />

            {/* 8. Video Walkthrough Hub */}
            <VideoContentSection 
              onOpenVideoDemo={handleOpenVideoDemo}
            />

            {/* 9. News, Updates & Testimonials */}
            <NewsUpdatesSection />

            {/* 10. Final CTA Banner */}
            <FinalCTA 
              onOpenDemo={handleOpenDemo}
              onOpenEnterprise={handleOpenEnterprise}
            />
          </>
        );
    }
  };

  // Dedicated Roles View
  if (currentView === 'roles') {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#f8fafc]">
          <Suspense fallback={<PageFallbackLoader />}>
            <ExploreRolesPage 
              onBackToHome={handleBackToHome}
              onOpenDemo={handleOpenDemo}
            />
          </Suspense>

          <DemoModal 
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            mode={modalMode}
          />

          <CookieConsent onNavigateToCookiePolicy={() => handleNavigate('/cookie-policy')} />
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f8fbfe] text-slate-800 selection:bg-[#0066cc] selection:text-white flex flex-col font-sans">
        {/* 1. Header / Navigation */}
        <Navbar 
          onOpenDemo={handleOpenDemo}
          onOpenSignIn={handleOpenSignIn}
          onNavigate={handleNavigate}
        />

        {/* Main Route Content */}
        <main className="flex-1">
          <Suspense fallback={<PageFallbackLoader />}>
            {renderContent()}
          </Suspense>
        </main>

        {/* 11. Footer */}
        <Footer 
          onOpenSignIn={handleOpenSignIn}
          onOpenSignUp={handleOpenDemo}
          onNavigate={handleNavigate}
        />

        {/* Interactive Modal Dialog */}
        <DemoModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={modalMode}
        />

        {/* Cookie Consent Banner & Preferences Modal */}
        <CookieConsent onNavigateToCookiePolicy={() => handleNavigate('/cookie-policy')} />
      </div>
    </ToastProvider>
  );
};

export default LandingExperience;
