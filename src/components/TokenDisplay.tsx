import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { SubscriptionService, UserTokens, UserSubscription } from '../services/subscriptionService';

interface TokenDisplayProps {
  userId: string;
  onUpgradeClick: () => void;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ userId, onUpgradeClick }) => {
  const [tokens, setTokens] = useState<UserTokens | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTokenData();
  }, [userId]);

  const loadTokenData = async () => {
    try {
      const [tokensData, subscriptionData] = await Promise.all([
        SubscriptionService.getUserTokens(userId),
        SubscriptionService.getUserSubscription(userId)
      ]);
      setTokens(tokensData);
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Error loading token data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsagePercentage = () => {
    if (!tokens || tokens.total_tokens === 0) return 0;
    return (tokens.used_tokens / tokens.total_tokens) * 100;
  };

  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getDaysUntilReset = () => {
    if (!tokens) return 0;
    const resetDate = new Date(tokens.last_reset_date);
    const nextReset = new Date(resetDate.getFullYear(), resetDate.getMonth() + 1, resetDate.getDate());
    const now = new Date();
    const diffTime = nextReset.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium tracking-wide">No Active Subscription</h3>
            <p className="text-sm opacity-90 font-light">Subscribe to start generating audio</p>
          </div>
          <button
            onClick={onUpgradeClick}
            className="bg-silver text-black px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors tracking-wide"
          >
            Subscribe
          </button>
        </div>
      </div>
    );
  }

  const usagePercentage = getUsagePercentage();
  const isLowTokens = tokens && tokens.remaining_tokens < 500;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap size={16} className="text-silver" />
          <h3 className="font-medium text-white tracking-wide">Token Balance</h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded font-light">
          {subscription.plan?.name} Plan
        </span>
      </div>

      {/* Token Count */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {tokens?.remaining_tokens?.toLocaleString() || 0}
          </span>
          <span className="text-xs text-gray-500 font-light">
            / {tokens?.total_tokens?.toLocaleString() || 0}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${getUsageColor()}`}
            style={{ width: `${100 - usagePercentage}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 font-light">
          <span>{usagePercentage.toFixed(1)}% used</span>
          <span>~{Math.floor((tokens?.remaining_tokens || 0) / 150)} min audio</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp size={14} className="text-silver" />
            <span className="text-xs text-gray-400 font-light">Used This Month</span>
          </div>
          <span className="text-lg font-medium text-white">
            {tokens?.used_tokens?.toLocaleString() || 0}
          </span>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Clock size={14} className="text-silver" />
            <span className="text-xs text-gray-400 font-light">Reset In</span>
          </div>
          <span className="text-lg font-medium text-white">
            {getDaysUntilReset()} days
          </span>
        </div>
      </div>

      {/* Low Tokens Warning */}
      {isLowTokens && (
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} className="text-silver" />
            <span className="text-sm text-gray-300 font-light">
              Running low on tokens! Consider upgrading your plan.
            </span>
          </div>
        </div>
      )}

      {/* Upgrade Button */}
      <button
        onClick={onUpgradeClick}
        className="w-full bg-silver hover:bg-white text-black py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 tracking-wide"
      >
        Upgrade Plan
      </button>
    </div>
  );
};

export default TokenDisplay;