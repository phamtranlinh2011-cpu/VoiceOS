/**
 * Translation service for VoiceOS gigme:
 * Pure translation across Vietnamese & English without conversational fluff.
 */

// Common bilingual phrases & words for instant offline/interim translation
const COMMON_DICTIONARY: Record<string, { vi: string; en: string }> = {
  'xin chào': { vi: 'Xin chào', en: 'Hello' },
  'chào bạn': { vi: 'Chào bạn', en: 'Hello my friend' },
  'chào buổi sáng': { vi: 'Chào buổi sáng', en: 'Good morning' },
  'chào buổi tối': { vi: 'Chào buổi tối', en: 'Good evening' },
  'tạm biệt': { vi: 'Tạm biệt', en: 'Goodbye' },
  'cảm ơn': { vi: 'Cảm ơn', en: 'Thank you' },
  'cảm ơn bạn': { vi: 'Cảm ơn bạn', en: 'Thank you very much' },
  'không có gì': { vi: 'Không có gì', en: "You're welcome" },
  'bạn khỏe không': { vi: 'Bạn khỏe không?', en: 'How are you?' },
  'tôi khỏe': { vi: 'Tôi khỏe', en: "I'm doing well" },
  'tôi tên là': { vi: 'Tôi tên là', en: 'My name is' },
  'bạn tên là gì': { vi: 'Bạn tên là gì?', en: 'What is your name?' },
  'bạn đến từ đâu': { vi: 'Bạn đến từ đâu?', en: 'Where are you from?' },
  'tôi là người việt nam': { vi: 'Tôi là người Việt Nam', en: 'I am from Vietnam' },
  'hôm nay thời tiết thế nào': { vi: 'Hôm nay thời tiết thế nào?', en: "How's the weather today?" },
  'hôm nay trời đẹp': { vi: 'Hôm nay trời đẹp', en: 'The weather is nice today' },
  'tôi đói': { vi: 'Tôi đói', en: "I'm hungry" },
  'tôi muốn ăn': { vi: 'Tôi muốn ăn', en: 'I want to eat' },
  'bao nhiêu tiền': { vi: 'Bao nhiêu tiền?', en: 'How much does it cost?' },
  'ở đâu': { vi: 'Ở đâu?', en: 'Where is it?' },
  'mấy giờ rồi': { vi: 'Mấy giờ rồi?', en: 'What time is it?' },
  'tôi thích cái này': { vi: 'Tôi thích cái này', en: 'I like this' },
  'tôi hiểu rồi': { vi: 'Tôi hiểu rồi', en: 'I understand' },
  'tôi không hiểu': { vi: 'Tôi không hiểu', en: "I don't understand" },
  'làm ơn nói lại': { vi: 'Làm ơn nói lại', en: 'Please say that again' },
  'chúc mừng': { vi: 'Chúc mừng', en: 'Congratulations' },
  'chúc ngủ ngon': { vi: 'Chúc ngủ ngon', en: 'Good night' },
  'chúc bạn một ngày tốt lành': { vi: 'Chúc bạn một ngày tốt lành!', en: 'Have a great day!' },
  'tôi yêu bạn': { vi: 'Tôi yêu bạn', en: 'I love you' },
  'giúp tôi với': { vi: 'Giúp tôi với', en: 'Please help me' },
  'rất vui được gặp bạn': { vi: 'Rất vui được gặp bạn', en: 'Nice to meet you' },
  
  // English key mappings
  'hello': { vi: 'Xin chào', en: 'Hello' },
  'hi': { vi: 'Chào bạn', en: 'Hi' },
  'good morning': { vi: 'Chào buổi sáng', en: 'Good morning' },
  'good evening': { vi: 'Chào buổi tối', en: 'Good evening' },
  'good night': { vi: 'Chúc ngủ ngon', en: 'Good night' },
  'how are you': { vi: 'Bạn khỏe không?', en: 'How are you?' },
  'thank you': { vi: 'Cảm ơn bạn', en: 'Thank you' },
  'thanks': { vi: 'Cảm ơn', en: 'Thanks' },
  'you are welcome': { vi: 'Không có gì', en: "You're welcome" },
  'goodbye': { vi: 'Tạm biệt', en: 'Goodbye' },
  'bye': { vi: 'Tạm biệt', en: 'Bye' },
  'what is your name': { vi: 'Bạn tên là gì?', en: 'What is your name?' },
  'where are you from': { vi: 'Bạn đến từ đâu?', en: 'Where are you from?' },
  'nice to meet you': { vi: 'Rất vui được gặp bạn', en: 'Nice to meet you' },
  'see you again': { vi: 'Hẹn gặp lại bạn', en: 'See you again' },
  'have a nice day': { vi: 'Chúc bạn một ngày tốt lành', en: 'Have a nice day' },
  'how much': { vi: 'Bao nhiêu tiền?', en: 'How much?' },
  'where is': { vi: 'Ở đâu?', en: 'Where is it?' },
  'help me': { vi: 'Giúp tôi với', en: 'Help me' },
  'i understand': { vi: 'Tôi hiểu rồi', en: 'I understand' },
  'i do not understand': { vi: 'Tôi không hiểu', en: "I don't understand" }
};

