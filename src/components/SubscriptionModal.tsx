import React, { useState, useEffect } from 'react';
import { X, Check, Zap, Crown, Star, CreditCard } from 'lucide-react';
import { SubscriptionService, SubscriptionPlan } from '../services/subscriptionService';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, currentUserId }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPlans();
    }
  }, [isOpen]);

  const loadPlans = async () => {
    try {
      const plansData = await SubscriptionService.getSubscriptionPlans();
      setPlans(plansData);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    try {
      // In a real app, this would integrate with Stripe
      await SubscriptionService.createSubscription(currentUserId, planId);
      onClose();
      // Refresh the page or update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error creating subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter': return Zap;
      case 'pro': return Crown;
      case 'premium': return Star;
      default: return Zap;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter': return 'from-blue-500 to-blue-600';
      case 'pro': return 'from-purple-500 to-purple-600';
      case 'premium': return 'from-gold-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="text-gray-600 mt-1">Unlock the power of AI audio generation</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = getPlanIcon(plan.name);
              const isPopular = plan.name.toLowerCase() === 'pro';
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white border-2 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg ${
                    selectedPlan === plan.id
                      ? 'border-black shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getPlanColor(plan.name)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{plan.tokens_included.toLocaleString()}</div>
                      <div className="text-sm font-medium text-gray-700">Tokens</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="text-center text-sm text-gray-600">
                      <p className="mb-2">Perfect for:</p>
                      <ul className="space-y-1">
                        <li>• {Math.floor(plan.tokens_included / 150)} minutes of audio</li>
                        <li>• {plan.features.max_uploads_per_month} uploads per month</li>
                        <li>• Files up to {plan.features.max_file_size_mb}MB</li>
                        {plan.features.priority_support && <li>• Priority support</li>}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isPopular
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <CreditCard size={16} />
                    <span>{loading ? 'Processing...' : 'Subscribe Now'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Token System</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900 mb-2">How tokens work:</p>
                <ul className="space-y-1">
                  <li>• 1 token ≈ 1 word of text</li>
                  <li>• Tokens reset monthly</li>
                  <li>• Unused tokens don't roll over</li>
                  <li>• Real-time usage tracking</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">Pricing value:</p>
                <ul className="space-y-1">
                  <li>• 70% of subscription value in tokens</li>
                  <li>• Premium AI voice generation</li>
                  <li>• Multiple content types supported</li>
                  <li>• High-quality audio output</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;