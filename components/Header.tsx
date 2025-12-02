import React, { useState, useEffect } from 'react';
import { Page } from '../App';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, isAuthenticated, onLogout, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (currentPage !== 'home') {
        // If not on home, navigate first, then scroll after render
        onNavigate('home');
        // Increased timeout to 300ms to ensure the Home component has fully mounted
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    } else {
        // If already on home, just scroll
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  const navLinkClass = (target: Page) => 
    `text-sm font-bold transition-colors cursor-pointer ${currentPage === target ? 'text-primary' : 'text-secondary hover:text-primary'}`;

  const mobileNavLinkClass = (target: Page) =>
    `block w-full text-left py-3 text-lg font-bold border-b border-gray-100 ${currentPage === target ? 'text-primary' : 'text-secondary'}`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-secondary z-50">
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick(isAuthenticated ? 'dashboard' : 'home'); }} className="flex items-center space-x-2">
              <span className="font-serif tracking-tight">Metricis</span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
                <>
                    <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-secondary hover:text-primary transition-colors font-medium">Features</a>
                    <a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className="text-secondary hover:text-primary transition-colors font-medium">Testimonials</a>
                    <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-secondary hover:text-primary transition-colors font-medium">Pricing</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('login'); }} className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary/90 transition-colors font-semibold shadow-md">
                        Login
                    </a>
                </>
            ) : (
                <>
                    <button onClick={() => handleNavClick('dashboard')} className={navLinkClass('dashboard')}>Home</button>
                    <button onClick={() => handleNavClick('calendars')} className={navLinkClass('calendars')}>Calendars</button>
                    <button onClick={() => handleNavClick('templates')} className={navLinkClass('templates')}>Parametric Templates</button>
                    <button onClick={() => handleNavClick('library')} className={navLinkClass('library')}>Libraries</button>
                    
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    
                    <button onClick={onLogout} className="text-sm font-bold text-gray-400 hover:text-accent-pink transition-colors">
                       Sign Out
                    </button>
                </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden z-50">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-secondary focus:outline-none p-2"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-24 px-6 md:hidden animate-fade-in-up">
           <nav className="flex flex-col space-y-2">
            {!isAuthenticated ? (
                <>
                    <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="block w-full text-left py-3 text-lg font-bold border-b border-gray-100 text-secondary">Features</a>
                    <a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className="block w-full text-left py-3 text-lg font-bold border-b border-gray-100 text-secondary">Testimonials</a>
                    <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="block w-full text-left py-3 text-lg font-bold border-b border-gray-100 text-secondary">Pricing</a>
                    <button onClick={() => handleNavClick('login')} className="mt-4 w-full bg-primary text-white px-5 py-4 rounded-xl font-bold text-lg shadow-md">
                        Login
                    </button>
                </>
            ) : (
                <>
                    <button onClick={() => handleNavClick('dashboard')} className={mobileNavLinkClass('dashboard')}>Home</button>
                    <button onClick={() => handleNavClick('calendars')} className={mobileNavLinkClass('calendars')}>Calendars</button>
                    <button onClick={() => handleNavClick('templates')} className={mobileNavLinkClass('templates')}>Parametric Templates</button>
                    <button onClick={() => handleNavClick('library')} className={mobileNavLinkClass('library')}>Libraries</button>
                    
                    <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="mt-6 w-full text-center py-3 text-red-500 font-bold border border-red-100 rounded-xl bg-red-50">
                       Sign Out
                    </button>
                </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;