import React, { useState } from 'react';
import { Play, Heart, MoreHorizontal, Users, Clock, UserPlus, Search, Filter, Star, TrendingUp } from 'lucide-react';

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

interface Creator {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  tracks: number;
  description: string;
  isFollowing: boolean;
}

interface DiscoverPageProps {
  playlists: Playlist[];
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  currentUserId: string;
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({ playlists, tracks, onPlayTrack, currentUserId }) => {
  const [activeTab, setActiveTab] = useState<'creators' | 'playlists' | 'tracks' | 'categories'>('creators');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [followingCreators, setFollowingCreators] = useState<Set<string>>(new Set());

  // Mock creators data
  const creators: Creator[] = [
    {
      id: '1',
      name: 'Vincent Noir',
      avatar: 'https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 12500,
      tracks: 45,
      description: 'Master of dark tales and gothic horror. Specializing in Lovecraftian narratives.',
      isFollowing: false
    },
    {
      id: '2',
      name: 'Scarlett Audio',
      avatar: 'https://images.pexels.com/photos/2067569/pexels-photo-2067569.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 8900,
      tracks: 32,
      description: 'True crime storyteller with a focus on unsolved mysteries and cold cases.',
      isFollowing: false
    },
    {
      id: '3',
      name: 'Eldritch Productions',
      avatar: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 15200,
      tracks: 67,
      description: 'Award-winning audio drama collective creating immersive horror experiences.',
      isFollowing: true
    },
    {
      id: '4',
      name: 'Midnight Whispers',
      avatar: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 6700,
      tracks: 28,
      description: 'ASMR and ambient horror content for late-night listening.',
      isFollowing: false
    }
  ];

  const categories = [
    {
      id: 'podcast',
      title: 'Podcasts',
      description: 'Discussions, interviews, and talk shows',
      color: 'from-gray-800 to-gray-900',
      count: tracks.filter(t => t.type === 'podcast').length
    },
    {
      id: 'audio-drama',
      title: 'Audio Dramas',
      description: 'Theatrical productions and storytelling',
      color: 'from-gray-700 to-gray-800',
      count: tracks.filter(t => t.type === 'audio-drama').length
    },
    {
      id: 'slow-content',
      title: 'Relaxation',
      description: 'ASMR, meditation, and calming content',
      color: 'from-gray-600 to-gray-700',
      count: tracks.filter(t => t.type === 'slow-content').length
    },
    {
      id: 'solo-narration',
      title: 'Narrations',
      description: 'Single voice storytelling and readings',
      color: 'from-gray-800 to-gray-900',
      count: tracks.filter(t => t.type === 'solo-narration').length
    },
    {
      id: 'audiobook',
      title: 'Audiobooks',
      description: 'Full book narrations and literature',
      color: 'from-gray-700 to-gray-800',
      count: tracks.filter(t => t.type === 'audiobook').length
    },
    {
      id: 'educational',
      title: 'Educational',
      description: 'Learning content and tutorials',
      color: 'from-gray-600 to-gray-700',
      count: tracks.filter(t => t.type === 'educational').length
    }
  ];

  const tabs = [
    { id: 'creators', label: 'Creators', count: creators.length },
    { id: 'playlists', label: 'Playlists', count: playlists.length },
    { id: 'tracks', label: 'Tracks', count: tracks.length },
    { id: 'categories', label: 'Categories', count: categories.length }
  ];

  const handleFollowCreator = (creatorId: string) => {
    setFollowingCreators(prev => {
      const newSet = new Set(prev);
      if (newSet.has(creatorId)) {
        newSet.delete(creatorId);
      } else {
        newSet.add(creatorId);
      }
      return newSet;
    });
  };

  const filteredTracks = selectedCategory 
    ? tracks.filter(track => track.type === selectedCategory)
    : tracks;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white font-serif">Discover</h1>
          <p className="text-zinc-400 text-lg mt-2">Find new creators and dark content</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search creators, playlists, tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-silver"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors duration-200">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'text-silver border-b-2 border-silver'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'creators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <div key={creator.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:bg-gray-800 transition-all duration-300">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white font-serif">{creator.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                    <span>{creator.followers.toLocaleString()} followers</span>
                    <span>•</span>
                    <span>{creator.tracks} tracks</span>
                  </div>
                </div>
                <button
                  onClick={() => handleFollowCreator(creator.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    followingCreators.has(creator.id) || creator.isFollowing
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-silver text-black hover:bg-white'
                  }`}
                >
                  <UserPlus size={16} />
                  <span>{followingCreators.has(creator.id) || creator.isFollowing ? 'Following' : 'Follow'}</span>
                </button>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{creator.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-silver">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} />
                  <span className="text-gray-400 text-sm ml-2">4.2</span>
                </div>
                <button className="text-silver hover:text-white text-sm font-medium">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer">
              <div className="relative mb-4">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Play size={24} className="text-black ml-1" />
                  </div>
                </button>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-serif">{playlist.name}</h3>
              <p className="text-gray-400 text-sm mb-3">by {playlist.creator}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <Users size={16} />
                  <span>{playlist.followers.toLocaleString()}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                    <Heart size={16} className="text-gray-500" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                    <MoreHorizontal size={16} className="text-gray-500" />
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
            <div key={track.id} className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-zinc-900 transition-all duration-200 cursor-pointer">
              <div className="text-zinc-500 w-8 text-center">
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
                <h4 className="text-white font-medium font-serif">{track.title}</h4>
                <p className="text-zinc-400 text-sm">{track.creator}</p>
              </div>
              <div className="flex items-center space-x-1 text-zinc-500 text-sm">
                <Clock size={16} />
                <span>{track.duration}</span>
              </div>
              <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors duration-200">
                <Heart size={16} className="text-zinc-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors duration-200">
                <MoreHorizontal size={16} className="text-zinc-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'categories' && (
        <div>
          {selectedCategory ? (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center space-x-2 text-silver hover:text-white transition-colors"
              >
                <span>← Back to Categories</span>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTracks.map((track) => (
                  <div key={track.id} className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                    <div className="relative mb-4">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button 
                        onClick={() => onPlayTrack(track)}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <Play size={24} className="text-black ml-1" />
                        </div>
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 truncate font-serif">{track.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{track.creator}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <Clock size={16} />
                        <span>{track.duration}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                          <Heart size={16} className="text-gray-500" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                          <MoreHorizontal size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 cursor-pointer hover:scale-105 transition-all duration-300 group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-3 font-serif">{category.title}</h3>
                    <p className="text-white/80 text-sm mb-4 leading-relaxed">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">
                        {category.count} items
                      </span>
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
                        <Play size={18} className="text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;