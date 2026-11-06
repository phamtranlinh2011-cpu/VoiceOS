import React from 'react';
import { Volume2, Copy, Check, Radio } from 'lucide-react';

export interface TranslationItem {
  id: string;
  vi: string;
  en: string;
  timestamp: string;
  isInterim?: boolean;
}

interface VoicePanelProps {
  translations: TranslationItem[];
  interimVi: string;
  interimEn: string;
  isListening: boolean;
  isSpeaking: boolean;
  onSpeak: (text: string, lang: 'vi-VN' | 'en-US') => void;
  onToggleListening: () => void;
}

export const VoicePanel: React.FC<VoicePanelProps> = ({
  translations,
  interimVi,
  interimEn,
  isListening,
  isSpeaking,
  onSpeak,
  onToggleListening
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const hasContent = translations.length > 0 || interimVi || interimEn;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 flex-1 px-4 sm:px-6 min-h-[460px] sm:min-h-[520px]">
      {/* TAB 1: VN Tiếng Việt */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-blue-600 tracking-wider">
              VN
            </span>
            <span className="font-bold text-sm text-blue-600">
              Tiếng Việt
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isListening && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Đang nghe... (Nói "stop" để dừng)</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto relative">
          {!hasContent ? (
            /* Idle watermark placeholder */
            <div 
              onClick={onToggleListening}
              className="flex-1 flex flex-col items-center justify-center p-6 relative select-none cursor-pointer group"
              title="Nhấn để bắt đầu nói và dịch"
            >
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-slate-400/40 text-4xl sm:text-5xl font-semibold tracking-wide filter blur-[1px]"
                aria-hidden="true"
              >
                Vietnamese
              </div>

              <div className="z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/60 shadow-2xs group-hover:bg-blue-50 group-hover:border-blue-200 transition-all">
                <Radio className={`w-4 h-4 ${isListening ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-xs font-medium text-slate-600 group-hover:text-blue-700">
                  {isListening ? 'Đang lắng nghe... Hãy nói ngay' : 'Bấm vào đây hoặc micro để nói'}
                </span>
              </div>
              <span className="mt-3 text-[11px] text-slate-400 z-10">
                Nói xong có thể nói từ "stop" để tự động dừng
              </span>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {translations.map((item) => (
                <div
                  key={`vi-${item.id}`}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between group transition-colors"
                >
                  <p className="text-sm font-medium text-slate-900 leading-relaxed">
                    {item.vi}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.timestamp}</span>
                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => handleCopy(item.vi, `vi-${item.id}`)}
                        className="p-1 hover:text-slate-700 rounded"
                        title="Sao chép"
                      >
                        {copiedId === `vi-${item.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => onSpeak(item.vi, 'vi-VN')}
                        className="p-1 hover:text-blue-600 rounded"
                        title="Đọc tiếng Việt"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Interim Real-time Speaking Text */}
              {interimVi && (
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 animate-pulse">
                  <p className="text-sm font-medium text-blue-900 leading-relaxed italic">
                    {interimVi}...
                  </p>
                  <span className="text-[10px] text-blue-500 mt-1 block">
                    Đang nói theo thời gian thực...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* TAB 2: GB English */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-blue-600 tracking-wider">
              GB
            </span>
            <span className="font-bold text-sm text-blue-600">
              English
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isListening && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Translating live... (Say "stop" to finish)</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto relative">
          {!hasContent ? (
            /* Idle watermark placeholder */
            <div 
              onClick={onToggleListening}
              className="flex-1 flex flex-col items-center justify-center p-6 relative select-none cursor-pointer group"
              title="Click to start translating"
            >
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-slate-400/40 text-4xl sm:text-5xl font-semibold tracking-wide filter blur-[1px]"
                aria-hidden="true"
              >
                English
              </div>

              <div className="z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/60 shadow-2xs group-hover:bg-blue-50 group-hover:border-blue-200 transition-all">
                <Radio className={`w-4 h-4 ${isListening ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-xs font-medium text-slate-600 group-hover:text-blue-700">
                  {isListening ? 'Translating in real-time...' : 'Click here or microphone to speak'}
                </span>
              </div>
              <span className="mt-3 text-[11px] text-slate-400 z-10">
                Say "stop" at any time to automatically end
              </span>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {translations.map((item) => (
                <div
                  key={`en-${item.id}`}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between group transition-colors"
                >
                  <p className="text-sm font-medium text-slate-900 leading-relaxed">
                    {item.en}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.timestamp}</span>
                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => handleCopy(item.en, `en-${item.id}`)}
                        className="p-1 hover:text-slate-700 rounded"
                        title="Copy English translation"
                      >
                        {copiedId === `en-${item.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => onSpeak(item.en, 'en-US')}
                        className="p-1 hover:text-blue-600 rounded"
                        title="Play English audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Interim Real-time Translating Text */}
              {interimEn && (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 animate-pulse">
                  <p className="text-sm font-medium text-emerald-900 leading-relaxed italic">
                    {interimEn}...
                  </p>
                  <span className="text-[10px] text-emerald-600 mt-1 block">
                    Translating live in real-time...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
