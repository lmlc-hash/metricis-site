import React from 'react';

const TestimonialCard: React.FC<{ quote: string; name: string; title: string; avatar: string }> = ({ quote, name, title, avatar }) => (
    <div className="bg-white p-8 shadow-lg rounded-xl border-t-4 border-primary animate-fade-in-up h-full flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
        <div className="mb-6">
            <svg className="w-8 h-8 text-primary/30 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.321 15.923 14.929 15.081C15.537 14.239 16.313 13.533 17.257 12.963C18.241 12.355 19.141 11.531 19.957 10.491C20.813 9.411 21.241 7.915 21.241 6.003L21.241 3L14.929 3L14.929 9L18.421 9C18.421 9.771 18.271 10.363 17.971 10.775C17.671 11.147 17.061 11.597 16.141 12.125C15.221 12.613 14.513 13.355 14.017 14.349C13.521 15.303 13.273 16.519 13.273 18L13.273 21L14.017 21ZM5.005 21L5.005 18C5.005 16.896 5.309 15.923 5.917 15.081C6.525 14.239 7.301 13.533 8.245 12.963C9.229 12.355 10.129 11.531 10.945 10.491C11.801 9.411 12.229 7.915 12.229 6.003L12.229 3L5.917 3L5.917 9L9.409 9C9.409 9.771 9.259 10.363 8.959 10.775C8.659 11.147 8.049 11.597 7.129 12.125C6.209 12.613 5.501 13.355 5.005 14.349C4.509 15.303 4.261 16.519 4.261 18L4.261 21L5.005 21Z"></path></svg>
            <p className="text-secondary text-lg italic font-medium leading-relaxed font-serif">"{quote}"</p>
        </div>
        <div className="flex items-center pt-6 border-t border-gray-100">
            <img className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm object-cover" src={avatar} alt={name} />
            <div>
                <p className="font-bold text-secondary text-base">{name}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{title}</p>
            </div>
        </div>
    </div>
);


const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-surface relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-yellow/5 rounded-bl-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6 font-serif">Proven Results</h2>
            <p className="text-gray-600 text-xl">
                See how top agencies and freelancers are cutting production time and scaling their creative output with Metricis.
            </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
                quote="We reduced our campaign launch time by 60%. Metricis didn't just speed us up; it completely eliminated the manual bottleneck in our design workflow. The ROI was immediate."
                name="Sarah Jenkins"
                title="COO, FinTech Solutions"
                avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            />
            <TestimonialCard 
                quote="I generated 500+ unique assets for our summer sale in under an hour using the Smart Rules. Before Metricis, this would have taken a team of three a whole week to complete manually."
                name="Elena Rodriguez"
                title="Marketing Lead, EcoStyle"
                avatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            />
            <TestimonialCard 
                quote="The Smart Calendar feature is revolutionary. It automatically adjusted our entire Q4 timeline when a client delayed feedback, saving us days of tedious replanning emails."
                name="Marcus Thorne"
                title="Creative Director, Thorne Agency"
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            />
            <TestimonialCard 
                quote="As a freelancer, time is money. Metricis allowed me to double my client roster because I spend less time on resizing and formatting and more time on high-value strategy."
                name="David Chen"
                title="Freelance Brand Designer"
                avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            />
            <TestimonialCard 
                quote="Our team's productivity increased by 40% in the first month. The ability to switch branding palettes across hundreds of templates instantly is simply magic."
                name="Priya Patel"
                title="Head of Design, Orbit Inc."
                avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            />
             <TestimonialCard 
                quote="Finally, a tool that understands the parametric nature of modern branding. It's not just a template maker; it's a logic engine for design systems."
                name="James Wilson"
                title="System Architect, DesignOps"
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;