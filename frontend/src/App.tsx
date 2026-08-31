import React, { useState, useEffect } from 'react';
import { PackageTier, QuotationDoc } from './types/quotation.js';
import { QuotationApi } from './services/api.js';
import { Navbar } from './components/Navbar.js';
import { HeroSection } from './components/HeroSection.js';
import { StatsSection } from './components/StatsSection.js';
import { NakhonPathomHeritageSection } from './components/NakhonPathomHeritageSection.js';
import { PackageSection } from './components/PackageSection.js';
import { MenuShowcase } from './components/MenuShowcase.js';
import { PortfolioGallery } from './components/PortfolioGallery.js';
import { OurClients } from './components/OurClients.js';
import { CateringFeatures } from './components/CateringFeatures.js';
import { FleetLogistics } from './components/FleetLogistics.js';
import { ScheduleQueue } from './components/ScheduleQueue.js';
import { QuotationPage } from './components/QuotationPage.js';
import { QuotationHistory } from './components/QuotationHistory.js';
import { Testimonials } from './components/Testimonials.js';
import { FAQSection } from './components/FAQSection.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';
import { VisitorFloatingBadge } from './components/VisitorCounter.js';
import { AdminPortal } from './components/AdminPortal.js';
import { MobileBottomNav } from './components/MobileBottomNav.js';
import { LiveChatWidget } from './components/LiveChatWidget.js';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & View State: 'site' (Clean Home Page), 'quotation' (Dedicated Page), 'admin' (Admin Portal)
  const [currentView, setCurrentView] = useState<'site' | 'quotation' | 'admin'>(() => {
    if (typeof window === 'undefined') return 'site';
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (
      hash.includes('admin') ||
      hash.includes('backend') ||
      hash.includes('portal') ||
      path.includes('/admin') ||
      path.includes('/backend') ||
      path.includes('/portal') ||
      search.includes('admin')
    ) {
      return 'admin';
    }
    if (
      hash.includes('quotation') ||
      hash.includes('calculate') ||
      path.includes('/quotation') ||
      path.includes('/calculate')
    ) {
      return 'quotation';
    }
    return 'site';
  });
  const [selectedPkgForBuilder, setSelectedPkgForBuilder] = useState<PackageTier | undefined>(undefined);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Check URL Hash and Path for Routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash.includes('admin') ||
        hash.includes('backend') ||
        hash.includes('portal') ||
        path.includes('/admin') ||
        path.includes('/backend') ||
        path.includes('/portal') ||
        search.includes('admin')
      ) {
        setCurrentView('admin');
      } else if (
        hash.includes('quotation') ||
        hash.includes('calculate') ||
        path.includes('/quotation') ||
        path.includes('/calculate')
      ) {
        setCurrentView('quotation');
      } else {
        setCurrentView('site');
      }
    };

    handleHashChange(); // Initial check
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Fetch Quotation Count for Badge
  useEffect(() => {
    const checkCount = async () => {
      try {
        const quotes = await QuotationApi.getAll();
        setHistoryCount(quotes.length);
      } catch {}
    };
    checkCount();
  }, []);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers to open dedicated Quotation Page
  const handleOpenBuilder = (pkg?: PackageTier) => {
    if (pkg) {
      setSelectedPkgForBuilder(pkg);
    }
    setCurrentView('quotation');
    window.location.hash = '#quotation';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPackageFromCards = (pkg: PackageTier) => {
    handleOpenBuilder(pkg);
  };

  const handleQuotationGenerated = (quote: QuotationDoc) => {
    setHistoryCount((prev) => prev + 1);
  };

  const handleNavigateToHome = () => {
    setCurrentView('site');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. If in Full Admin Portal View
  if (currentView === 'admin') {
    return <AdminPortal onBackToSite={handleNavigateToHome} />;
  }

  // 2. If in Dedicated Quotation Builder Page View
  if (currentView === 'quotation') {
    return (
      <div className="pb-20 sm:pb-0 min-h-screen">
        <QuotationPage
          initialPackage={selectedPkgForBuilder}
          onBackToHome={handleNavigateToHome}
          onQuotationGenerated={handleQuotationGenerated}
          onOpenHistory={() => setHistoryOpen(true)}
          historyCount={historyCount}
        />
        {/* Quotation History Drawer Modal */}
        <QuotationHistory
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
        />
        {/* Real-time Live Chat Widget */}
        <LiveChatWidget onOpenBuilder={() => handleOpenBuilder()} />
        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          currentView={currentView}
          onNavigateHome={handleNavigateToHome}
          onOpenBuilder={() => handleOpenBuilder()}
        />
      </div>
    );
  }

  // 3. Clean Main Home Landing Page (NO QuotationBuilder taking up home space)
  return (
    <div className="min-h-screen bg-luxury-mesh text-slate-900 font-sans selection:bg-red-600 selection:text-white relative pb-20 sm:pb-0">
      
      {/* Sticky Top Navigation */}
      <Navbar
        onOpenBuilder={() => handleOpenBuilder()}
        onOpenHistory={() => setHistoryOpen(true)}
        historyCount={historyCount}
      />

      {/* Main Landing Page Sections */}
      <main>
        <HeroSection onOpenBuilder={() => handleOpenBuilder()} />
        <StatsSection />
        <ScheduleQueue onOpenBuilder={() => handleOpenBuilder()} />
        <NakhonPathomHeritageSection onOpenBuilder={() => handleOpenBuilder()} />
        <MenuShowcase />
        <PackageSection onSelectPackage={handleSelectPackageFromCards} />
        <PortfolioGallery />
        <OurClients />
        <CateringFeatures />
        <FleetLogistics />
        <Testimonials />
        <FAQSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => {
        setCurrentView('admin');
        window.location.hash = '#admin';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Quotation History Drawer Modal */}
      <QuotationHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      {/* Floating Bottom Live Visitor Traffic Badge (Desktop Only) */}
      <div className="hidden sm:block">
        <VisitorFloatingBadge />
      </div>

      {/* Real-time Live Chat Widget */}
      <LiveChatWidget onOpenBuilder={() => handleOpenBuilder()} />

      {/* Floating Bottom Quick Contact Buttons (Desktop Only) */}
      <div className="hidden sm:flex fixed bottom-24 right-6 z-30 flex-col gap-2.5">
        <a
          href="https://line.me/ti/p/~pang_baichaa"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white shadow-xl flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all border border-white"
          title="ติดต่อทาง LINE"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        <a
          href="tel:0830872257"
          className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-red-glow flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all border border-white"
          title="โทรติดต่อด่วน 083-087-2257"
        >
          <Phone className="w-5 h-5 animate-bounce" />
        </a>

        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-md flex items-center justify-center border border-slate-200 transition-all transform hover:scale-105"
            title="ขึ้นด้านบน"
          >
            <ArrowUp className="w-5 h-5 text-red-600" />
          </button>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onNavigateHome={handleNavigateToHome}
        onOpenBuilder={() => handleOpenBuilder()}
      />

    </div>
  );
};

export default App;
