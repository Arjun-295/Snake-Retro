import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#00ffff] flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono static-noise scanlines">
      {/* Harsh Background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-full h-1 bg-[#00ffff] opacity-50 animate-pulse"></div>

      <header className="mb-8 text-center z-10 screen-tear">
        <h1 className="text-6xl md:text-7xl font-bold tracking-widest mb-2 uppercase">
          <span className="glitch text-[#00ffff]" data-text="SNAKE">SNAKE</span>
          <span className="text-white mx-4 opacity-50">_</span>
          <span className="glitch text-[#ff00ff]" data-text="BEATS">BEATS</span>
        </h1>
        <p className="text-[#ff00ff] text-sm tracking-[0.5em] uppercase mt-4 opacity-80">
          [ SYS.OVERRIDE // INITIALIZING SEQUENCE ]
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-10 items-center z-10">
        <SnakeGame />
        <div className="w-full max-w-md">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
