import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Radio,
  SkipForward,
  Heart,
  MoreHorizontal,
  Waves,
  Zap,
} from 'lucide-react';

// --- INTERFACES ---

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
  country: string;
  language: string;
  favicon: string;
  url: string;
  isLive: boolean;
  listeners: number;
}

interface RadioPageProps {
  onPlayTrack: (track: Track) => void;
}

// --- PERSONAL CONTENT SECTION ---
const PersonalContent: React.FC<RadioPageProps> = ({ onPlayTrack }) => {
  const [loading, setLoading] = useState(false);
  const [radioStations, setRadioStations] = useState<RadioStation[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchRadioStations = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://60k-radio-stations.p.rapidapi.com/get/genres?keyword=jap",
          {
            method: 'GET',
            headers: {
              "X-RapidAPI-Key": "0e611034d2mshc2cc6bec900bc64p17705bjsn1dd58db03294",
              "X-RapidAPI-Host": "60k-radio-stations.p.rapidapi.com",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched Radio Stations:', result);

        // ✅ Access actual array from result.data
        const stations = result.data || [];

        // ✅ Save total count from API
        setTotalCount(result.total || stations.length);

        // ✅ Map to your RadioStation structure
        const mappedStations: RadioStation[] = stations.map((station: any) => ({
          id: String(station.id),
          name: station.name || 'Unknown Station',
          country: 'N/A',
          language: 'N/A',
          url: '#',
          isLive: true,
          listeners: 0,
          favicon: "/Audio.png",
        }));

        setRadioStations(mappedStations);
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRadioStations();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white font-serif">
        Featured Stations
      </h2>

      {/* Show total count */}
      {!loading && totalCount > 0 && (
        <p className="text-gray-400 text-sm">
          Showing {radioStations.length} of {totalCount} genre{totalCount > 1 ? 's' : ''}.
        </p>
      )}

      {loading ? (
        // 1. Loading State
        <div className="text-center p-12 bg-gray-900 rounded-xl">
          <Waves size={32} className="text-red-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-400">Loading stations...</p>
        </div>
      ) : radioStations.length > 0 ? (
        // 2. Success State: Display Grid
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {radioStations.map((station) => (
            <div
              key={station.id}
              className="station-card 
                         bg-gray-900 p-4 rounded-xl border border-gray-800 
                         hover:border-red-500 transition-all duration-200 
                         cursor-pointer text-center space-y-3"
            >
              <img
                src={station.favicon}
                alt={`${station.name} logo`}
                className="w-16 h-16 object-cover rounded-full mx-auto shadow-lg"
              />
              <h3 className="text-md font-semibold text-white truncate">
                {station.name}
              </h3>
              <div className="flex justify-center items-center space-x-1 text-sm text-red-500">
                <Play size={16} />
                <span className="font-medium">Listen</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 3. Empty State
        <div className="text-center p-12 bg-gray-900 rounded-xl">
          <p className="text-lg text-gray-400">No stations found.</p>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 font-serif">
          Why Arkham Radio?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap size={24} className="text-black" />,
              title: 'AI Curated',
              desc: 'Our AI learns your preferences and curates the perfect audio experience.',
            },
            {
              icon: <Radio size={24} className="text-black" />,
              title: 'Always Live',
              desc: 'Continuous streams with no interruptions, just pure quality content.',
            },
            {
              icon: <Waves size={24} className="text-black" />,
              title: 'Genre Focused',
              desc: 'Each station specializes in specific genres for the perfect mood.',
            },
          ].map((feature, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="w-12 h-12 bg-silver rounded-full flex items-center justify-center mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN RADIO PAGE ---
const RadioPage: React.FC<RadioPageProps> = ({ onPlayTrack }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'in-house'>('personal');

  const getTabClasses = (tabName: 'personal' | 'in-house') =>
    `px-4 py-2 text-lg font-semibold border-b-2 transition-colors duration-200 ${
      activeTab === tabName
        ? 'border-red-500 text-white'
        : 'border-transparent text-gray-500 hover:text-gray-300'
    }`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Radio size={40} className="text-red-500" />
          <h1 className="text-4xl font-bold text-white font-serif">Arkham Radio</h1>
        </div>
        <p className="text-xl text-zinc-400">
          Continuous streams of dark audio content
        </p>
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

      {/* --- Tab Switcher --- */}
      <div className="border-b border-gray-700">
        <div className="flex justify-center space-x-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={getTabClasses('personal')}
          >
            Personal
          </button>
          <button
            onClick={() => setActiveTab('in-house')}
            className={getTabClasses('in-house')}
          >
            In-House
          </button>
        </div>
      </div>

      {/* --- Tabs Content --- */}
      {activeTab === 'personal' && <PersonalContent onPlayTrack={onPlayTrack} />}

      {activeTab === 'in-house' && (
        <div className="flex flex-col items-center justify-center h-96 bg-zinc-900 rounded-2xl border border-zinc-800 p-8 mt-8">
          <MoreHorizontal size={48} className="text-gray-500 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">In-House Content</h2>
          <p className="text-xl text-red-500 font-semibold">Coming Soon!</p>
          <p className="text-gray-400 mt-2">
            Stay tuned for exclusive content curated directly by the Arkham team.
          </p>
        </div>
      )}
    </div>
  );
};

export default RadioPage;
