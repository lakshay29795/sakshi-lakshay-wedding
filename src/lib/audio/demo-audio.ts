// Generate pleasant demo audio that sounds like actual music
export function generateMelodyAudio(style: 'romantic' | 'upbeat' | 'mellow' | 'classic', duration: number = 10): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const numSamples = sampleRate * duration;
    
    // Create stereo audio buffer
    const audioBuffer = audioContext.createBuffer(2, numSamples, sampleRate);
    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = audioBuffer.getChannelData(1);
    
    // Define chord progressions and melodies for each style
    const musicData = getMusicData(style);
    
    // Generate the audio
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate;
      const sample = generateSample(time, musicData, duration);
      
      // Add slight stereo separation
      leftChannel[i] = sample * 0.8;
      rightChannel[i] = sample * 0.7;
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

// Generate a single audio sample with realistic music
function generateSample(time: number, musicData: any, totalDuration: number): number {
  const { chords, melody, tempo, baseFreq } = musicData;
  
  // Calculate current position in the song
  const beatsPerSecond = tempo / 60;
  const currentBeat = (time * beatsPerSecond) % (chords.length * 4);
  const chordIndex = Math.floor(currentBeat / 4);
  const beatInChord = currentBeat % 4;
  
  // Get current chord
  const currentChord = chords[chordIndex % chords.length];
  
  // Generate chord (bass notes)
  let chordSound = 0;
  currentChord.forEach((note: number, index: number) => {
    const freq = baseFreq * Math.pow(2, note / 12);
    const amplitude = 0.15 / (index + 1); // Lower notes louder
    chordSound += Math.sin(2 * Math.PI * freq * time) * amplitude;
  });
  
  // Generate melody
  const melodyIndex = Math.floor((time * beatsPerSecond * 2) % melody.length);
  const melodyNote = melody[melodyIndex];
  const melodyFreq = baseFreq * 2 * Math.pow(2, melodyNote / 12); // Octave higher
  
  // Create a more pleasant waveform (mix of sine and triangle)
  const melodySound = (
    Math.sin(2 * Math.PI * melodyFreq * time) * 0.6 +
    Math.sign(Math.sin(2 * Math.PI * melodyFreq * time)) * 0.2
  ) * 0.25;
  
  // Add some rhythm variation
  const rhythmEnvelope = Math.sin(2 * Math.PI * beatsPerSecond * time) * 0.1 + 0.9;
  
  // Overall envelope (fade in/out)
  const fadeTime = Math.min(totalDuration * 0.1, 2); // 10% of duration or 2 seconds max
  const envelope = Math.min(time / fadeTime, 1) * Math.min((totalDuration - time) / fadeTime, 1);
  
  // Combine all elements
  const finalSample = (chordSound + melodySound) * rhythmEnvelope * envelope * 0.5;
  
  // Soft limiting to prevent clipping
  return Math.tanh(finalSample);
}

// Define musical data for each style
function getMusicData(style: string) {
  switch (style) {
    case 'romantic':
      return {
        // C major - Am - F - G progression (very romantic)
        chords: [
          [0, 4, 7],    // C major
          [9, 0, 4],    // A minor
          [5, 9, 0],    // F major
          [7, 11, 2]    // G major
        ],
        melody: [0, 2, 4, 5, 4, 2, 0, -1, 0, 4, 7, 5, 4, 2, 0], // Gentle melody
        tempo: 70,
        baseFreq: 261.63 // C4
      };
      
    case 'upbeat':
      return {
        // I - V - vi - IV progression (pop/upbeat)
        chords: [
          [0, 4, 7],    // C major
          [7, 11, 2],   // G major
          [9, 0, 4],    // A minor
          [5, 9, 0]     // F major
        ],
        melody: [0, 4, 7, 9, 7, 4, 0, 2, 4, 7, 9, 11, 12, 9, 7], // Energetic melody
        tempo: 120,
        baseFreq: 261.63 // C4
      };
      
    case 'mellow':
      return {
        // Jazz-influenced progression
        chords: [
          [0, 4, 7, 11], // Cmaj7
          [9, 0, 4, 7],  // Am7
          [2, 5, 9, 0],  // Dm7
          [7, 11, 2, 5]  // G7
        ],
        melody: [0, 2, 4, 7, 9, 7, 4, 2, 0, -3, 0, 4, 7, 4, 0], // Smooth melody
        tempo: 80,
        baseFreq: 261.63 // C4
      };
      
    case 'classic':
      return {
        // Classical progression
        chords: [
          [0, 4, 7],    // C major
          [2, 5, 9],    // D minor
          [7, 11, 2],   // G major
          [0, 4, 7]     // C major
        ],
        melody: [0, 4, 7, 12, 11, 9, 7, 5, 4, 2, 0, 2, 4, 7, 0], // Classical melody
        tempo: 90,
        baseFreq: 261.63 // C4
      };
      
    default:
      return getMusicData('romantic');
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
  
  // Convert float samples to 16-bit PCM (interleaved for stereo)
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

// Pre-generated demo songs with realistic melodies
export const demoSongs = {
  romantic: () => generateMelodyAudio('romantic', 10), // Gentle romantic melody
  upbeat: () => generateMelodyAudio('upbeat', 8),      // Energetic pop melody  
  mellow: () => generateMelodyAudio('mellow', 12),     // Smooth jazz-style melody
  classic: () => generateMelodyAudio('classic', 15),   // Classical-style melody
};
