import React from 'react';

interface PricingCardProps {
  plan: string;
  price: string;
  features: string[];
  isFeatured?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, features, isFeatured = false }) => (
  <div className={`relative rounded-xl p-8 transition-all duration-300 ${isFeatured ? 'bg-secondary text-white shadow-2xl transform scale-105' : 'bg-white text-secondary border border-gray-200 shadow-sm hover:shadow-lg'}`}>
    {isFeatured && <span className="bg-accent-pink text-white px-4 py-1 text-sm font-bold rounded-full absolute -top-3 right-6 shadow-sm">Most Popular</span>}
    <h3 className={`text-3xl font-bold mb-2 font-serif`}>{plan}</h3>
    <p className="text-5xl font-bold my-6 font-serif">{price}<span className={`text-lg font-normal font-sans ${isFeatured ? 'text-gray-300' : 'text-gray-500'}`}>/mo</span></p>
    <ul className="space-y-4 mb-10">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-lg">
          <svg className={`w-6 h-6 mr-3 ${isFeatured ? 'text-primary' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          {feature}
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 font-bold rounded-lg transition-colors text-lg ${isFeatured ? 'bg-primary text-white hover:bg-white hover:text-primary' : 'bg-secondary text-white hover:bg-primary'}`}>
      Choose Plan
    </button>
  </div>
);

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6 font-serif">Find the Perfect Plan</h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Start for free, then grow with us. Simple prices for teams of all sizes.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          <PricingCard
            plan="Starter"
            price="$29"
            features={['5 Timelines/month', '20 SVG Exports', 'Basic Template Gallery', 'Community Support']}
          />
          <PricingCard
            plan="Pro"
            price="$99"
            features={['Unlimited Timelines', 'Unlimited Exports', 'Full Template Gallery', 'Custom Rules', 'Priority Support']}
            isFeatured={true}
          />
          <PricingCard
            plan="Enterprise"
            price="Contact"
            features={['Unlimited Users', 'Collaborative Workspaces', 'API Access', 'Dedicated Support']}
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;