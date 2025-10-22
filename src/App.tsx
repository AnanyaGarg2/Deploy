import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import UploadPage from './components/UploadPage';
import LibraryPage from './components/LibraryPage';
import ProfilePage from './components/ProfilePage';
import DiscoverPage from './components/DiscoverPage';
import RadioPage from './components/RadioPage';
import AudioPlayer from './components/AudioPlayer';
import SubscriptionModal from './components/SubscriptionModal';
import NotificationPanel from './components/NotificationPanel';
import BooksPage from './components/BooksPage';

type Page = 'home' | 'upload' | 'library' | 'profile' | 'discover' | 'radio' | 'books';

interface Track {
  id: string;
  title: string;
  creator: string;
  duration: string;
  type: 'podcast' | 'audio-drama' | 'slow-content' | 'solo-narration' | 'audiobook' | 'educational' | 'entertainment';
  coverUrl: string;
  audioUrl: string;
  tags: string[];
  description?: string;
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

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentUserId = '550e8400-e29b-41d4-a716-446655440000';

  const sampleTracks: Track[] = [
    {
      id: '1',
      title: 'The Great Gatsby - Chapter 1',
      creator: 'Literary Voices',
      duration: '24:15',
      type: 'solo-narration',
      coverUrl: 'https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=300',
      audioUrl: '#',
      tags: []
    },
    {
      id: '2',
      title: 'Murder at Midnight',
      creator: 'Dark Tales Audio',
      duration: '45:32',
      type: 'audio-drama',
      coverUrl: 'https://images.pexels.com/photos/2067569/pexels-photo-2067569.jpeg?auto=compress&cs=tinysrgb&w=300',
      audioUrl: '#',
      tags: []
    },
    {
      id: '3',
      title: 'Tech Trends 2025',
      creator: 'Future Cast',
      duration: '32:18',
      type: 'podcast',
      coverUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300',
      audioUrl: '#',
      tags: []
    }
  ];

  const samplePlaylists: Playlist[] = [
    {
      id: '1',
      name: 'Noir Classics',
      creator: 'Vincent Noir',
      tracks: sampleTracks,
      coverUrl: 'https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=300',
      followers: 1247,
      isPublic: true
    },
    {
      id: '2',
      name: 'Mystery Theatre',
      creator: 'Scarlett Audio',
      tracks: sampleTracks.slice(0, 2),
      coverUrl: 'https://images.pexels.com/photos/2067569/pexels-photo-2067569.jpeg?auto=compress&cs=tinysrgb&w=300',
      followers: 892,
      isPublic: true
    }
  ];

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            playlists={samplePlaylists}
            tracks={sampleTracks}
            onPlayTrack={handlePlayTrack}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        );
      case 'upload':
        return <UploadPage />;
      case 'library':
        return <LibraryPage playlists={samplePlaylists} tracks={sampleTracks} onPlayTrack={handlePlayTrack} />;
      case 'profile':
        return (
          <ProfilePage
            playlists={samplePlaylists}
            tracks={sampleTracks}
            onPlayTrack={handlePlayTrack}
            currentUserId={currentUserId}
            isOwnProfile={true}
          />
        );
      case 'discover':
        return (
          <DiscoverPage
            playlists={samplePlaylists}
            tracks={sampleTracks}
            onPlayTrack={handlePlayTrack}
            currentUserId={currentUserId}
          />
        );
      case 'radio':
        return <RadioPage onPlayTrack={handlePlayTrack} />;
      case 'books':
        return <BooksPage />;
      default:
        return <HomePage playlists={samplePlaylists} tracks={sampleTracks} onPlayTrack={handlePlayTrack} />;
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-900">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-black">{renderCurrentPage()}</main>
        </div>
      </div>

      {/* Audio Player */}
      {currentTrack && (
        <AudioPlayer track={currentTrack} isPlaying={isPlaying} onTogglePlay={togglePlayPause} />
      )}

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        currentUserId={currentUserId}
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        currentUserId={currentUserId}
      />
    </div>
  );
}

export default App;
