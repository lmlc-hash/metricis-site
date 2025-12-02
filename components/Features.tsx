import React from 'react';
import { TimelineIcon, SvgTemplateIcon, GalleryIcon } from './icons/Icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; colorClass: string }> = ({ icon, title, description, colorClass }) => (
  <div className="bg-white p-10 border border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
    <div className={`flex items-center justify-center h-14 w-14 rounded-full ${colorClass} bg-opacity-10 mb-6 group-hover:bg-opacity-20 transition-all`}>
      <div className={colorClass.replace('bg-', 'text-')}>
        {icon}
      </div>
    </div>
    <h3 className="text-2xl font-bold text-secondary mb-4 font-serif">{title}</h3>
    <p className="text-gray-600 text-base leading-relaxed">{description}</p>
  </div>
);

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-surface">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6 font-serif">A Smarter Way to Design</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Use simple rules to automate boring tasks so you can focus on being creative.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<TimelineIcon />}
            title="Smart Schedules"
            description="Create project timelines that adjust automatically. Change one date, and everything else updates instantly."
            colorClass="bg-primary"
          />
          <FeatureCard
            icon={<SvgTemplateIcon />}
            title="Auto-Generated Files"
            description="Create full sets of design files at once. Perfect for making many social media posts or branding items quickly."
            colorClass="bg-accent-pink"
          />
          <FeatureCard
            icon={<GalleryIcon />}
            title="Template Gallery"
            description="Pick from our library of designs. Filter by what your project needs—like style, format, or category."
            colorClass="bg-accent-yellow"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;