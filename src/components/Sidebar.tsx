import React from 'react';
import { Home, Upload, Library, User, Radio, Compass, BookOpen } from 'lucide-react';
import TokenDisplay from './TokenDisplay';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: 'home' | 'upload' | 'library' | 'profile' | 'discover' | 'radio' | 'books') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  // Mock user ID - in real app, get from auth context
  const currentUserId = '550e8400-e29b-41d4-a716-446655440000';

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'radio', label: 'Radio', icon: Radio },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'library', label: 'Your Library', icon: Library },
    { id: 'profile', label: 'Profile', icon: User },
  ];


  return (
    <aside className="w-64 bg-black border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-silver font-serif">
          Arkham Radio
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-light">Dark audio experiences</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id as any)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-white/10 text-white border-l-4 border-silver'
                      : 'text-gray-400 hover:text-silver hover:bg-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Subscription Section */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 font-light">
            Subscription
          </h3>
          <div className="w-full">
            <TokenDisplay 
              userId={currentUserId} 
              onUpgradeClick={() => {}} 
            />
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;