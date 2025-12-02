import React from 'react';
import { TimelineIcon, SvgTemplateIcon } from './icons/Icons';
import { Page } from '../App';
import TemplateGallery from './TemplateGallery';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userEmail, onLogout, onNavigate }) => {
  return (
    <>
    <section id="dashboard" className="pt-24 pb-12 min-h-screen bg-surface">
      <div className="container mx-auto px-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-center mb-12 border-b border-gray-200 pb-8">
            <div className="relative mr-8 mb-6 md:mb-0 flex-shrink-0">
                 <div 
                    onClick={() => onNavigate('profile')}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden relative z-10 group cursor-pointer"
                 >
                    <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                        alt="User Profile" 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                 </div>
                 {/* Decorative glow */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-primary/20 rounded-full blur-xl z-0"></div>
                 {/* Status Indicator */}
                 <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full z-20 shadow-sm" title="Online"></div>
            </div>

            <div className="text-center md:text-left w-full">
                <h1 className="text-4xl md:text-5xl font-bold text-secondary font-serif leading-tight">
                    Welcome, <span className="text-primary italic">{userEmail.split('@')[0]}</span>
                </h1>
                <p className="text-gray-500 mt-3 text-lg">Select a tool to automate your design workflow.</p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-20">
            {/* Card 1: Calendar Generator */}
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                
                <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
                    <TimelineIcon />
                </div>
                <h3 className="text-3xl font-bold text-secondary mb-4 font-serif group-hover:text-primary transition-colors">Smart Calendar</h3>
                <p className="text-gray-600 mb-10 leading-relaxed flex-grow text-lg">
                    Create personalized project calendars. Set your dates and rules, and let the system build the timeline for you.
                </p>
                <button 
                  onClick={() => onNavigate('calendars')}
                  className="w-full bg-white border-2 border-secondary text-secondary py-4 rounded-xl font-bold text-lg hover:bg-secondary hover:text-white transition-all duration-300 shadow-md flex items-center justify-center group-hover:translate-y-[-2px]"
                >
                    Open Tool
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Card 2: Template Generator */}
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-pink/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>

                <div className="bg-accent-pink/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-pink group-hover:text-white transition-colors duration-300 text-accent-pink">
                    <SvgTemplateIcon />
                </div>
                <h3 className="text-3xl font-bold text-secondary mb-4 font-serif group-hover:text-accent-pink transition-colors">Parametric Templates</h3>
                <p className="text-gray-600 mb-10 leading-relaxed flex-grow text-lg">
                    Generate branding kits and social media sets automatically based on your style parameters.
                </p>
                <button 
                  onClick={() => onNavigate('templates')}
                  className="w-full bg-white border-2 border-secondary text-secondary py-4 rounded-xl font-bold text-lg hover:bg-secondary hover:text-white transition-all duration-300 shadow-md flex items-center justify-center group-hover:translate-y-[-2px]"
                >
                    Open Tool
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
      </div>
    </section>
    
    {/* Embed the Gallery below the dashboard tools */}
    <div className="bg-white pt-10">
        <TemplateGallery showPersonal={true} />
    </div>
    </>
  );
};

export default Dashboard;