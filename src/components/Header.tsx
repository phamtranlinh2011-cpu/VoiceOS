import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface HeaderProps {
  isListening: boolean;
  onToggleListening: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isListening, onToggleListening }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4.5 bg-transparent border-b border-slate-200/60 mb-2">
      {/* Brand: 🌷 VoiceOS gigme */}
      <div className="flex items-center gap-2.5">
        <span className="text-2xl select-none" role="img" aria-label="tulip">
          🌷
        </span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          VoiceOS gigme
        </h1>
      </div>

      {/* Small Mic Button at top right */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleListening}
          className={`p-2.5 rounded-full transition-all shadow-2xs flex items-center justify-center cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-100'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          title={isListening ? 'Đang dịch... Bấm hoặc nói "kết thúc" để dừng' : 'Bấm hoặc nói "bắt đầu" để bắt đầu dịch'}
          aria-label={isListening ? 'Dừng dịch' : 'Bắt đầu dịch'}
        >
          {isListening ? <Mic className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
