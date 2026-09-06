import React, { useState, useEffect } from 'react';
import { PackageTier, QuotationDoc } from './types/quotation.js';
import { QuotationApi } from './services/api.js';
import { Navbar, PageView } from './components/Navbar.js';
import { PageHeroBanner } from './components/PageHeroBanner.js';
import { HeroSection } from './components/HeroSection.js';
import { StatsSection } from './components/StatsSection.js';
import { NakhonPathomHeritageSection } from './components/NakhonPathomHeritageSection.js';
import { PackageSection } from './components/PackageSection.js';
import { MenuShowcase } from './components/MenuShowcase.js';
import { PortfolioGallery } from './components/PortfolioGallery.js';
import { OurClients } from './components/OurClients.js';
import { CateringFeatures } from './components/CateringFeatures.js';
import { FleetLogistics } from './components/FleetLogistics.js';
import { DroneAerialShowcase } from './components/DroneAerialShowcase.js';
import { ScheduleQueue } from './components/ScheduleQueue.js';
import { QuotationPage } from './components/QuotationPage.js';
import { QuotationBuilder } from './components/QuotationBuilder/QuotationBuilder.js';
import { MenuCatalogModal } from './components/MenuCatalogModal.js';
import { QuotationHistory } from './components/QuotationHistory.js';
import { Testimonials } from './components/Testimonials.js';
import { SocialFollowSection } from './components/SocialFollowSection.js';
import { FAQSection } from './components/FAQSection.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';
import { VisitorFloatingBadge } from './components/VisitorCounter.js';
import { AdminPortal } from './components/AdminPortal.js';
import { MobileBottomNav } from './components/MobileBottomNav.js';
import { LiveChatWidget } from './components/LiveChatWidget.js';
import { Phone, MessageCircle, ArrowUp, Sparkles, ChevronRight } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & View State: 'home' | 'menu' | 'packages' | 'quotation' | 'portfolio' | 'heritage' | 'contact' | 'admin'
  const [currentView, setCurrentView] = useState<PageView>(() => {
    if (typeof window === 'undefined') return 'home';
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
    if (hash.includes('quotation') || hash.includes('calculate') || path.includes('/quotation')) {
      return 'quotation';
    }
    if (hash.includes('menu') || hash.includes('dishes') || path.includes('/menu')) {
      return 'menu';
    }
    if (hash.includes('package') || path.includes('/package')) {
      return 'packages';
    }
    if (hash.includes('portfolio') || hash.includes('gallery') || hash.includes('fleet') || path.includes('/portfolio')) {
      return 'portfolio';
    }
    if (hash.includes('heritage') || hash.includes('story') || path.includes('/heritage')) {
      return 'heritage';
    }
    if (hash.includes('contact') || hash.includes('schedule') || hash.includes('queue') || path.includes('/contact')) {
      return 'contact';
    }
    return 'home';
  });

  const [selectedPkgForBuilder, setSelectedPkgForBuilder] = useState<PackageTier | undefined>(undefined);
  const [selectedDateForBuilder, setSelectedDateForBuilder] = useState<string | undefined>(undefined);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [catalogModalOpen, setCatalogModalOpen] = useState<boolean>(false);
  const [catalogPkgId, setCatalogPkgId] = useState<string>('pkg-2500');

  // Check URL Hash and Path for Routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();

      // Instant redirect to Google Maps Review
      if (
        path === '/review' ||
        path.startsWith('/review') ||
        path === '/google-review' ||
        path.startsWith('/google-review') ||
        hash === '#review' ||
        hash.includes('#review') ||
        search.includes('review')
      ) {
        window.location.replace(
          'https://www.google.com/search?q=%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%88%E0%B8%B5%E0%B8%99+%E0%B8%A3%E0%B8%9E%E0%B8%B5%E0%B8%9E%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B9%8C'
        );
        return;
      }

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
      } else if (hash.includes('quotation') || hash.includes('calculate') || path.includes('/quotation')) {
        setCurrentView('quotation');
      } else if (hash.includes('menu') || hash.includes('dishes') || path.includes('/menu')) {
        setCurrentView('menu');
      } else if (hash.includes('package') || path.includes('/package')) {
        setCurrentView('packages');
      } else if (hash.includes('portfolio') || hash.includes('gallery') || hash.includes('fleet') || path.includes('/portfolio')) {
        setCurrentView('portfolio');
      } else if (hash.includes('heritage') || hash.includes('story') || path.includes('/heritage')) {
        setCurrentView('heritage');
      } else if (hash.includes('contact') || hash.includes('schedule') || hash.includes('queue') || path.includes('/contact')) {
        setCurrentView('contact');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
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

  // Handler for navigation between pages
  const handleNavigate = (page: PageView) => {
    setCurrentView(page);
    window.location.hash = page === 'home' ? '' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers to open Pop-up Catalog Modal
  const handleOpenCatalogModal = (pkgId?: string) => {
    if (pkgId) setCatalogPkgId(pkgId);
    setCatalogModalOpen(true);
  };

  // Handlers to open dedicated Quotation Page or scroll to builder
  const handleOpenBuilder = (pkg?: PackageTier, date?: string) => {
    if (pkg) {
      setSelectedPkgForBuilder(pkg);
    }
    if (date) {
      setSelectedDateForBuilder(date);
    }
    handleNavigate('quotation');
  };

  const handleSelectPackageFromCards = (pkg: PackageTier, mode: 'modal' | 'scroll' = 'scroll') => {
    setSelectedPkgForBuilder(pkg);
    if (mode === 'modal') {
      handleOpenCatalogModal(pkg.id);
    } else {
      handleOpenBuilder(pkg);
    }
  };

  const handleQuotationGenerated = (quote: QuotationDoc) => {
    setHistoryCount((prev) => prev + 1);
  };

  // 1. If in Full Admin Portal View
  if (currentView === 'admin') {
    return <AdminPortal onBackToSite={() => handleNavigate('home')} />;
  }

  // 2. If in Dedicated Quotation Builder Page View
  if (currentView === 'quotation') {
    return (
      <div className="pb-20 sm:pb-0 min-h-screen bg-luxury-mesh text-slate-900 font-sans selection:bg-red-600 selection:text-white relative">
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenHistory={() => setHistoryOpen(true)}
          onOpenAdmin={() => handleNavigate('admin')}
          historyCount={historyCount}
        />
        <div className="pt-20">
          <QuotationPage
            initialPackage={selectedPkgForBuilder}
            initialDate={selectedDateForBuilder}
            onBackToHome={() => handleNavigate('home')}
            onQuotationGenerated={handleQuotationGenerated}
            onOpenHistory={() => setHistoryOpen(true)}
            historyCount={historyCount}
          />
        </div>
        <Footer onOpenAdmin={() => handleNavigate('admin')} onNavigate={handleNavigate} />
        <QuotationHistory
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
        />
        <MenuCatalogModal
          isOpen={catalogModalOpen}
          onClose={() => setCatalogModalOpen(false)}
          initialPackageId={catalogPkgId}
          onSelectForQuotation={(pkg) => handleSelectPackageFromCards(pkg, 'scroll')}
        />
        <LiveChatWidget onOpenBuilder={() => handleOpenBuilder()} />
        <MobileBottomNav
          currentView={currentView}
          onNavigate={handleNavigate}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-mesh text-slate-900 font-sans selection:bg-red-600 selection:text-white relative pb-20 sm:pb-0 overflow-x-hidden">
      
      {/* Sticky Top Navigation Bar (Multi-Page Switcher) */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenAdmin={() => handleNavigate('admin')}
        historyCount={historyCount}
      />

      {/* ========================================================================= */}
      {/* 🧭 MULTI-PAGE VIEW ROUTING CONTAINER */}
      {/* ========================================================================= */}
      <main className="w-full">
        
        {/* ========================================== */}
        {/* 1. PAGE: HOME (หน้าแรก) */}
        {/* ========================================== */}
        {currentView === 'home' && (
          <div className="animate-fadeIn">
            <HeroSection onOpenBuilder={() => handleOpenBuilder()} />
            <StatsSection />
            <ScheduleQueue onOpenBuilder={(date) => handleOpenBuilder(undefined, date)} />
            
            {/* Quick Packages Preview on Home */}
            <section className="py-12 bg-white/60 border-y border-amber-200/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-black text-red-700 uppercase tracking-widest">
                      👑 PREMIUM BANQUET PACKAGES
                    </span>
                    <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">
                      แพ็กเกจราคาโต๊ะจีน <span className="text-gradient-red-gold">ยอดนิยม</span>
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNavigate('packages')}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:from-red-500 hover:to-red-600 transition-all cursor-pointer"
                  >
                    <span>ดูแพ็กเกจทั้งหมด (1,400 - 6,000฿)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <PackageSection
                onSelectPackage={handleSelectPackageFromCards}
                onOpenCatalogModal={handleOpenCatalogModal}
              />
            </section>

            {/* Quick Menu Showcase on Home */}
            <section className="py-12 bg-amber-50/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-amber-900 uppercase tracking-widest">
                    🍲 CHEF SPECIAL DISHES
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">
                    เมนูอาหารโต๊ะจีน <span className="text-gradient-red-gold">สูตรภัตตาคาร 35+ ปี</span>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigate('menu')}
                  className="px-5 py-2.5 rounded-2xl bg-white border border-amber-300 text-red-700 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-xs hover:bg-amber-50 transition-all cursor-pointer"
                >
                  <span>เปิดดูคลังเมนูอาหารทั้งหมด</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <MenuShowcase />
            </section>

            {/* Quick Quotation Builder Section on Home */}
            <section id="quotation-builder" className="py-16 bg-gradient-to-b from-white via-amber-50/30 to-white relative scroll-mt-24 border-t border-amber-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <QuotationBuilder
                  initialPackage={selectedPkgForBuilder}
                  initialDate={selectedDateForBuilder}
                  onQuotationGenerated={handleQuotationGenerated}
                />
              </div>
            </section>

            <PortfolioGallery />
            <OurClients />
            <CateringFeatures />
            <FleetLogistics />
            <Testimonials />
            <SocialFollowSection />
            <FAQSection />
            <ContactSection />
          </div>
        )}

        {/* ========================================== */}
        {/* 2. PAGE: MENU (หน้าเมนูอาหาร) */}
        {/* ========================================== */}
        {currentView === 'menu' && (
          <div className="animate-fadeIn">
            <PageHeroBanner
              badge="คลังภาพอาหาร & สูตรเด็ดภัตตาคาร"
              title="เมนูอาหารโต๊ะจีน"
              highlightText="สูตรลับ 35+ ปี นครปฐม"
              subtitle="รวมรายการอาหารโต๊ะจีนทุกหมวดหมู่ ออเดิร์ฟร้อน-เย็น, ซุปหูฉลาม, ขาหมูเยอรมัน, ปลากะพงนึ่งซีอิ๊ว, ข้าวผัดปู และของหวาน ปรุงสดใหม่กระทะต่อกระทะ"
              breadcrumb="เมนูอาหาร"
              onNavigateHome={() => handleNavigate('home')}
              onOpenBuilder={() => handleOpenBuilder()}
              ctaText="จัดเซ็ตเมนู & คำนวณราคา"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <MenuShowcase />
            </div>
            {/* Action Banner to Quotation */}
            <section className="py-10 bg-gradient-to-r from-red-700 via-red-800 to-amber-700 text-white my-8 mx-4 sm:mx-8 rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-black">
                  เลือกเมนูที่ชอบแล้วหรือยัง? คำนวณราคาและออกใบเสนอราคาได้ทันที
                </h3>
                <p className="text-xs sm:text-sm text-amber-200 font-medium">
                  เปลี่ยนเมนูตามใจชอบได้ทุกจาน พร้อมพิมพ์เอกสาร A4 และส่งสรุปทาง LINE ได้ทันที
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNavigate('quotation')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-red-700 font-black text-sm shadow-xl flex items-center gap-2 border-2 border-amber-300 shrink-0 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>ไปหน้าคำนวณราคา</span>
              </button>
            </section>
          </div>
        )}

        {/* ========================================== */}
        {/* 3. PAGE: PACKAGES (หน้าแพ็กเกจราคา) */}
        {/* ========================================== */}
        {currentView === 'packages' && (
          <div className="animate-fadeIn">
            <PageHeroBanner
              badge="คุ้มค่า มั่นใจ มาตรฐานภัตตาคาร"
              title="แพ็กเกจราคาโต๊ะจีน"
              highlightText="ครบทุกระดับ 1,400 - 6,000฿"
              subtitle="ฟรี! อุปกรณ์ครบชุด โต๊ะ เก้าอี้ ผ้าคลุม ผูกโบว์ 5 ธีมสี (ม่วง, ทอง, ชมพู, ฟ้า, เขียว) โดยไม่มีค่าใช้จ่ายเพิ่ม ทุกแพ็กเกจราคา"
              breadcrumb="แพ็กเกจราคา"
              onNavigateHome={() => handleNavigate('home')}
              onOpenBuilder={() => handleOpenBuilder()}
              ctaText="เลือกแพ็กเกจคำนวณราคา"
            />
            <div className="py-8">
              <PackageSection
                onSelectPackage={handleSelectPackageFromCards}
                onOpenCatalogModal={handleOpenCatalogModal}
              />
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 4. PAGE: PORTFOLIO (หน้าผลงานจัดเลี้ยง & ศักยภาพ) */}
        {/* ========================================== */}
        {currentView === 'portfolio' && (
          <div className="animate-fadeIn">
            <PageHeroBanner
              badge="ศักยภาพจัดเลี้ยงสูงสุด 750 โต๊ะ/วัน"
              title="ผลงานจัดเลี้ยง & ขบวนรถบริการ"
              highlightText="ทั่วประเทศไทย"
              subtitle="ภาพผลงานงานแต่งงาน งานบุญ งานบวช งานองค์กร พร้อมขบวนรถบริการครัวเคลื่อนที่มาตรฐานระดับสากล และวิดีโอโดรน 4K"
              breadcrumb="ผลงานจัดเลี้ยง"
              onNavigateHome={() => handleNavigate('home')}
              onOpenBuilder={() => handleOpenBuilder()}
              ctaText="คำนวณราคาจัดเลี้ยง"
            />
            <div className="py-6 space-y-12">
              <PortfolioGallery />
              <DroneAerialShowcase />
              <FleetLogistics />
              <OurClients />
              <CateringFeatures />
              <Testimonials />
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 5. PAGE: HERITAGE (หน้าตำนาน 35+ ปี นครปฐม) */}
        {/* ========================================== */}
        {currentView === 'heritage' && (
          <div className="animate-fadeIn">
            <PageHeroBanner
              badge="ต้นตำรับโต๊ะจีนเมืองนครปฐม"
              title="ตำนานความอร่อย 35+ ปี"
              highlightText="โต๊ะจีนรพีพัฒน์"
              subtitle="เรื่องราวความเป็นมา รสชาติอันเป็นเอกลักษณ์ การผัดกระทะเหล็กเตาถ่านไฟแรง และการส่งต่อความอร่อยสู่รุ่นที่ 2 อย่างยิ่งใหญ่"
              breadcrumb="ตำนาน 35+ ปี"
              onNavigateHome={() => handleNavigate('home')}
              onOpenBuilder={() => handleOpenBuilder()}
              ctaText="เลือกชิมเมนูในตำนาน"
            />
            <div className="py-6 space-y-12">
              <NakhonPathomHeritageSection onOpenBuilder={() => handleOpenBuilder()} />
              <CateringFeatures />
              <OurClients />
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 6. PAGE: CONTACT (หน้าคิวงาน & ติดต่อเรา) */}
        {/* ========================================== */}
        {currentView === 'contact' && (
          <div className="animate-fadeIn">
            <PageHeroBanner
              badge="เช็คคิวงาน & จองวันจัดเลี้ยง"
              title="ตารางคิวงาน & แผนที่ติดต่อ"
              highlightText="โต๊ะจีนรพีพัฒน์"
              subtitle="ตรวจสอบวันที่ว่างจัดเลี้ยงได้แบบเรียลไทม์ ปรึกษาและจองคิวงานล่วงหน้า แผนที่ตั้งครัวกลางนครปฐม และเบอร์โทรสายด่วน"
              breadcrumb="คิวงาน & ติดต่อเรา"
              onNavigateHome={() => handleNavigate('home')}
              onOpenBuilder={() => handleOpenBuilder()}
              ctaText="คำนวณราคา & จองคิว"
            />
            <div className="py-6 space-y-12">
              <ScheduleQueue onOpenBuilder={(date) => handleOpenBuilder(undefined, date)} />
              <ContactSection />
              <SocialFollowSection />
              <FAQSection />
            </div>
          </div>
        )}

      </main>

      {/* Footer across all pages */}
      <Footer onOpenAdmin={() => handleNavigate('admin')} onNavigate={handleNavigate} />

      {/* Quotation History Drawer Modal */}
      <QuotationHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      {/* Menu Catalog Modal (Pop-up A4 Brochure & Dishes) */}
      <MenuCatalogModal
        isOpen={catalogModalOpen}
        onClose={() => setCatalogModalOpen(false)}
        initialPackageId={catalogPkgId}
        onSelectForQuotation={(pkg) => handleSelectPackageFromCards(pkg, 'scroll')}
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
          className="w-12 h-12 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white shadow-xl flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all border border-white cursor-pointer"
          title="ติดต่อทาง LINE"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        <a
          href="tel:0813311646"
          className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-red-glow flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all border border-white cursor-pointer"
          title="โทรติดต่อด่วน 081-331-1646"
        >
          <Phone className="w-5 h-5 animate-bounce" />
        </a>

        {showScrollTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-md flex items-center justify-center border border-slate-200 transition-all transform hover:scale-105 cursor-pointer"
            title="ขึ้นด้านบน"
          >
            <ArrowUp className="w-5 h-5 text-red-600" />
          </button>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
      />

    </div>
  );
};

export default App;
