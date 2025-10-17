import React, { useState } from 'react';
import { Play, Heart, MoreHorizontal, Users, Clock, Settings, Share, CreditCard as Edit, UserPlus, MessageCircle } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  creator: string;
  duration: string;
  type: 'podcast' | 'audio-drama' | 'slow-content' | 'solo-narration';
  coverUrl: string;
  audioUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  creator: string;
  tracks: Track[];
  coverUrl: string;
  followers: number;
  isPublic: boolean;
}

interface ProfilePageProps {
  playlists: Playlist[];
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  currentUserId: string;
  isOwnProfile: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ playlists, tracks, onPlayTrack, currentUserId, isOwnProfile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'playlists' | 'tracks' | 'followers'>('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'playlists', label: 'Playlists', count: playlists.length },
    { id: 'tracks', label: 'Tracks', count: tracks.length },
    { id: 'followers', label: 'Followers', count: 2847 }
  ];

  const stats = [
    { label: 'Total Plays', value: '124.5K', icon: Play },
    { label: 'Followers', value: '2.8K', icon: Users },
    { label: 'Following', value: '156', icon: UserPlus },
    { label: 'Hours Created', value: '48.2', icon: Clock }
  ];

  const typeLabels = {
    'podcast': 'Podcast',
    'audio-drama': 'Audio Drama',
    'slow-content': 'Slow Content',
    'solo-narration': 'Solo Narration'
  };

  const typeColors = {
    'podcast': 'bg-black',
    'audio-drama': 'bg-gray-800',
    'slow-content': 'bg-green-600',
    'solo-narration': 'bg-orange-600'
  };

  return (
    <div className="space-y-8 text-white">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-6 left-8">
            <h2 className="text-2xl font-bold text-white font-serif">Vincent Noir's Dark Collection</h2>
            <p className="text-zinc-300">Master of gothic horror and atmospheric tales</p>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="relative -mt-16 px-8">
          <div className="flex items-end space-x-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-900 to-red-700 border-4 border-white flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white font-serif">VN</span>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-3xl font-bold text-white font-serif">Vincent Noir</h1>
                {isOwnProfile && (
                  <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors duration-200">
                    <Edit size={20} className="text-zinc-400" />
                  </button>
                )}
              </div>
              <p className="text-zinc-300 mb-2">Creator of dark stories and noir audio experiences</p>
              <div className="flex items-center space-x-4 text-sm text-zinc-400">
                <span>Joined March 2023</span>
                <span>•</span>
                <span>Los Angeles, CA</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 pb-4">
              {isOwnProfile ? (
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all duration-200">
                  Edit Profile
                </button>
              ) : (
                <>
                  <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all duration-200">
                    Follow
                  </button>
                  <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors duration-200">
                    <MessageCircle size={20} className="text-zinc-400" />
                  </button>
                </>
              )}
              <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors duration-200">
                <Share size={20} className="text-zinc-400" />
              </button>
              <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors duration-200">
                <Settings size={20} className="text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
              <Icon size={24} className="text-white mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-zinc-500 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {tab.label} {tab.count && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Featured Playlists */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Featured Playlists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.slice(0, 3).map((playlist) => (
                <div key={playlist.id} className="group bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="relative mb-4">
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Play size={32} className="text-white" />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{playlist.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{playlist.tracks.length} tracks</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-600 text-sm">
                      <Users size={16} />
                      <span>{playlist.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                        <Heart size={16} className="text-gray-600" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                        <MoreHorizontal size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Tracks */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Tracks</h2>
            <div className="space-y-3">
              {tracks.slice(0, 5).map((track, index) => (
                <div key={track.id} className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-800 transition-all duration-200 cursor-pointer">
                  <div className="text-gray-600 w-8 text-center">
                    <span className="group-hover:hidden">{index + 1}</span>
                    <button 
                      onClick={() => onPlayTrack(track)}
                      className="hidden group-hover:block p-1"
                    >
                      <Play size={16} className="text-white" />
                    </button>
                  </div>
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{track.title}</h4>
                    <p className="text-gray-600 text-sm">{track.creator}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${typeColors[track.type]}`}>
                    {typeLabels[track.type]}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-600 text-sm">
                    <Clock size={16} />
                    <span>{track.duration}</span>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                    <Heart size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                    <MoreHorizontal size={16} className="text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="group bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="relative mb-4">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Play size={32} className="text-white" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{playlist.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{playlist.tracks.length} tracks</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray-600 text-sm">
                  <Users size={16} />
                  <span>{playlist.followers.toLocaleString()}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                    <Heart size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                    <MoreHorizontal size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tracks' && (
        <div className="space-y-3">
          {tracks.map((track, index) => (
            <div key={track.id} className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-800 transition-all duration-200 cursor-pointer">
              <div className="text-gray-600 w-8 text-center">
                <span className="group-hover:hidden">{index + 1}</span>
                <button 
                  onClick={() => onPlayTrack(track)}
                  className="hidden group-hover:block p-1"
                >
                  <Play size={16} className="text-white" />
                </button>
              </div>
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="text-white font-medium">{track.title}</h4>
                <p className="text-gray-600 text-sm">{track.creator}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${typeColors[track.type]}`}>
                {typeLabels[track.type]}
              </span>
              <div className="flex items-center space-x-1 text-gray-600 text-sm">
                <Clock size={16} />
                <span>{track.duration}</span>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                <Heart size={16} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                <MoreHorizontal size={16} className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'followers' && (
        <div className="text-center py-12">
          <Users size={64} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Followers</h3>
          <p className="text-gray-600">2,847 people follow Vincent Noir</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;