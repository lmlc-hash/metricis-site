import React, { useState } from 'react';

interface UserProfileProps {
  userEmail: string;
  onLogout: () => void;
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userEmail, onLogout, onBack }) => {
  const [name, setName] = useState(userEmail.split('@')[0]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Profile information updated successfully.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setMessage({ type: 'success', text: 'Password changed successfully.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 min-h-[600px] flex flex-col animate-fade-in-up overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <button onClick={onBack} className="text-xs font-bold text-gray-400 hover:text-secondary mb-1">← DASHBOARD</button>
          <h2 className="text-2xl font-bold text-secondary font-serif">Account Settings</h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-surface border-r border-gray-100 p-8 text-center md:text-left">
           <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden relative mb-4 group cursor-pointer">
                    <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                        alt="Profile" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold uppercase tracking-wider">Change</span>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-secondary font-serif capitalize">{name}</h3>
                <p className="text-sm text-gray-500">{userEmail}</p>
           </div>
           
           <div className="mt-8 border-t border-gray-200 pt-8">
               <button 
                onClick={onLogout}
                className="w-full border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 py-3 rounded-xl font-bold transition-colors flex items-center justify-center"
               >
                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                   Sign Out
               </button>
           </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 p-8 md:p-12">
            {message && (
                <div className={`mb-6 p-4 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="max-w-lg">
                <h3 className="text-lg font-bold text-secondary mb-6 border-b border-gray-100 pb-2">Profile Information</h3>
                <form onSubmit={handleSaveInfo} className="space-y-4 mb-10">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={userEmail} 
                            disabled
                            className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary transition-colors text-sm">Save Changes</button>
                    </div>
                </form>

                <h3 className="text-lg font-bold text-secondary mb-6 border-b border-gray-100 pb-2">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
                        <input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                            <input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="bg-white border border-secondary text-secondary px-6 py-2 rounded-lg font-bold hover:bg-secondary hover:text-white transition-colors text-sm">Update Password</button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;