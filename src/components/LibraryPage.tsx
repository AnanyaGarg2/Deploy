import React, { useState } from 'react';
import { Play, Heart, MoreHorizontal, Grid2x2 as Grid, List, Clock, Users, Plus, Search, Filter } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  creator: string;
  duration: string;
  type: 'podcast' | 'audio-drama' | 'slow-content' | 'solo-narration' | 'audiobook' | 'educational' | 'entertainment';
  coverUrl: string;
  audioUrl: string;
  tags?: string[];
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

interface LibraryPageProps {
  playlists: Playlist[];
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
}

const LibraryPage: React.FC<LibraryPageProps> = ({ playlists, tracks, onPlayTrack }) => {
  const [activeTab, setActiveTab] = useState<'playlists' | 'tracks' | 'liked'>('playlists');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'playlists', label: 'My Playlists', count: playlists.length },
    { id: 'tracks', label: 'My Tracks', count: tracks.length },
    { id: 'liked', label: 'Liked', count: 24 }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Your Library</h1>
        <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 flex items-center space-x-2">
          <Plus size={20} />
          <span>Create Playlist</span>
        </button>
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
                : 'text-gray-600 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search in library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors duration-200">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'playlists' && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-3'}>
          {playlists.map((playlist) => (
            <div key={playlist.id} className={viewMode === 'grid' ? 'group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer' : 'group flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer'}>
              {viewMode === 'grid' ? (
                <>
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
                  <h3 className="text-lg font-semibold text-black mb-2">{playlist.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{playlist.tracks.length} tracks</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-600 text-sm">
                      <Users size={16} />
                      <span>{playlist.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                        <Heart size={16} className="text-gray-600" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                        <MoreHorizontal size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-black font-medium">{playlist.name}</h4>
                    <p className="text-gray-600 text-sm">{playlist.tracks.length} tracks • {playlist.followers.toLocaleString()} followers</p>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <Play size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <MoreHorizontal size={16} className="text-gray-600" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tracks' && (
        <div className="space-y-3">
          {tracks.map((track, index) => (
            <div key={track.id} className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer">
              <div className="text-gray-600 w-8 text-center">
                <span className="group-hover:hidden">{index + 1}</span>
                <button 
                  onClick={() => onPlayTrack(track)}
                  className="hidden group-hover:block p-1"
                >
                  <Play size={16} className="text-black" />
                </button>
              </div>
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="text-black font-medium">{track.title}</h4>
                <p className="text-gray-600 text-sm">{track.creator}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${typeColors[track.type]}`}>
                {typeLabels[track.type]}
              </span>
              <div className="flex items-center space-x-1 text-gray-600 text-sm">
                <Clock size={16} />
                <span>{track.duration}</span>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <Heart size={16} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <MoreHorizontal size={16} className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'liked' && (
        <div className="text-center py-12">
          <Heart size={64} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-black mb-2">No liked content yet</h3>
          <p className="text-gray-600">Start liking playlists and tracks to see them here</p>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;