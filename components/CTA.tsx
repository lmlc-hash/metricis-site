import React from 'react';

interface CTAProps {
  onNavigate: (page: 'login') => void;
}

const CTA: React.FC<CTAProps> = ({ onNavigate }) => {
  return (
    <section id="cta" className="py-24 bg-secondary relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Automate Your Design Process?
        </h2>
        <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto font-light">
          Stop wasting time on repetitive tasks. Start creating with the power of parametric design today.
        </p>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onNavigate('login'); }}
          className="bg-accent-pink text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-white hover:text-accent-pink transform hover:scale-105 transition-all duration-300 shadow-xl inline-block"
        >
          Start a 14-Day Free Trial
        </a>
      </div>
    </section>
  );
};

export default CTA;