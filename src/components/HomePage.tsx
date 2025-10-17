import React, { useState, useRef } from 'react';
import { Play, Heart, MoreHorizontal, Users, Clock, ChevronLeft, ChevronRight, ArrowLeft, Star, TrendingUp, Siren as Fire } from 'lucide-react';

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

interface HomePageProps {
  playlists: Playlist[];
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  selectedCategory?: string | null;
  onCategorySelect?: (category: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  playlists, 
  tracks, 
  onPlayTrack
}) => {
  const [heroSlide, setHeroSlide] = useState(0);
  const [trendingSlide, setTrendingSlide] = useState(0);
  const [recentSlide, setRecentSlide] = useState(0);

  const heroContent = [
    {
      id: 1,
      title: "The Arkham Chronicles",
      subtitle: "A haunting journey through madness",
      description: "Experience the complete collection of H.P. Lovecraft's most terrifying tales, narrated with bone-chilling authenticity.",
      backgroundUrl: "https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=1200",
      creator: "Vincent Noir",
      duration: "8h 45m"
    },
    {
      id: 2,
      title: "Midnight Confessions",
      subtitle: "Dark secrets whispered in shadow",
      description: "True crime stories told through the eyes of those who lived them. Each episode unveils another layer of human darkness.",
      backgroundUrl: "https://images.pexels.com/photos/2067569/pexels-photo-2067569.jpeg?auto=compress&cs=tinysrgb&w=1200",
      creator: "Scarlett Audio",
      duration: "12 episodes"
    },
    {
      id: 3,
      title: "The Void Speaks",
      subtitle: "Cosmic horror beyond comprehension",
      description: "Original audio dramas exploring the vast emptiness between stars and the things that dwell there.",
      backgroundUrl: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200",
      creator: "Eldritch Productions",
      duration: "6h 20m"
    }
  ];

  const categories = [
    {
      id: 'podcast',
      title: 'Dark Podcasts',
      description: 'True crime, mystery, and horror discussions',
      color: 'from-red-900 to-red-700',
      count: tracks.filter(t => t.type === 'podcast').length
    },
    {
      id: 'audio-drama',
      title: 'Audio Dramas',
      description: 'Theatrical horror and mystery productions',
      color: 'from-purple-900 to-purple-700',
      count: tracks.filter(t => t.type === 'audio-drama').length
    },
    {
      id: 'slow-content',
      title: 'Ambient Horror',
      description: 'Atmospheric soundscapes and ASMR',
      color: 'from-gray-900 to-gray-700',
      count: tracks.filter(t => t.type === 'slow-content').length
    },
    {
      id: 'solo-narration',
      title: 'Dark Literature',
      description: 'Classic and modern horror narrations',
      color: 'from-orange-900 to-orange-700',
      count: tracks.filter(t => t.type === 'solo-narration').length
    }
  ];

  const nextHeroSlide = () => {
    setHeroSlide((prev) => (prev + 1) % heroContent.length);
  };

  const prevHeroSlide = () => {
    setHeroSlide((prev) => (prev - 1 + heroContent.length) % heroContent.length);
  };

  const nextSlide = (current: number, setter: React.Dispatch<React.SetStateAction<number>>, max: number) => {
    if (current < max - 4) {
      setter(current + 1);
    }
  };

  const prevSlide = (current: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    if (current > 0) {
      setter(current - 1);
    }
  };

  return (
    <div className="space-y-12 bg-black">
      {/* Hero Section - Netflix Style */}
      <section className="relative h-[70vh] rounded-2xl overflow-hidden">
        <div className="relative h-full">
          {heroContent.map((hero, index) => (
            <div
              key={hero.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === heroSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={hero.backgroundUrl}
                alt={hero.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-12 max-w-2xl">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="bg-silver text-black px-3 py-1 rounded text-sm font-medium tracking-wide">
                      FEATURED
                    </span>
                    <div className="flex items-center space-x-1 text-silver">
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                    </div>
                  </div>
                  
                  <h1 className="text-6xl font-bold text-white leading-tight font-serif">
                    {hero.title}
                  </h1>
                  
                  <h2 className="text-2xl text-silver font-medium font-serif">
                    {hero.subtitle}
                  </h2>
                  
                  <p className="text-lg text-gray-300 leading-relaxed font-light">
                    {hero.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-400 font-light">
                    <span>by {hero.creator}</span>
                    <span>•</span>
                    <span>{hero.duration}</span>
                    <span>•</span>
                    <span>Horror • Mystery</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 pt-4">
                    <button className="bg-white hover:bg-silver text-black px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 tracking-wide">
                      <Play size={20} />
                      <span>Play Now</span>
                    </button>
                    <button className="bg-gray-900/80 hover:bg-gray-800/80 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 tracking-wide">
                      <Heart size={20} />
                      <span>Add to List</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Hero Navigation */}
        <button
          onClick={prevHeroSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextHeroSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Hero Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === heroSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-8 font-serif tracking-wide">Browse by Genre</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 cursor-pointer hover:scale-105 transition-all duration-300 group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3 font-serif tracking-wide">{category.title}</h3>
                <p className="text-white/80 text-sm mb-4 leading-relaxed font-light">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm font-light">
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
      </section>

      {/* Trending Now */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <TrendingUp size={28} className="text-silver" />
            <h2 className="text-3xl font-bold text-white font-serif tracking-wide">Trending Now</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => prevSlide(trendingSlide, setTrendingSlide)}
              disabled={trendingSlide === 0}
              className={`p-2 rounded-full transition-colors duration-200 ${
                trendingSlide === 0 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => nextSlide(trendingSlide, setTrendingSlide, tracks.length)}
              disabled={trendingSlide >= tracks.length - 4}
              className={`p-2 rounded-full transition-colors duration-200 ${
                trendingSlide >= tracks.length - 4
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out space-x-6"
            style={{ transform: `translateX(-${trendingSlide * 25}%)` }}
          >
            {tracks.map((track, index) => (
              <div key={track.id} className="w-1/4 flex-shrink-0">
                <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer relative">
                  <div className="absolute top-4 left-4 bg-silver text-black px-2 py-1 rounded text-xs font-bold tracking-wide">
                    #{index + 1}
                  </div>
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
                  <h3 className="text-lg font-semibold text-white mb-2 truncate font-serif tracking-wide">{track.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 font-light">{track.creator}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-500 text-sm font-light">
                      <Clock size={16} />
                      <span>{track.duration}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                        <Heart size={16} className="text-gray-500 hover:text-silver" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                        <MoreHorizontal size={16} className="text-gray-500 hover:text-silver" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Fire size={28} className="text-silver" />
            <h2 className="text-3xl font-bold text-white font-serif tracking-wide">Recently Added</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => prevSlide(recentSlide, setRecentSlide)}
              disabled={recentSlide === 0}
              className={`p-2 rounded-full transition-colors duration-200 ${
                recentSlide === 0 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => nextSlide(recentSlide, setRecentSlide, playlists.length)}
              disabled={recentSlide >= playlists.length - 4}
              className={`p-2 rounded-full transition-colors duration-200 ${
                recentSlide >= playlists.length - 4
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out space-x-6"
            style={{ transform: `translateX(-${recentSlide * 25}%)` }}
          >
            {playlists.map((playlist) => (
              <div key={playlist.id} className="w-1/4 flex-shrink-0">
                <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer">
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
                  <h3 className="text-lg font-semibold text-white mb-2 font-serif tracking-wide">{playlist.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 font-light">by {playlist.creator}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-500 text-sm font-light">
                      <Users size={16} />
                      <span>{playlist.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                        <Heart size={16} className="text-gray-500 hover:text-silver" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                        <MoreHorizontal size={16} className="text-gray-500 hover:text-silver" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;