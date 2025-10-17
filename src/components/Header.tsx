import React from 'react';
import { Search, Bell, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUpgradeClick?: () => void;
  onNotificationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onUpgradeClick, onNotificationClick }) => {

  return (
    <header className="h-16 bg-black border-b border-gray-800 flex items-center justify-between px-6">
      {/* Navigation Buttons */}
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors duration-200">
            <ChevronLeft size={20} className="text-gray-400 hover:text-silver" />
          </button>
          <button className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors duration-200">
            <ChevronRight size={20} className="text-gray-400 hover:text-silver" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search Arkham Radio..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-silver focus:border-transparent transition-all duration-200 font-light"
          />
        </div>
      </div>

      {/* User Section */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onNotificationClick}
          className="p-2 rounded-full hover:bg-gray-900 transition-colors duration-200 relative"
        >
          <Bell size={20} className="text-gray-400 hover:text-silver" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-silver rounded-full"></div>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-900 transition-colors duration-200">
          <Settings size={20} className="text-gray-400 hover:text-silver" />
        </button>
        <div className="flex items-center space-x-3 ml-4">
          <div className="w-8 h-8 rounded-full bg-silver flex items-center justify-center">
            <span className="text-sm font-semibold text-black">VN</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white tracking-wide">Vincent Noir</p>
            <p className="text-xs text-gray-500 font-light">Premium</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;