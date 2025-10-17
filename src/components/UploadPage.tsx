import React, { useState } from 'react';
import { Upload, FileText, Mic, Headphones, Clock, Zap, Settings, CheckCircle, AlertCircle, User, Plus, X, Tag } from 'lucide-react';
import { elevenLabsService } from '../services/elevenLabsApi';
import { DocumentProcessor } from '../utils/fileProcessor';
import { SubscriptionService } from '../services/subscriptionService';
import TokenDisplay from './TokenDisplay';
import SubscriptionModal from './SubscriptionModal';

interface ProcessingStatus {
  stage: 'idle' | 'processing-text' | 'generating-audio' | 'complete' | 'error';
  progress: number;
  message: string;
}

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<'podcast' | 'audio-drama' | 'slow-content' | 'solo-narration' | 'audiobook' | 'educational' | 'entertainment'>('podcast');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string>('default');
  const [isCloneVoice, setIsCloneVoice] = useState(false);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    stage: 'idle', progress: 0, message: ''
  });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  
  // Mock user ID - in real app, get from auth context
  const currentUserId = '550e8400-e29b-41d4-a716-446655440000';

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      
      // Estimate tokens needed
      DocumentProcessor.processFile(file).then(processed => {
        const tokensNeeded = SubscriptionService.calculateTokensNeeded(processed.wordCount);
        setEstimatedTokens(tokensNeeded);
      });
    }
  };

  const handleSubmit = async () => {
    if (selectedFile && title) {
      try {
        // Check if user has enough tokens
        const hasEnoughTokens = await SubscriptionService.checkTokensAvailable(currentUserId, estimatedTokens);
        if (!hasEnoughTokens) {
          setProcessingStatus({
            stage: 'error',
            progress: 0,
            message: 'Insufficient tokens. Please upgrade your plan or wait for monthly reset.'
          });
          return;
        }

        // Stage 1: Process document
        setProcessingStatus({
          stage: 'processing-text',
          progress: 10,
          message: 'Processing document and extracting text...'
        });

        const processedDoc = await DocumentProcessor.processFile(selectedFile);
        
        setProcessingStatus({
          stage: 'processing-text',
          progress: 30,
          message: `Extracted ${processedDoc.wordCount} words. Estimated duration: ${DocumentProcessor.formatDuration(processedDoc.estimatedDuration)}`
        });

        // Stage 2: Generate audio with Eleven Labs
        setProcessingStatus({
          stage: 'generating-audio',
          progress: 40,
          message: 'Generating audio with AI voice synthesis...'
        });

        const audioBlob = await elevenLabsService.generateAudio(
          processedDoc.text,
          conversionType,
          (progress) => {
            setProcessingStatus({
              stage: 'generating-audio',
              progress: 40 + (progress * 0.5),
              message: `Generating audio... ${Math.round(progress)}%`
            });
          }
        );

        // Use tokens
        await SubscriptionService.useTokens(
          currentUserId,
          'temp-track-id', // In real app, this would be the created track ID
          estimatedTokens,
          processedDoc.wordCount
        );

        // Stage 3: Complete
        setProcessingStatus({
          stage: 'complete',
          progress: 100,
          message: 'Audio generation completed successfully!'
        });

        // Here you would typically upload the audio blob to your storage
        console.log('Generated audio blob:', audioBlob);
        
      } catch (error) {
        console.error('Processing error:', error);
        setProcessingStatus({
          stage: 'error',
          progress: 0,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
        });
      }
    }
  };

  const conversionOptions = [
    {
      type: 'audiobook' as const,
      icon: FileText,
      title: 'Audiobook',
      description: 'Chapter-by-chapter book narration with natural pacing',
      color: 'from-gray-500 to-gray-800',
      features: ['Chapter breaks', 'Consistent narration', 'Book-style pacing', 'Multiple voices available']
    },
    {
      type: 'podcast' as const,
      icon: Mic,
      title: 'Podcast Style',
      description: 'Professional narration with natural pacing and emphasis',
      color: 'from-gray-500 to-gray-800',
      features: ['Clear diction', 'Natural pauses', 'Professional tone', 'Interview style']
    },
    {
      type: 'audio-drama' as const,
      icon: Headphones,
      title: 'Audio Drama',
      description: 'Theatrical performance with character voices and sound effects',
      color: 'from-gray-600 to-gray-900',
      features: ['Expressive delivery', 'Dramatic pacing', 'Theatrical style', 'Character voices']
    },
    {
      type: 'slow-content' as const,
      icon: Clock,
      title: 'Slow Content',
      description: 'ASMR, meditation, and calming content for relaxation',
      color: 'from-gray-400 to-gray-700',
      features: ['Soothing tone', 'Slow pace', 'Calming atmosphere', 'Relaxation focused']
    },
    {
      type: 'solo-narration' as const,
      icon: Headphones,
      title: 'Solo Narration',
      description: 'Single voice narration for books, essays, and papers',
      color: 'from-gray-500 to-gray-800',
      features: ['Clear narration', 'Authoritative tone', 'Educational style', 'Documentary style']
    },
    {
      type: 'educational' as const,
      icon: FileText,
      title: 'Educational',
      description: 'Learning content with clear explanations and emphasis',
      color: 'from-gray-500 to-gray-700',
      features: ['Clear explanations', 'Emphasis on key points', 'Learning focused', 'Tutorial style']
    },
    {
      type: 'entertainment' as const,
      icon: Mic,
      title: 'Entertainment',
      description: 'Engaging content for entertainment and storytelling',
      color: 'from-gray-600 to-gray-800',
      features: ['Engaging delivery', 'Story-focused', 'Entertainment value', 'Dynamic pacing']
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Token Display */}
      <div className="max-w-sm">
        <TokenDisplay 
          userId={currentUserId} 
          onUpgradeClick={() => setShowSubscriptionModal(true)} 
        />
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-black">Transform Your Documents</h1>
        <p className="text-xl text-gray-600">Upload any document and let our AI create immersive audio experiences</p>
      </div>

      {/* Upload Area */}
      <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300 hover:border-black transition-colors duration-300">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <Upload size={40} className="text-black" />
            </div>
          </div>
          
          {selectedFile ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-black">
                <FileText size={20} />
                <span className="font-medium">{selectedFile.name}</span>
              </div>
              <p className="text-gray-600 text-sm">
                File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {estimatedTokens > 0 && (
                <p className="text-gray-600 text-sm">
                  Estimated tokens needed: {estimatedTokens.toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black">Drop your document here</h3>
              <p className="text-gray-600">Supports PDF, DOC, DOCX, TXT files up to 50MB</p>
            </div>
          )}
          
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold cursor-pointer transition-all duration-200"
          >
            Choose File
          </label>
        </div>
      </div>

      {/* Conversion Type Selection */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-black">Choose Conversion Style</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {conversionOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.type}
                onClick={() => setConversionType(option.type)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  conversionType === option.type
                    ? 'bg-black text-white ring-2 ring-black'
                    : 'bg-gray-100 hover:bg-gray-200 text-black'
                }`}
              >
                <div className="space-y-4">
                  <Icon size={32} className={conversionType === option.type ? 'text-white' : 'text-black'} />
                  <div>
                    <h3 className={`text-lg font-semibold ${conversionType === option.type ? 'text-white' : 'text-black'}`}>{option.title}</h3>
                    <p className={`text-sm mt-1 ${conversionType === option.type ? 'text-gray-300' : 'text-gray-600'}`}>{option.description}</p>
                  </div>
                  <ul className="space-y-1">
                    {option.features.map((feature, index) => (
                      <li key={index} className={`text-sm flex items-center space-x-2 ${conversionType === option.type ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className={`w-1 h-1 rounded-full ${conversionType === option.type ? 'bg-gray-300' : 'bg-gray-600'}`}></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metadata Form */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-black">Audio Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter audio title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black">
              <option>Literature</option>
              <option>Business</option>
              <option>Technology</option>
              <option>Self-Help</option>
              <option>Fiction</option>
              <option>Non-Fiction</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Describe your audio content"
          />
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors">
            <Settings size={20} />
            <span>Advanced Settings</span>
          </button>
        </div>
      </div>

      {/* Processing Status */}
      {processingStatus.stage !== 'idle' && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            {processingStatus.stage === 'complete' ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : processingStatus.stage === 'error' ? (
              <AlertCircle className="text-red-500" size={24} />
            ) : (
              <Zap className="text-blue-500 animate-spin" size={24} />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">
                {processingStatus.stage === 'complete' ? 'Complete!' : 
                 processingStatus.stage === 'error' ? 'Error' : 'Processing...'}
              </h3>
              <p className="text-gray-400 text-sm">{processingStatus.message}</p>
            </div>
          </div>
          
          {processingStatus.stage !== 'error' && processingStatus.stage !== 'complete' && (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${processingStatus.progress}%` }}
              ></div>
            </div>
          )}
          
          {processingStatus.stage === 'complete' && (
            <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200">
              View in Library
            </button>
          )}
        </div>
      )}

      {/* Process Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || !title || processingStatus.stage === 'processing-text' || processingStatus.stage === 'generating-audio'}
          className={`px-8 py-4 rounded-full font-semibold transition-all duration-200 ${
            !selectedFile || !title || processingStatus.stage === 'processing-text' || processingStatus.stage === 'generating-audio'
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-silver hover:bg-white text-black transform hover:scale-105'
          }`}
        >
          {processingStatus.stage === 'processing-text' || processingStatus.stage === 'generating-audio' ? (
            <div className="flex items-center space-x-2">
              <Zap className="animate-spin" size={20} />
              <span>Generating Audio...</span>
            </div>
          ) : (
            'Start AI Conversion'
          )}
        </button>
        {selectedFile && (
          <div className="text-gray-400 text-sm mt-2 space-y-1">
            <p>Processing time varies based on document length</p>
            {estimatedTokens > 0 && (
              <p>This will use approximately {estimatedTokens.toLocaleString()} tokens</p>
            )}
          </div>
        )}
      </div>
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default UploadPage;