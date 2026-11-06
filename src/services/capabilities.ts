/**
 * Runtime implementations of capabilities defined in the user's files:
 * Db.ts, Files.ts, User.ts, Artifact.ts, Comments.ts, Downloads.ts, Mcp.ts, room.ts, Sample.ts
 */

export interface SystemFile {
  name: string;
  path: string;
  size: number;
  type: string;
  description: string;
}

export const CAPABILITY_FILES: SystemFile[] = [
  { name: 'Db.ts', path: '/Db.ts', size: 30379, type: 'typescript', description: 'Persistent realtime document store capability' },
  { name: 'Files.ts', path: '/Files.ts', size: 7005, type: 'typescript', description: 'Project file listing, reading, and downloading' },
  { name: 'User.ts', path: '/User.ts', size: 15508, type: 'typescript', description: 'Viewer identity, roles, and user directory search' },
  { name: 'Artifact.ts', path: '/Artifact.ts', size: 33596, type: 'typescript', description: 'Artifact publish, live docs, and sync capability' },
  { name: 'Comments.ts', path: '/Comments.ts', size: 38667, type: 'typescript', description: 'Threaded commentary and review capability' },
  { name: 'Downloads.ts', path: '/Downloads.ts', size: 6062, type: 'typescript', description: 'Safe client-side download dispatch capability' },
  { name: 'Mcp.ts', path: '/Mcp.ts', size: 41615, type: 'typescript', description: 'Model Context Protocol connector capability' },
  { name: 'room.ts', path: '/room.ts', size: 35572, type: 'typescript', description: 'Ephemeral multi-viewer presence and real-time room' },
  { name: 'Self.ts', path: '/Self.ts', size: 661, type: 'typescript', description: 'Artifact capability alias legacy resolver' },
];

// Document Store (Db capability)
export interface DbRecord {
  id: string;
  collection: string;
  data: Record<string, any>;
  updatedAt: number;
}

class LocalDbStore {
  private records: Map<string, DbRecord> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('voiceos_db_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.forEach((rec: DbRecord) => {
          this.records.set(`${rec.collection}/${rec.id}`, rec);
        });
      } else {
        // Seed initial records
        this.setDoc('system', 'voiceos_config', {
          version: '1.0.0',
          appName: 'VoiceOS gigme',
          channels: ['VN', 'GB'],
          defaultLanguage: 'vi-VN',
          autoVoice: true,
        });
        this.setDoc('logs', 'startup', {
          event: 'VoiceOS Initialized',
          timestamp: new Date().toISOString(),
          status: 'ready'
        });
      }
    } catch (e) {
      console.warn('Failed to load local DB', e);
    }
  }

  private saveToStorage() {
    try {
      const array = Array.from(this.records.values());
      localStorage.setItem('voiceos_db_store', JSON.stringify(array));
      this.listeners.forEach(fn => fn());
    } catch (e) {
      console.error('Failed to save DB', e);
    }
  }

  public setDoc(collection: string, id: string, data: Record<string, any>) {
    const key = `${collection}/${id}`;
    this.records.set(key, {
      id,
      collection,
      data,
      updatedAt: Date.now()
    });
    this.saveToStorage();
  }

  public getDoc(collection: string, id: string): Record<string, any> | null {
    const key = `${collection}/${id}`;
    return this.records.get(key)?.data || null;
  }

  public listCollection(collection: string): DbRecord[] {
    return Array.from(this.records.values()).filter(r => r.collection === collection);
  }

  public getAllRecords(): DbRecord[] {
    return Array.from(this.records.values());
  }

  public subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const dbService = new LocalDbStore();

// User capability
export const currentViewer = {
  id: 'u_user_voiceos_owner',
  name: 'Đặng Tuấn',
  email: 'dangvatuan90@gmail.com',
  isOwner: true,
  canEdit: true,
  color: '#2563eb',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=VoiceOS'
};

// Text-to-Speech (SpeechSynthesis)
export function speakText(text: string, lang: 'vi-VN' | 'en-US' = 'vi-VN') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick appropriate voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(lang.slice(0, 2)));
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}
