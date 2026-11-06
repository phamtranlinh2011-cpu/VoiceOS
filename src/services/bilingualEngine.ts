/**
 * High-performance instant bidirectional translator (Vietnamese <-> English).
 * Translates instantaneously (sub-5ms) as the user speaks.
 */

// Phrase & Idiom dictionary (longest matches first)
const PHRASES_VI_TO_EN: [RegExp, string][] = [
  // Greetings & Courtesies
  [/\bxin chào tất cả mọi người\b/gi, 'hello everyone'],
  [/\bxin chào các bạn\b/gi, 'hello guys'],
  [/\bxin chào bạn\b/gi, 'hello friend'],
  [/\bxin chào\b/gi, 'hello'],
  [/\bchào buổi sáng\b/gi, 'good morning'],
  [/\bchào buổi chiều\b/gi, 'good afternoon'],
  [/\bchào buổi tối\b/gi, 'good evening'],
  [/\bchúc ngủ ngon\b/gi, 'good night'],
  [/\btạm biệt hẹn gặp lại\b/gi, 'goodbye, see you again'],
  [/\bhẹn gặp lại\b/gi, 'see you again'],
  [/\btạm biệt\b/gi, 'goodbye'],
  [/\bcảm ơn bạn rất nhiều\b/gi, 'thank you very much'],
  [/\bcảm ơn nhiều\b/gi, 'thanks a lot'],
  [/\bcảm ơn bạn\b/gi, 'thank you'],
  [/\bcảm ơn\b/gi, 'thank you'],
  [/\bkhông có chi\b/gi, "you're welcome"],
  [/\bkhông có gì\b/gi, "you're welcome"],
  [/\bxin lỗi\b/gi, 'sorry'],
  [/\blàm ơn\b/gi, 'please'],

  // Questions
  [/\bbạn tên là gì\b/gi, 'what is your name'],
  [/\bbạn tên gì\b/gi, 'what is your name'],
  [/\bbạn khỏe không\b/gi, 'how are you'],
  [/\bbạn có khỏe không\b/gi, 'are you doing well'],
  [/\bbạn đang làm gì đấy\b/gi, 'what are you doing'],
  [/\bbạn đang làm gì thế\b/gi, 'what are you doing'],
  [/\bbạn đang làm gì\b/gi, 'what are you doing'],
  [/\bbạn đến từ đâu\b/gi, 'where are you from'],
  [/\bbạn từ đâu đến\b/gi, 'where do you come from'],
  [/\bmấy giờ rồi\b/gi, 'what time is it'],
  [/\bbao nhiêu tiền\b/gi, 'how much does it cost'],
  [/\bgọi món gì\b/gi, 'what to order'],
  [/\bở đâu\b/gi, 'where'],
  [/\btại sao\b/gi, 'why'],
  [/\bnhư thế nào\b/gi, 'how'],
  [/\bkhi nào\b/gi, 'when'],
  [/\bcái gì\b/gi, 'what'],
  [/\blà ai\b/gi, 'who is'],
  [/\bai đó\b/gi, 'who is there'],

  // Personal expressions
  [/\btôi tên là\b/gi, 'my name is'],
  [/\btôi là người việt nam\b/gi, 'i am vietnamese'],
  [/\btôi là người việt\b/gi, 'i am vietnamese'],
  [/\btôi rất vui\b/gi, 'i am very happy'],
  [/\btôi thích cái này\b/gi, 'i like this'],
  [/\btôi không thích\b/gi, 'i do not like it'],
  [/\btôi yêu bạn\b/gi, 'i love you'],
  [/\btôi nhớ bạn\b/gi, 'i miss you'],
  [/\btôi đói bụng\b/gi, 'i am hungry'],
  [/\btôi đói rồi\b/gi, 'i am hungry'],
  [/\btôi khát nước\b/gi, 'i am thirsty'],
  [/\btôi mệt quá\b/gi, 'i am so tired'],
  [/\btôi mệt\b/gi, 'i am tired'],
  [/\btôi hiểu rồi\b/gi, 'i understand'],
  [/\btôi không hiểu\b/gi, 'i do not understand'],
  [/\btôi biết rồi\b/gi, 'i got it'],
  [/\btôi không biết\b/gi, 'i do not know'],
  [/\bgiúp tôi với\b/gi, 'help me please'],
  [/\bgiúp tôi\b/gi, 'help me'],
  [/\bchúc mừng sinh nhật\b/gi, 'happy birthday'],
  [/\bchúc mừng năm mới\b/gi, 'happy new year'],
  [/\bchúc mừng bạn\b/gi, 'congratulations to you'],
  [/\bchúc mừng\b/gi, 'congratulations'],

  // Everyday actions & statements
  [/\bhôm nay trời đẹp quá\b/gi, 'the weather is so nice today'],
  [/\bhôm nay trời đẹp\b/gi, 'the weather is nice today'],
  [/\bhôm nay trời mưa\b/gi, 'it is raining today'],
  [/\bhôm nay trời nắng\b/gi, 'it is sunny today'],
  [/\bngày mai tôi bận\b/gi, 'i am busy tomorrow'],
  [/\bngày mai\b/gi, 'tomorrow'],
  [/\bhôm nay\b/gi, 'today'],
  [/\bhôm qua\b/gi, 'yesterday'],
  [/\bbây giờ\b/gi, 'right now'],
  [/\bchúng ta đi thôi\b/gi, "let's go"],
  [/\bđi ăn cơm\b/gi, 'go eat'],
  [/\buống cà phê\b/gi, 'drink coffee'],
  [/\buống nước\b/gi, 'drink water'],
  [/\blàm việc thôi\b/gi, "let's get to work"],
  [/\blàm việc\b/gi, 'work'],
  [/\bnghỉ ngơi\b/gi, 'take a rest'],
  [/\bvề nhà\b/gi, 'go home'],
  [/\bđến công ty\b/gi, 'go to the office'],
  [/\brất tốt\b/gi, 'very good'],
  [/\brất đẹp\b/gi, 'very beautiful'],
  [/\brất ngon\b/gi, 'very delicious'],
  [/\bngon quá\b/gi, 'so delicious'],
  [/\btuyệt vời\b/gi, 'wonderful'],
  [/\bchính xác\b/gi, 'exactly'],
  [/\bđúng rồi\b/gi, "that's right"],
  [/\bchuẩn luôn\b/gi, 'absolutely'],
  [/\bkhông đúng\b/gi, 'not correct'],
  [/\bđừng lo\b/gi, "don't worry"],
  [/\bkhông sao đâu\b/gi, "it's okay"],
  [/\bkhông sao\b/gi, "no problem"],
];