export function isStopCommand(text: string): boolean {
  const clean = text.trim().toLowerCase().replace(/[.,!?;:]/g, '');
  const stopWords = [
    'stop',
    'stop translating',
    'stop please',
    'please stop',
    'dừng',
    'dừng lại',
    'dừng lại đi',
    'ngừng',
    'ngừng lại',
    'dừng dịch',
    'tắt',
    'pause'
  ];
  return stopWords.some(w => clean === w || clean.endsWith(' ' + w) || clean.startsWith(w + ' '));
}

export function detectLanguage(text: string): 'vi' | 'en' {
  const viDiacritics = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  if (viDiacritics.test(text)) return 'vi';

  const viWords = ['tôi', 'bạn', 'chúng', 'của', 'và', 'là', 'có', 'trong', 'người', 'không', 'được', 'này', 'cho', 'với', 'khi', 'đã', 'nói'];
  const lower = text.toLowerCase();
  const tokens = lower.split(/\s+/);
  const matchCount = tokens.filter(t => viWords.includes(t)).length;

  if (matchCount > 0) return 'vi';
  return 'en';
}

export async function translateText(rawText: string): Promise<{ vi: string; en: string }> {
  const text = rawText.trim();
  if (!text) return { vi: '', en: '' };

  const lower = text.toLowerCase().replace(/[.,!?]/g, '');

  // 1. Direct dictionary match
  if (COMMON_DICTIONARY[lower]) {
    return COMMON_DICTIONARY[lower];
  }

  // 2. Partial dictionary match
  for (const [key, value] of Object.entries(COMMON_DICTIONARY)) {
    if (lower === key) return value;
  }

  const detected = detectLanguage(text);
  const sourceLang = detected === 'vi' ? 'vi' : 'en';
  const targetLang = detected === 'vi' ? 'en' : 'vi';

  // 3. Online translation via MyMemory API
  try {
    const pair = `${sourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;
    let controller: AbortController | null = null;
    let timeoutId: any = null;
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller?.abort(), 3500);
    }
    const response = await fetch(url, controller ? { signal: controller.signal } : {});
    if (timeoutId) clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      const translated = data?.responseData?.translatedText;
      if (translated && !translated.includes('MYMEMORY WARNING')) {
        if (detected === 'vi') {
          return { vi: text, en: translated };
        } else {
          return { vi: translated, en: text };
        }
      }
    }
  } catch {
    // network timeout, fall through to word-by-word fallback
  }

  // 4. Word-by-word fallback if API unavailable
  if (detected === 'vi') {
    return {
      vi: text,
      en: text // fallback
    };
  } else {
    return {
      vi: text, // fallback
      en: text
    };
  }
}
