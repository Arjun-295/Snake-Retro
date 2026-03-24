import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'SYS.AUDIO_01.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'SYS.AUDIO_02.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'SYS.AUDIO_03.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  return (
    <div className="bg-[#000] p-6 border-4 border-[#ff00ff] shadow-[4px_4px_0px_#00ffff] w-full flex flex-col items-center relative overflow-hidden">
      <div className="absolute inset-0 static-noise opacity-30 pointer-events-none"></div>
      
      <h2 className="text-2xl font-black mb-1 text-[#00ffff] tracking-widest uppercase glitch" data-text="AUDIO_STREAM">
        AUDIO_STREAM
      </h2>
      <div className="text-sm text-[#ff00ff] mb-6 font-mono text-center h-4 tracking-wider uppercase">
        {isPlaying ? '> PLAYING: ' : '> PAUSED: '} {TRACKS[currentTrack].title}
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onEnded={nextTrack}
        loop={false}
      />

      <div className="flex items-center gap-6 font-mono text-lg">
        <button onClick={prevTrack} className="text-[#00ffff] hover:bg-[#00ffff] hover:text-black px-2 py-1 transition-colors border border-transparent hover:border-[#00ffff]">
          [ &lt;&lt; ]
        </button>
        <button 
          onClick={togglePlay} 
          className="px-6 py-2 bg-transparent border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-colors uppercase font-bold tracking-widest"
        >
          {isPlaying ? 'HALT' : 'ENGAGE'}
        </button>
        <button onClick={nextTrack} className="text-[#00ffff] hover:bg-[#00ffff] hover:text-black px-2 py-1 transition-colors border border-transparent hover:border-[#00ffff]">
          [ &gt;&gt; ]
        </button>
      </div>
    </div>
  );
}
