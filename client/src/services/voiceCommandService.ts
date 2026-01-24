/**
 * Voice Command Service for LCARS Trycorder
 * Handles voice recognition and Star Trek command parsing
 */

export type VoiceCommand =
  | 'fire'
  | 'beam'
  | 'shields'
  | 'warp'
  | 'scan'
  | 'hail'
  | 'yellow-alert'
  | 'red-alert'
  | 'cloak'
  | 'unknown';

export interface CommandResult {
  command: VoiceCommand;
  confidence: number;
  transcript: string;
}

class VoiceCommandService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onCommandCallback: ((result: CommandResult) => void) | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }

          const command = this.parseCommand(transcript);
          if (this.onCommandCallback) {
            this.onCommandCallback({
              command,
              confidence: event.results[event.results.length - 1][0].confidence,
              transcript,
            });
          }
        };

        this.recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
      }
    } catch (e) {
      console.warn('Speech Recognition not supported:', e);
    }
  }

  startListening(callback: (result: CommandResult) => void) {
    if (!this.recognition) {
      console.warn('Speech Recognition not available');
      return;
    }

    this.onCommandCallback = callback;
    this.isListening = true;
    this.recognition.start();
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isActive(): boolean {
    return this.isListening;
  }

  private parseCommand(transcript: string): VoiceCommand {
    const lower = transcript.toLowerCase();

    // Remove common prefixes
    let cleaned = lower.replace(/^computer\s+/, '').replace(/^trycorder\s+/, '');

    // Command matching
    if (cleaned.includes('fire') || cleaned.includes('phasor')) {
      return 'fire';
    }
    if (cleaned.includes('beam') || cleaned.includes('transport')) {
      return 'beam';
    }
    if (cleaned.includes('shield')) {
      return 'shields';
    }
    if (cleaned.includes('warp')) {
      return 'warp';
    }
    if (cleaned.includes('scan')) {
      return 'scan';
    }
    if (cleaned.includes('hail') || cleaned.includes('call')) {
      return 'hail';
    }
    if (cleaned.includes('yellow alert')) {
      return 'yellow-alert';
    }
    if (cleaned.includes('red alert')) {
      return 'red-alert';
    }
    if (cleaned.includes('cloak')) {
      return 'cloak';
    }

    return 'unknown';
  }
}

export const voiceCommandService = new VoiceCommandService();
export default voiceCommandService;
