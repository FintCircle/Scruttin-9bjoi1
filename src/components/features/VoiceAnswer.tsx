import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceAnswerProps {
  duration: string;
  authorName: string;
}

export default function VoiceAnswer({ duration, authorName }: VoiceAnswerProps) {
  const [playing, setPlaying] = useState(false);

  const handleToggle = () => {
    setPlaying(!playing);
    if (!playing) {
      // Simulate playback end
      const [mins, secs] = duration.split(':').map(Number);
      const totalMs = (mins * 60 + secs) * 1000;
      setTimeout(() => setPlaying(false), Math.min(totalMs, 5000));
    }
  };

  return (
    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
      <button
        onClick={handleToggle}
        className="w-9 h-9 rounded-full bg-[hsl(24,95%,53%)] flex items-center justify-center flex-shrink-0 hover:bg-orange-600 transition-colors"
      >
        {playing
          ? <Pause size={14} fill="white" className="text-white" />
          : <Play size={14} fill="white" className="text-white ml-0.5" />
        }
      </button>

      {/* Waveform */}
      <div className="flex items-center gap-[3px] flex-1">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full bg-[hsl(24,95%,53%)] opacity-${playing ? '100' : '40'} wave-bar`}
            style={{
              width: '3px',
              height: `${8 + Math.sin(i * 0.8) * 6 + Math.random() * 4}px`,
              animationPlayState: playing ? 'running' : 'paused',
              animationDelay: `${(i % 8) * 0.15}s`,
            }}
          />
        ))}
      </div>

      <div className="flex-shrink-0 text-right">
        <p className="text-xs font-semibold text-slate-700">{duration}</p>
        <p className="text-[10px] text-slate-400">voice</p>
      </div>
    </div>
  );
}
