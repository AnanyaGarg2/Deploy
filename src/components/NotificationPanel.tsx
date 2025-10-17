import React, { useState, useEffect } from 'react';
import { X, Bell, Play, Heart, UserPlus, Upload, Clock, Check } from 'lucide-react';

interface Notification {
  id: string;
  type: 'new_upload' | 'new_follower' | 'like' | 'playlist_update';
  title: string;
  message: string;
  creator?: string;
  creatorAvatar?: string;
  trackTitle?: string;
  trackCover?: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, currentUserId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = () => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'new_upload',
        title: 'New Upload',
        message: 'Vincent Noir uploaded "The Shadow Over Innsmouth - Chapter 4"',
        creator: 'Vincent Noir',
        creatorAvatar: 'https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=150',
        trackTitle: 'The Shadow Over Innsmouth - Chapter 4',
        trackCover: 'https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=150',
        timestamp: '2 hours ago',
        isRead: false
      },
      {
        id: '2',
        type: 'new_follower',
        title: 'New Follower',
        message: 'Scarlett Audio started following you',
        creator: 'Scarlett Audio',
        creatorAvatar: 'https://images.pexels.com/photos/2067569/pexels-photo-2067569.jpeg?auto=compress&cs=tinysrgb&w=150',
        timestamp: '5 hours ago',
        isRead: false
      },
      {
        id: '3',
        type: 'like',
        title: 'Track Liked',
        message: 'Eldritch Productions liked your track "Midnight Confessions"',
        creator: 'Eldritch Productions',
        creatorAvatar: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=150',
        trackTitle: 'Midnight Confessions',
        trackCover: 'https://images.pexels.com/photos/2067569/pexels-photo-2067569.jpeg?auto=compress&cs=tinysrgb&w=150',
        timestamp: '1 day ago',
        isRead: true
      },
      {
        id: '4',
        type: 'playlist_update',
        title: 'Playlist Updated',
        message: 'Midnight Whispers added your track to "Dark Ambient Collection"',
        creator: 'Midnight Whispers',
        creatorAvatar: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=150',
        trackTitle: 'Dark Ambient Collection',
        timestamp: '2 days ago',
        isRead: true
      },
      {
        id: '5',
        type: 'new_upload',
        title: 'New Upload',
        message: 'Eldritch Productions uploaded "The Dunwich Horror - Full Audio Drama"',
        creator: 'Eldritch Productions',
        creatorAvatar: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=150',
        trackTitle: 'The Dunwich Horror - Full Audio Drama',
        trackCover: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=150',
        timestamp: '3 days ago',
        isRead: true
      }
    ];
    setNotifications(mockNotifications);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_upload': return Upload;
      case 'new_follower': return UserPlus;
      case 'like': return Heart;
      case 'playlist_update': return Play;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_upload': return 'text-silver';
      case 'new_follower': return 'text-white';
      case 'like': return 'text-gray-300';
      case 'playlist_update': return 'text-gray-400';
      default: return 'text-gray-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50 pt-16 pr-6">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-96 max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <Bell size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-silver text-black px-2 py-1 rounded-full text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <div className="p-4 border-b border-gray-800">
            <button
              onClick={markAllAsRead}
              className="text-silver hover:text-white text-sm font-medium flex items-center space-x-2"
            >
              <Check size={16} />
              <span>Mark all as read</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No notifications</h3>
              <p className="text-gray-400">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 hover:bg-gray-800 transition-colors cursor-pointer border-l-4 ${
                      notification.isRead 
                        ? 'border-transparent' 
                        : 'border-silver bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-gray-800 ${iconColor}`}>
                        <Icon size={16} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-silver rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-2">{notification.message}</p>
                        
                        {/* Creator/Track Info */}
                        {notification.creator && (
                          <div className="flex items-center space-x-2 mb-2">
                            {notification.creatorAvatar && (
                              <img
                                src={notification.creatorAvatar}
                                alt={notification.creator}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            <span className="text-xs text-gray-400">{notification.creator}</span>
                          </div>
                        )}
                        
                        {/* Track Preview */}
                        {notification.trackCover && notification.trackTitle && (
                          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2 mb-2">
                            <img
                              src={notification.trackCover}
                              alt={notification.trackTitle}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-xs text-gray-300 truncate">{notification.trackTitle}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>{notification.timestamp}</span>
                          </div>
                          
                          {notification.type === 'new_upload' && (
                            <button className="text-silver hover:text-white text-xs font-medium">
                              Listen Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 text-center">
          <button className="text-red-400 hover:text-red-300 text-sm font-medium">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;