const PHRASES_EN_TO_VI: [RegExp, string][] = [
  // Greetings & Courtesies
  [/\bhello everyone\b/gi, 'xin chào mọi người'],
  [/\bhello guys\b/gi, 'chào các bạn'],
  [/\bhello my friend\b/gi, 'chào bạn của tôi'],
  [/\bhello\b/gi, 'xin chào'],
  [/\bhi there\b/gi, 'chào bạn'],
  [/\bhi\b/gi, 'chào'],
  [/\bgood morning\b/gi, 'chào buổi sáng'],
  [/\bgood afternoon\b/gi, 'chào buổi chiều'],
  [/\bgood evening\b/gi, 'chào buổi tối'],
  [/\bgood night\b/gi, 'chúc ngủ ngon'],
  [/\bsee you again\b/gi, 'hẹn gặp lại'],
  [/\bsee you later\b/gi, 'hẹn gặp lại sau'],
  [/\bgoodbye\b/gi, 'tạm biệt'],
  [/\bbye bye\b/gi, 'tạm biệt'],
  [/\bbye\b/gi, 'tạm biệt'],
  [/\bthank you very much\b/gi, 'cảm ơn bạn rất nhiều'],
  [/\bthank you so much\b/gi, 'cảm ơn bạn rất nhiều'],
  [/\bthank you\b/gi, 'cảm ơn bạn'],
  [/\bthanks a lot\b/gi, 'cảm ơn nhiều'],
  [/\bthanks\b/gi, 'cảm ơn'],
  [/\byou are welcome\b/gi, 'không có gì'],
  [/\byou're welcome\b/gi, 'không có gì'],
  [/\bi am sorry\b/gi, 'tôi xin lỗi'],
  [/\bsorry\b/gi, 'xin lỗi'],
  [/\bplease\b/gi, 'làm ơn'],

  // Questions
  [/\bwhat is your name\b/gi, 'bạn tên là gì?'],
  [/\bwhat's your name\b/gi, 'bạn tên là gì?'],
  [/\bhow are you doing\b/gi, 'bạn dạo này thế nào?'],
  [/\bhow are you\b/gi, 'bạn khỏe không?'],
  [/\bwhat are you doing\b/gi, 'bạn đang làm gì đấy?'],
  [/\bwhere are you from\b/gi, 'bạn đến từ đâu?'],
  [/\bwhere do you come from\b/gi, 'bạn đến từ đâu?'],
  [/\bwhat time is it\b/gi, 'mấy giờ rồi?'],
  [/\bhow much is it\b/gi, 'cái này bao nhiêu tiền?'],
  [/\bhow much does it cost\b/gi, 'giá bao nhiêu tiền?'],
  [/\bhow much\b/gi, 'bao nhiêu tiền?'],
  [/\bwhere is\b/gi, 'ở đâu?'],
  [/\bwhere are\b/gi, 'ở đâu?'],
  [/\bwhy\b/gi, 'tại sao'],
  [/\bhow\b/gi, 'làm sao'],
  [/\bwhen\b/gi, 'khi nào'],
  [/\bwhat\b/gi, 'cái gì'],
  [/\bwho\b/gi, 'ai'],

  // Personal expressions
  [/\bmy name is\b/gi, 'tôi tên là'],
  [/\bi am from vietnam\b/gi, 'tôi đến từ việt nam'],
  [/\bi am vietnamese\b/gi, 'tôi là người việt nam'],
  [/\bi am so happy\b/gi, 'tôi rất vui'],
  [/\bi am happy\b/gi, 'tôi vui vẻ'],
  [/\bi like this\b/gi, 'tôi thích cái này'],
  [/\bi don't like it\b/gi, 'tôi không thích cái này'],
  [/\bi love you\b/gi, 'tôi yêu bạn'],
  [/\bi miss you\b/gi, 'tôi nhớ bạn'],
  [/\bi am hungry\b/gi, 'tôi đang đói bụng'],
  [/\bi am thirsty\b/gi, 'tôi đang khát nước'],
  [/\bi am tired\b/gi, 'tôi mệt rồi'],
  [/\bi understand\b/gi, 'tôi hiểu rồi'],
  [/\bi don't understand\b/gi, 'tôi không hiểu'],
  [/\bi know\b/gi, 'tôi biết rồi'],
  [/\bi don't know\b/gi, 'tôi không biết'],
  [/\bhelp me\b/gi, 'giúp tôi với'],
  [/\bhappy birthday\b/gi, 'chúc mừng sinh nhật'],
  [/\bhappy new year\b/gi, 'chúc mừng năm mới'],
  [/\bcongratulations\b/gi, 'chúc mừng'],

  // Everyday actions & statements
  [/\bthe weather is nice today\b/gi, 'hôm nay thời tiết đẹp quá'],
  [/\bit is raining\b/gi, 'trời đang mưa'],
  [/\bit is sunny\b/gi, 'trời đang nắng'],
  [/\bi am busy\b/gi, 'tôi đang bận'],
  [/\btomorrow\b/gi, 'ngày mai'],
  [/\btoday\b/gi, 'hôm nay'],
  [/\byesterday\b/gi, 'hôm qua'],
  [/\bright now\b/gi, 'ngay bây giờ'],
  [/\bnow\b/gi, 'bây giờ'],
  [/\blet's go\b/gi, 'đi thôi'],
  [/\blet us go\b/gi, 'chúng ta đi thôi'],
  [/\bvery good\b/gi, 'rất tốt'],
  [/\bvery well\b/gi, 'rất tốt'],
  [/\bbeautiful\b/gi, 'xinh đẹp'],
  [/\bdelicious\b/gi, 'ngon miệng'],
  [/\bwonderful\b/gi, 'tuyệt vời'],
  [/\bawesome\b/gi, 'tuyệt đỉnh'],
  [/\bexactly\b/gi, 'chính xác'],
  [/\bthat's right\b/gi, 'đúng rồi'],
  [/\bno problem\b/gi, 'không có vấn đề gì'],
  [/\bdon't worry\b/gi, 'đừng lo lắng'],
  [/\bit is okay\b/gi, 'mọi thứ ổn thôi']
];

// Single word maps
const WORD_MAP_VI_TO_EN: Record<string, string> = {
  'tôi': 'i',
  'bạn': 'you',
  'anh': 'you',
  'chị': 'you',
  'em': 'you',
  'họ': 'they',
  'chúng ta': 'we',
  'chúng tôi': 'we',
  'nó': 'it',
  'này': 'this',
  'kia': 'that',
  'đó': 'that',
  'ở': 'at',
  'trong': 'in',
  'trên': 'on',
  'với': 'with',
  'và': 'and',
  'hoặc': 'or',
  'nhưng': 'but',
  'vì': 'because',
  'nếu': 'if',
  'thì': 'then',
  'có': 'have',
  'là': 'is',
  'được': 'can',
  'không': 'no',
  'rất': 'very',
  'quá': 'too',
  'nhiều': 'much',
  'ít': 'little',
  'lớn': 'big',
  'nhỏ': 'small',
  'nhanh': 'fast',
  'chậm': 'slow',
  'tốt': 'good',
  'xấu': 'bad',
  'đẹp': 'pretty',
  'mới': 'new',
  'cũ': 'old',
  'nói': 'speak',
  'nghe': 'listen',
  'thấy': 'see',
  'làm': 'do',
  'đi': 'go',
  'đến': 'come',
  'ăn': 'eat',
  'uống': 'drink',
  'ngủ': 'sleep',
  'học': 'learn',
  'yêu': 'love',
  'thích': 'like',
  'muốn': 'want',
  'cần': 'need',
  'tiền': 'money',
  'nhà': 'house',
  'xe': 'car',
  'nước': 'water',
  'cơm': 'rice',
  'bánh': 'cake',
  'sách': 'book',
  'bút': 'pen',
  'điện thoại': 'phone',
  'máy tính': 'computer',
  'ngày': 'day',
  'đêm': 'night',
  'tháng': 'month',
  'năm': 'year',
  'giờ': 'hour',
  'phút': 'minute',
  'giây': 'second'
};

const WORD_MAP_EN_TO_VI: Record<string, string> = {
  'i': 'tôi',
  'you': 'bạn',
  'he': 'anh ấy',
  'she': 'cô ấy',
  'they': 'họ',
  'we': 'chúng ta',
  'it': 'nó',
  'this': 'cái này',
  'that': 'cái kia',
  'is': 'là',
  'are': 'là',
  'am': 'là',
  'was': 'đã là',
  'were': 'đã là',
  'have': 'có',
  'has': 'có',
  'had': 'đã có',
  'do': 'làm',
  'does': 'làm',
  'did': 'đã làm',
  'can': 'có thể',
  'will': 'sẽ',
  'would': 'sẽ',
  'should': 'nên',
  'must': 'phải',
  'good': 'tốt',
  'great': 'tuyệt',
  'bad': 'xấu',
  'big': 'to',
  'small': 'nhỏ',
  'fast': 'nhanh',
  'slow': 'chậm',
  'new': 'mới',
  'old': 'cũ',
  'hot': 'nóng',
  'cold': 'lạnh',
  'happy': 'hạnh phúc',
  'sad': 'buồn',
  'love': 'yêu',
  'like': 'thích',
  'want': 'muốn',
  'need': 'cần',
  'see': 'thấy',
  'hear': 'nghe',
  'speak': 'nói',
  'talk': 'nói chuyện',
  'go': 'đi',
  'come': 'đến',
  'eat': 'ăn',
  'drink': 'uống',
  'sleep': 'ngủ',
  'work': 'làm việc',
  'learn': 'học',
  'study': 'học tập',
  'water': 'nước',
  'food': 'đồ ăn',
  'car': 'xe hơi',
  'house': 'ngôi nhà',
  'phone': 'điện thoại',
  'computer': 'máy tính',
  'book': 'quyển sách',
  'money': 'tiền',
  'time': 'thời gian',
  'day': 'ngày',
  'night': 'đêm',
  'year': 'năm',
  'month': 'tháng',
  'today': 'hôm nay',
  'tomorrow': 'ngày mai',
  'yesterday': 'hôm qua',
  'yes': 'vâng',
  'no': 'không'
};

export function isStartCommand(text: string): boolean {
  if (!text) return false;
  const clean = text.trim().toLowerCase().replace(/[.,!?;:]/g, '');
  const startWords = [
    'bắt đầu',
    'bắt đầu dịch',
    'bắt đầu đi',
    'bắt đầu nào',
    'start',
    'start translating',
    'begin'
  ];
  return startWords.some(w => clean === w || clean.endsWith(' ' + w) || clean.startsWith(w + ' '));
}

export function isStopCommand(text: string): boolean {
  if (!text) return false;
  const clean = text.trim().toLowerCase().replace(/[.,!?;:]/g, '');
  const stopWords = [
    'kết thúc',
    'kết thúc dịch',
    'kết thúc đi',
    'kết thúc nào',
    'stop',
    'stop it',
    'stop please',
    'please stop',
    'dừng',
    'dừng lại',
    'dừng lại đi',
    'ngừng',
    'ngừng lại',
    'dừng dịch',
    'tắt',
    'pause',
    'end'
  ];
  return stopWords.some(w => clean === w || clean.endsWith(' ' + w) || clean.startsWith(w + ' '));
}

export function detectLanguage(text: string): 'vi' | 'en' {
  if (!text) return 'vi';
  
  // 1. Any Vietnamese diacritics -> definite Vietnamese
  const viDiacritics = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  if (viDiacritics.test(text)) return 'vi';

  // 2. Count common Vietnamese non-diacritic words
  const viWords = ['toi', 'ban', 'chung', 'ta', 'la', 'co', 'trong', 'nguoi', 'khong', 'duoc', 'nay', 'cho', 'voi', 'khi', 'da', 'noi', 'di', 'an', 'uong', 'nha', 'tien'];
  const enWords = ['i', 'you', 'he', 'she', 'they', 'we', 'it', 'this', 'that', 'is', 'are', 'am', 'was', 'were', 'have', 'has', 'do', 'does', 'did', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'from', 'hello', 'hi', 'how', 'what', 'where', 'when', 'why', 'who'];

  const lower = text.toLowerCase();
  const tokens = lower.split(/[\s,?.!]+/).filter(Boolean);

  let viScore = 0;
  let enScore = 0;

  for (const t of tokens) {
    if (viWords.includes(t)) viScore++;
    if (enWords.includes(t)) enScore += 1.5;
  }

  if (enScore > viScore) return 'en';
  if (viScore > enScore) return 'vi';

  // Default heuristic based on character set
  return 'vi';
}

/**
 * Instant synchronous translation (sub-1ms) for real-time live typing / speaking
 */
export function instantTranslate(text: string): { vi: string; en: string; detectedLang: 'vi' | 'en' } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { vi: '', en: '', detectedLang: 'vi' };
  }

  const detected = detectLanguage(trimmed);

  if (detected === 'vi') {
    // Translate Vietnamese -> English
    let translated = trimmed;

    // 1. Apply multi-word phrase replacements
    for (const [regex, replacement] of PHRASES_VI_TO_EN) {
      translated = translated.replace(regex, replacement);
    }

    // 2. Word by word replacement for remaining words
    const words = translated.split(' ');
    const translatedWords = words.map(w => {
      const lower = w.toLowerCase().replace(/[.,!?;:]/g, '');
      if (WORD_MAP_VI_TO_EN[lower]) {
        return WORD_MAP_VI_TO_EN[lower];
      }
      return w;
    });

    let enResult = translatedWords.join(' ');
    // Capitalize first letter
    enResult = enResult.charAt(0).toUpperCase() + enResult.slice(1);

    return {
      vi: trimmed,
      en: enResult,
      detectedLang: 'vi'
    };
  } else {
    // Translate English -> Vietnamese
    let translated = trimmed;

    // 1. Apply multi-word phrase replacements
    for (const [regex, replacement] of PHRASES_EN_TO_VI) {
      translated = translated.replace(regex, replacement);
    }

    // 2. Word by word replacement for remaining words
    const words = translated.split(' ');
    const translatedWords = words.map(w => {
      const lower = w.toLowerCase().replace(/[.,!?;:]/g, '');
      if (WORD_MAP_EN_TO_VI[lower]) {
        return WORD_MAP_EN_TO_VI[lower];
      }
      return w;
    });

    let viResult = translatedWords.join(' ');
    // Capitalize first letter
    viResult = viResult.charAt(0).toUpperCase() + viResult.slice(1);

    return {
      vi: viResult,
      en: trimmed,
      detectedLang: 'en'
    };
  }
}

/**
 * Asynchronous refined translation that leverages online service if available,
 * falling back seamlessly to instantTranslate.
 */
export async function refinedTranslate(text: string): Promise<{ vi: string; en: string; detectedLang: 'vi' | 'en' }> {
  const base = instantTranslate(text);
  if (!text.trim()) return base;

  const detected = base.detectedLang;
  const sourceLang = detected === 'vi' ? 'vi' : 'en';
  const targetLang = detected === 'vi' ? 'en' : 'vi';

  try {
    const pair = `${sourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=${pair}`;
    
    let controller: AbortController | null = null;
    let timeoutId: any = null;
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller?.abort(), 3000);
    }
    
    const response = await fetch(url, controller ? { signal: controller.signal } : {});
    if (timeoutId) clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const translated = data?.responseData?.translatedText;
      if (translated && !translated.includes('MYMEMORY WARNING') && translated.toLowerCase() !== text.toLowerCase()) {
        if (detected === 'vi') {
          return { vi: text.trim(), en: translated, detectedLang: 'vi' };
        } else {
          return { vi: translated, en: text.trim(), detectedLang: 'en' };
        }
      }
    }
  } catch {
    // Return base instant translation on any network hiccup
  }

  return base;
}
