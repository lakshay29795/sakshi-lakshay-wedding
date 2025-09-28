// Generate demo audio files using Web Audio API
export function generateDemoAudio(frequency: number, duration: number = 5): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const numSamples = sampleRate * duration;
    
    // Create audio buffer
    const audioBuffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    // Generate a simple melody
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate;
      
      // Create a simple melody with multiple frequencies
      const note1 = Math.sin(2 * Math.PI * frequency * time) * 0.3;
      const note2 = Math.sin(2 * Math.PI * (frequency * 1.25) * time) * 0.2;
      const note3 = Math.sin(2 * Math.PI * (frequency * 1.5) * time) * 0.1;
      
      // Add envelope (fade in/out)
      const envelope = Math.min(time * 4, 1) * Math.min((duration - time) * 4, 1);
      
      channelData[i] = (note1 + note2 + note3) * envelope;
    }
    
    // Convert to WAV format and return as data URL
    const wavData = audioBufferToWav(audioBuffer);
    const blob = new Blob([wavData], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
    
  } catch (error) {
    console.error('Error generating demo audio:', error);
    return '';
  }
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * numberOfChannels * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * numberOfChannels * 2, true);
  
  // Convert float samples to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return arrayBuffer;
}

// Pre-generated demo songs
export const demoSongs = {
  romantic: () => generateDemoAudio(440, 10), // A4 note
  upbeat: () => generateDemoAudio(523, 8),    // C5 note  
  mellow: () => generateDemoAudio(349, 12),   // F4 note
  classic: () => generateDemoAudio(294, 15),  // D4 note
};
