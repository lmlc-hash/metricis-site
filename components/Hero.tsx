import React, { useState } from 'react';

interface HeroProps {
  onNavigate: (page: 'login') => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center text-center overflow-hidden bg-light pt-20">
      <div className="relative z-10 px-6 max-w-5xl mx-auto animate-fade-in-up">
        <p className="text-primary font-medium tracking-widest uppercase mb-4 text-sm">Made To Stand Out</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-secondary leading-[0.9] font-serif">
          A Branding Studio <br/>
          <span className="italic font-normal">Powered By</span> Strategy <br/>
          And Vision.
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 font-normal leading-relaxed">
          Metricis helps designers work smarter, not harder. Automate your schedules and generate ready-to-use design files instantly.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className="bg-secondary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary/90 transition-all duration-300 shadow-lg min-w-[200px]">
            Start Free Trial
          </a>
          <a href="#gallery" className="text-secondary border-b border-secondary pb-1 hover:text-primary hover:border-primary transition-colors text-lg font-medium">
            Browse Library
          </a>
        </div>

        {/* Decorative elements matching the palette */}
        <div className="mt-16 flex justify-center space-x-4">
           <div className="w-24 h-32 bg-secondary rounded-tr-3xl rounded-bl-3xl opacity-90"></div>
           <div className="w-24 h-32 bg-primary rounded-tl-3xl rounded-br-3xl opacity-90"></div>
           <div className="w-24 h-32 bg-accent-yellow rounded-tr-3xl rounded-bl-3xl opacity-90"></div>
           <div className="w-24 h-32 bg-accent-pink rounded-tl-3xl rounded-br-3xl opacity-90"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;