import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Heart, MoreHorizontal, Maximize2 } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  creator: string;
  duration: string;
  type: 'podcast' | 'audio-drama' | 'slow-narration';
  coverUrl: string;
  audioUrl: string;
}

interface AudioPlayerProps {
  track: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, isPlaying, onTogglePlay }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="h-24 bg-black border-t border-gray-800 flex items-center px-6">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        src={track.audioUrl}
      />
      
      {/* Track Info */}
      <div className="flex items-center space-x-4 w-80">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate tracking-wide">{track.title}</h4>
          <p className="text-gray-400 text-sm truncate font-light">{track.creator}</p>
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="p-2 rounded-full hover:bg-gray-900 transition-colors duration-200"
        >
          <Heart 
            size={16} 
            className={isLiked ? 'text-silver fill-current' : 'text-gray-400 hover:text-silver'} 
          />
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex-1 flex flex-col items-center space-y-2 px-8">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isShuffled ? 'text-silver' : 'text-gray-400 hover:text-silver'
            }`}
          >
            <Shuffle size={20} />
          </button>
          
          <button className="p-2 rounded-full hover:bg-gray-900 transition-colors duration-200">
            <SkipBack size={24} className="text-gray-400 hover:text-silver" />
          </button>
          
          <button
            onClick={onTogglePlay}
            className="w-12 h-12 bg-silver rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 hover:bg-white"
          >
            {isPlaying ? (
              <Pause size={24} className="text-black" />
            ) : (
              <Play size={24} className="text-black ml-1" />
            )}
          </button>
          
          <button className="p-2 rounded-full hover:bg-gray-900 transition-colors duration-200">
            <SkipForward size={24} className="text-gray-400 hover:text-silver" />
          </button>
          
          <button
            onClick={() => setIsRepeated(!isRepeated)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isRepeated ? 'text-silver' : 'text-gray-400 hover:text-silver'
            }`}
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-3 w-full max-w-lg">
          <span className="text-xs text-gray-400 w-12 font-light">{formatTime(currentTime)}</span>
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="flex-1 h-2 bg-gray-600 rounded-full cursor-pointer group"
          >
            <div
              className="h-full bg-white rounded-full relative group-hover:bg-gray-200 transition-colors duration-200"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-silver rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          </div>
          <span className="text-xs text-gray-400 w-12 font-light">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume and Options */}
      <div className="flex items-center space-x-4 w-80 justify-end">
        <button className="p-2 rounded-full hover:bg-gray-900 transition-colors duration-200">
          <MoreHorizontal size={20} className="text-gray-400 hover:text-silver" />
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-900 transition-colors duration-200"
          >
            {isMuted ? (
              <VolumeX size={20} className="text-gray-400 hover:text-silver" />
            ) : (
              <Volume2 size={20} className="text-gray-400 hover:text-silver" />
            )}
          </button>
          <div className="w-24 h-2 bg-gray-600 rounded-full cursor-pointer group">
            <div
              className="h-full bg-silver rounded-full relative group-hover:bg-white transition-colors duration-200"
              style={{ width: `${volume * 100}%` }}
              onClick={(e) => {
                const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                setVolume(Math.max(0, Math.min(1, percent)));
              }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-silver rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-gray-900 transition-colors duration-200"
        >
          <Maximize2 size={20} className="text-gray-400 hover:text-silver" />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
