import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Radio, SkipForward, Heart, MoreHorizontal, Waves, Zap } from 'lucide-react';
import { METHODS } from 'http';

interface Track {
  id: string;
  title: string;
  creator: string;
  duration: string;
  type: 'podcast' | 'audio-drama' | 'slow-content' | 'solo-narration';
  coverUrl: string;
  audioUrl: string;
}

interface RadioStation {
  id: string;
  name: string;
  description: string;
  genre: string;
  coverUrl: string;
  isLive: boolean;
  listeners: number;
  currentTrack?: Track;
}

interface RadioPageProps {
  onPlayTrack: (track: Track) => void;
}
function RadioPage({ onPlayTrack }: RadioPageProps) {
const [loading, setLoading] = useState(false);
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [selectedStation, setSelectedStation] = useState<string | null>(null);
const [radioStations, setRadioStations] = useState<RadioStation[]>([]);

useEffect(() => {
  // Rename the async function to avoid conflict with the state variable
  const fetchRadioStations = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        // "https://pocket-fm-api.p.rapidapi.com/api/pocket?search=my%20love&apikey=5eb5f408",
        "https://60k-radio-stations.p.rapidapi.com/get/genres?keyword=jap",
        {
          method: "GET",
          headers: {
            "X-Rapidapi-Key": "0e611034d2mshc2cc6bec900bc64p17705bjsn1dd58db03294",
            "X-Rapidapi-Host": "60k-radio-stations.p.rapidapi.com"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data", ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      // Adjust this depending on API response structure
      setRadioStations(data.genres);
    } catch (error) {
      console.error("Error fetching from Pocket FM API:", error);
      return ;
    } finally {
      setLoading(false);
    }
  };

  fetchRadioStations();
}, []);

// Find the currently selected station
const selectedStationData = radioStations?.find(
  station => station.id === selectedStation
);

// Timer to track playback progress
useEffect(() => {
  let interval: NodeJS.Timeout;
  if (isPlaying) {
    interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);
  }
  return () => clearInterval(interval);
}, [isPlaying]);

// Format seconds into MM:SS
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Select a station
const handleStationSelect = (stationId: string) => {
  setSelectedStation(stationId);
  setIsPlaying(true);
  setCurrentTime(0);
};

// Toggle play/pause
const togglePlayPause = () => {
  setIsPlaying(!isPlaying);
};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Radio size={40} className="text-red-500" />
          <h1 className="text-4xl font-bold text-white font-serif">Arkham Radio</h1>
        </div>
        <p className="text-xl text-zinc-400">Continuous streams of dark audio content</p>
        <div className="flex items-center justify-center space-x-6 text-sm text-zinc-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Live 24/7</span>
          </div>
          <span>•</span>
          <span>No ads, just pure content</span>
          <span>•</span>
          <span>Curated by AI</span>
        </div>
      </div>

      {/* Current Station Player */}
      {selectedStationData && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={selectedStationData.coverUrl}
                alt={selectedStationData.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="absolute -top-2 -right-2 bg-silver text-black px-2 py-1 rounded-full text-xs font-bold">
                LIVE
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white font-serif mb-2">{selectedStationData.name}</h2>
              <p className="text-gray-400 mb-3">{selectedStationData.description}</p>
              
              {selectedStationData.currentTrack && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Now Playing:</p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedStationData.currentTrack.coverUrl}
                      alt={selectedStationData.currentTrack.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-white font-medium">{selectedStationData.currentTrack.title}</h4>
                      <p className="text-gray-400 text-sm">{selectedStationData.currentTrack.creator}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="flex items-center space-x-1 text-gray-400 mb-1">
                  <Waves size={16} />
                  <span className="text-sm">{selectedStationData.listeners.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">listeners</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-3 rounded-full hover:bg-gray-700 transition-colors duration-200">
                  <Heart size={20} className="text-gray-400" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="w-14 h-14 bg-silver hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  {isPlaying ? (
                    <Pause size={24} className="text-black" />
                  ) : (
                    <Play size={24} className="text-black ml-1" />
                  )}
                </button>
                <button className="p-3 rounded-full hover:bg-gray-700 transition-colors duration-200">
                  <SkipForward size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-silver rounded-full transition-all duration-1000"
                  style={{ width: `${(currentTime % 300) / 3}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">∞</span>
            </div>
          </div>
        </div>
      )}

      {/* Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {radioStations.map((station) => (
          <div
            key={station.id}
            onClick={() => handleStationSelect(station.id)}
            className={`group bg-zinc-900 border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-zinc-800 ${
              selectedStation === station.id 
                ? 'border-red-500 bg-zinc-800' 
                : 'border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="relative mb-4">
              <img
                src={station.coverUrl}
                alt={station.name}
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
                <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                  {station.genre}
                </div>
              </div>
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play size={24} className="text-white ml-1" />
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2 font-serif">{station.name}</h3>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{station.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-zinc-500 text-sm">
                <Waves size={16} />
                <span>{station.listeners.toLocaleString()}</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-2 rounded-full hover:bg-zinc-700 transition-colors duration-200"
                >
                  <Heart size={16} className="text-zinc-500" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-2 rounded-full hover:bg-zinc-700 transition-colors duration-200"
                >
                  <MoreHorizontal size={16} className="text-zinc-500" />
                </button>
              </div>
            </div>
            
            {/* Current Track Preview */}
            {station.currentTrack && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 mb-2">Now Playing:</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={station.currentTrack.coverUrl}
                    alt={station.currentTrack.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-white text-sm font-medium truncate">{station.currentTrack.title}</h5>
                    <p className="text-zinc-400 text-xs truncate">{station.currentTrack.creator}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 font-serif">Why Arkham Radio?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-silver rounded-full flex items-center justify-center mx-auto">
              <Zap size={24} className="text-black" />
            </div>
            <h3 className="text-lg font-semibold text-white">AI Curated</h3>
            <p className="text-gray-400 text-sm">Our AI learns your preferences and curates the perfect audio experience</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-silver rounded-full flex items-center justify-center mx-auto">
              <Radio size={24} className="text-black" />
            </div>
            <h3 className="text-lg font-semibold text-white">Always Live</h3>
            <p className="text-gray-400 text-sm">Continuous streams with no interruptions, just pure quality content</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-silver rounded-full flex items-center justify-center mx-auto">
              <Waves size={24} className="text-black" />
            </div>
            <h3 className="text-lg font-semibold text-white">Genre Focused</h3>
            <p className="text-gray-400 text-sm">Each station specializes in specific genres for the perfect mood</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPage;