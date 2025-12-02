import React, { useState } from 'react';
import { TimelineIcon, SvgTemplateIcon } from './icons/Icons';

interface LoginProps {
    onLogin: (email: string, pass: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = onLogin(email, password);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <section id="login" className="py-20 flex items-center min-h-screen bg-light">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up border border-gray-100">
          
          {/* Features / Value Proposition Side */}
          <div className="md:w-1/2 bg-secondary p-12 flex flex-col justify-center relative">
             <div className="absolute top-0 left-0 w-32 h-32 bg-primary opacity-20 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-pink opacity-20 rounded-full blur-3xl"></div>
             
             <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-8 font-serif">What You Can Do</h2>
                <div className="space-y-8">
                    <div className="flex items-start group">
                         <div className="flex-shrink-0 p-3 bg-white/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <div className="text-white">
                                <TimelineIcon />
                            </div>
                         </div>
                         <div className="ml-5">
                            <h3 className="text-xl font-bold text-white font-serif">Smart Calendars</h3>
                            <p className="text-gray-300 mt-2 text-sm leading-relaxed font-normal">
                                Create calendars that fit your exact needs using simple rules.
                            </p>
                         </div>
                    </div>
                    <div className="flex items-start group">
                         <div className="flex-shrink-0 p-3 bg-white/10 rounded-xl group-hover:bg-accent-yellow/20 transition-colors">
                            <div className="text-white">
                                <SvgTemplateIcon />
                            </div>
                         </div>
                         <div className="ml-5">
                            <h3 className="text-xl font-bold text-white font-serif">Template Sets</h3>
                            <p className="text-gray-300 mt-2 text-sm leading-relaxed font-normal">
                                Generate whole sets of templates automatically.
                            </p>
                         </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Login Form Side */}
          <div className="md:w-1/2 p-12 bg-white">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-secondary font-serif">Sign In</h2>
                <p className="text-gray-500 mt-2">Access your Metricis dashboard.</p>
            </div>

            {/* Demo Credentials Alert */}
            <div className="bg-surface border border-gray-200 rounded-xl p-5 mb-8">
                <p className="text-sm text-secondary font-bold mb-2">Demo Access:</p>
                <div className="flex flex-col space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="text-primary font-mono select-all">designer@metricis.com</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Password:</span>
                        <span className="text-primary font-mono select-all">password</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                <label htmlFor="email" className="block text-secondary text-xs font-bold mb-2 uppercase tracking-wider">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="designer@metricis.com"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                    required
                />
                </div>
                <div className="mb-6">
                <label htmlFor="password" className="block text-secondary text-xs font-bold mb-2 uppercase tracking-wider">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                    required
                />
                </div>
                {error && (
                    <p className="text-accent-pink text-sm text-center mb-4 font-medium">{error}</p>
                )}
                <div className="flex items-center justify-between mb-8">
                <label className="flex items-center text-sm text-gray-500">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
                    <span className="ml-2">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline font-medium">
                    Forgot Password?
                </a>
                </div>
                <div>
                <button
                    type="submit"
                    className="w-full bg-secondary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary transition-all duration-300 shadow-lg transform hover:-translate-y-1"
                >
                    Sign In
                </button>
                </div>
            </form>
            <p className="text-center text-gray-500 text-sm mt-8">
                Don't have an account?{' '}
                <a href="#" className="text-primary hover:underline font-bold">
                Sign Up
                </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;