import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import TemplateGallery from './components/TemplateGallery';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SmartCalendarTool from './components/SmartCalendarTool';
import ParametricTemplateTool from './components/ParametricTemplateTool';

export type Page = 'home' | 'login' | 'dashboard' | 'calendars' | 'templates' | 'library';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const navigateTo = (targetPage: Page) => {
    // If trying to access private pages without auth, redirect to login
    if (['dashboard', 'calendars', 'templates', 'library'].includes(targetPage) && !isAuthenticated) {
      setPage('login');
    } else {
      setPage(targetPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (email: string, pass: string): boolean => {
    // Hardcoded credentials for demonstration
    if (email === 'designer@metricis.com' && pass === 'password') {
      setIsAuthenticated(true);
      setUserEmail(email);
      navigateTo('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    navigateTo('home');
  };

  // Render content based on current page state
  const renderContent = () => {
    if (page === 'home') {
      return (
        <>
          <Hero onNavigate={() => navigateTo('login')} />
          <Features />
          <TemplateGallery showPersonal={false} />
          <Testimonials />
          <Pricing />
          <CTA onNavigate={() => navigateTo('login')} />
        </>
      );
    }

    if (page === 'login') return <Login onLogin={handleLogin} />;

    // Authenticated Routes
    if (isAuthenticated) {
      switch (page) {
        case 'calendars':
          return (
            <div className="pt-24 pb-12 min-h-screen bg-surface">
              <div className="container mx-auto px-6">
                <SmartCalendarTool onBack={() => navigateTo('dashboard')} />
              </div>
            </div>
          );
        case 'templates':
          return (
            <div className="pt-24 pb-12 min-h-screen bg-surface">
              <div className="container mx-auto px-6">
                 <ParametricTemplateTool onBack={() => navigateTo('dashboard')} />
              </div>
            </div>
          );
        case 'library':
          return (
            <div className="pt-24 pb-12 min-h-screen bg-surface">
              <TemplateGallery showPersonal={true} />
            </div>
          );
        case 'dashboard':
        default:
          return <Dashboard userEmail={userEmail || ''} onNavigate={navigateTo} onLogout={handleLogout} />;
      }
    }

    return null;
  };

  return (
    <div className="bg-light min-h-screen flex flex-col font-sans">
      <Header onNavigate={navigateTo} isAuthenticated={isAuthenticated} onLogout={handleLogout} currentPage={page} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;