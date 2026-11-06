import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { VoicePanel, TranslationItem } from './components/VoicePanel';
import { instantTranslate, refinedTranslate, isStartCommand, isStopCommand } from './services/bilingualEngine';
import { speakText } from './services/capabilities';

export default function App() {
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [interimVi, setInterimVi] = useState('');
  const [interimEn, setInterimEn] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isStoppingRef = useRef(false);

  // Initialize Speech Recognition
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ Web Speech API. Vui lòng sử dụng Google Chrome hoặc Microsoft Edge.');
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN'; // Handles both Vietnamese and standard phonetics
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        isStoppingRef.current = false;
      };

      recognition.onresult = async (event: any) => {
        let currentFinal = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';

          if (item.isFinal) {
            currentFinal += text + ' ';
          } else {
            currentInterim += text;
          }
        }

        const rawCombined = (currentFinal + currentInterim).trim();

        // 1. VOICE COMMAND TO STOP: "kết thúc" / "stop" / "dừng lại"
        if (isStopCommand(rawCombined) || isStopCommand(currentInterim) || isStopCommand(currentFinal)) {
          stopTranslation();
          return;
        }

        // 2. VOICE COMMAND TO START: "bắt đầu" / "start"
        if (isStartCommand(rawCombined) || isStartCommand(currentFinal)) {
          setInterimVi('');
          setInterimEn('');
          return;
        }

        // 3. LIVE TRANSLATION (SUB-5MS) AS USER IS SPEAKING
        if (currentInterim.trim() && !isStoppingRef.current) {
          const live = instantTranslate(currentInterim.trim());
          setInterimVi(live.vi);
          setInterimEn(live.en);
        }

        // 4. ON COMPLETED PHRASE
        if (currentFinal.trim() && !isStoppingRef.current) {
          const cleanFinal = currentFinal.trim();
          if (!isStopCommand(cleanFinal) && !isStartCommand(cleanFinal)) {
            await handleProcessTranslation(cleanFinal);
          }
          setInterimVi('');
          setInterimEn('');
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'no-speech' || event.error === 'aborted') return;
        console.warn('Speech recognition warning:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening && !isStoppingRef.current) {
          try {
            recognition.start();
          } catch {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Could not start recognition:', err);
      setIsListening(false);
    }
  };

  const stopTranslation = () => {
    isStoppingRef.current = true;
    setIsListening(false);
    setInterimVi('');
    setInterimEn('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopTranslation();
    } else {
      startSpeechRecognition();
    }
  };

  // Process text and translate across both tabs immediately
  const handleProcessTranslation = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (isStopCommand(trimmed)) {
      stopTranslation();
      return;
    }
    if (isStartCommand(trimmed)) {
      return;
    }

    // 1. Instant translation immediately to UI without lag
    const instant = instantTranslate(trimmed);
    const newId = `trans-${Date.now()}`;
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setTranslations(prev => [
      ...prev,
      {
        id: newId,
        vi: instant.vi,
        en: instant.en,
        timestamp: timeStr
      }
    ]);

    // 2. Play speech audio (if user spoke Vietnamese -> speak English; if user spoke English -> speak Vietnamese)
    if (instant.detectedLang === 'vi') {
      handleSpeak(instant.en, 'en-US');
    } else {
      handleSpeak(instant.vi, 'vi-VN');
    }

    // 3. Background asynchronous refinement
    refinedTranslate(trimmed).then(refined => {
      if (refined.vi !== instant.vi || refined.en !== instant.en) {
        setTranslations(prev => prev.map(t => {
          if (t.id === newId) {
            return {
              ...t,
              vi: refined.vi,
              en: refined.en
            };
          }
          return t;
        }));
      }
    });
  };

  const handleSpeak = (text: string, lang: 'vi-VN' | 'en-US') => {
    setIsSpeaking(true);
    speakText(text, lang);
    setTimeout(() => {
      setIsSpeaking(false);
    }, Math.max(1200, text.length * 60));
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-blue-100">
      {/* Top Header with small mic button */}
      <Header
        isListening={isListening}
        onToggleListening={toggleListening}
      />

      {/* Main Dual Cards: VN Tiếng Việt & GB English */}
      <main className="flex-1 flex flex-col justify-center my-auto py-4">
        <VoicePanel
          translations={translations}
          interimVi={interimVi}
          interimEn={interimEn}
          isListening={isListening}
          isSpeaking={isSpeaking}
          onSpeak={handleSpeak}
          onToggleListening={toggleListening}
        />
      </main>

      {/* Footer hint */}
      <footer className="py-3 text-center text-xs text-slate-400 select-none">
        <span>Nói </span>
        <strong className="text-slate-600 font-semibold">"bắt đầu"</strong>
        <span> hoặc bấm nút mic để dịch · Nói </span>
        <strong className="text-slate-600 font-semibold">"kết thúc"</strong>
        <span> để dừng dịch</span>
      </footer>
    </div>
  );
}
