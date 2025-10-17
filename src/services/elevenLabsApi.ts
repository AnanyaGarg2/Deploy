interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

interface GenerationConfig {
  chunk_length_schedule: number[];
}

interface ElevenLabsRequest {
  text: string;
  model_id: string;
  voice_settings: VoiceSettings;
  generation_config: GenerationConfig;
}

// Voice configurations for different content types
const VOICE_CONFIGS = {
  'podcast': {
    voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam - Professional male voice
    model_id: 'eleven_turbo_v2_5',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.8,
      style: 0.2,
      use_speaker_boost: true,
    },
  },
  'audio-drama': {
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // Bella - Expressive female voice
    model_id: 'eleven_turbo_v2_5',
    voice_settings: {
      stability: 0.3,
      similarity_boost: 0.9,
      style: 0.8,
      use_speaker_boost: true,
    },
  },
  'slow-content': {
    voice_id: 'CYw3kZ02Hs0563khs1Fj', // Grace - Calm, soothing voice
    model_id: 'eleven_turbo_v2_5',
    voice_settings: {
      stability: 0.8,
      similarity_boost: 0.7,
      style: 0.1,
      use_speaker_boost: false,
    },
  },
  'solo-narration': {
    voice_id: 'onwK4e9ZLuTAKqWW03F9', // Daniel - Clear, authoritative voice
    model_id: 'eleven_turbo_v2_5',
    voice_settings: {
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.3,
      use_speaker_boost: true,
    },
  },
};

export class ElevenLabsService {
  private rapidApiKey: string;
  private elevenLabsKey: string;
  private baseUrl = 'https://elevenlabs-mcp.p.rapidapi.com';

  constructor() {
    this.rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
    this.elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

    if (!this.rapidApiKey || !this.elevenLabsKey) {
      throw new Error('Missing RapidAPI or ElevenLabs API key in environment variables');
    }
  }

  async generateAudio(
    text: string,
    contentType: 'podcast' | 'audio-drama' | 'slow-content' | 'solo-narration',
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    const config = VOICE_CONFIGS[contentType];
    if (!config) throw new Error(`Unsupported content type: ${contentType}`);

    const requestBody: ElevenLabsRequest = {
      text,
      model_id: config.model_id,
      voice_settings: config.voice_settings,
      generation_config: {
        chunk_length_schedule: [120, 160, 250, 290],
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/elevenlabs`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'X-Rapidapi-Key': this.rapidApiKey,
          'X-Rapidapi-Host': 'elevenlabs-mcp.p.rapidapi.com',
          'X-Elevenlabs-Api-Key': this.elevenLabsKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RapidAPI ElevenLabs error: ${response.status} - ${errorText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to get response reader');

      const chunks: Uint8Array[] = [];
      let receivedLength = 0;
      const contentLength = parseInt(response.headers.get('content-length') || '0');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (onProgress && contentLength > 0) {
          onProgress((receivedLength / contentLength) * 100);
        }
      }

      const audioData = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        audioData.set(chunk, position);
        position += chunk.length;
      }

      return new Blob([audioData], { type: 'audio/mpeg' });
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    }
  }

  async getVoices() {
    try {
      const response = await fetch(`${this.baseUrl}/elevenlabs/voices`, {
        headers: {
          'X-Rapidapi-Key': this.rapidApiKey,
          'X-Rapidapi-Host': 'elevenlabs-mcp.p.rapidapi.com',
          'X-Elevenlabs-Api-Key': this.elevenLabsKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  async getModels() {
    try {
      const response = await fetch(`${this.baseUrl}/elevenlabs/models`, {
        headers: {
          'X-Rapidapi-Key': this.rapidApiKey,
          'X-Rapidapi-Host': 'elevenlabs-mcp.p.rapidapi.com',
          'X-Elevenlabs-Api-Key': this.elevenLabsKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();
