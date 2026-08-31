// Real-time Chat & Operator Sync Service for โต๊ะจีน รพีพัฒน์
export interface LiveMessage {
  id: string;
  sessionId: string;
  sender: 'customer' | 'owner' | 'bot' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  createdAt: number;
}

export interface ChatSession {
  id: string;
  customerName: string;
  customerPhone?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadByOwner: number;
  unreadByCustomer: number;
  updatedAt: number;
  messages: LiveMessage[];
}

const STORAGE_KEY_SESSIONS = 'rapeephat_chat_sessions_v1';
const STORAGE_KEY_OPERATOR = 'rapeephat_operator_online_status';
const CURRENT_SESSION_KEY = 'rapeephat_current_customer_session_id';

class ChatSyncEngine {
  private channel: BroadcastChannel | null = null;
  private listeners: Array<(event: { type: string; payload: any }) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('rapeephat_live_chat_bus');
        this.channel.onmessage = (e) => {
          this.notifyListeners(e.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_SESSIONS || e.key === STORAGE_KEY_OPERATOR) {
          this.notifyListeners({
            type: 'STORAGE_UPDATE',
            payload: { key: e.key, value: e.newValue },
          });
        }
      });
    }
  }

  public subscribe(callback: (event: { type: string; payload: any }) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(data: any) {
    this.listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error('Error in chat listener:', err);
      }
    });
  }

  public broadcast(type: string, payload: any) {
    const data = { type, payload, timestamp: Date.now() };
    if (this.channel) {
      try {
        this.channel.postMessage(data);
      } catch {}
    }
    this.notifyListeners(data);
  }

  // Play crisp, pleasant notification sound using Web Audio API
  public playChime(type: 'incoming' | 'outgoing' = 'incoming') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'incoming') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440.0, ctx.currentTime); // A4
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      // Audio context might be locked before user interaction
    }
  }

  // Operator presence
  public setOperatorOnline(isOnline: boolean) {
    try {
      const status = {
        isOnline,
        updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY_OPERATOR, JSON.stringify(status));
      this.broadcast('OPERATOR_PRESENCE', status);
    } catch {}
  }

  public isOperatorOnline(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_OPERATOR);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      // Operator considered online if updated within last 2 minutes
      return parsed.isOnline && Date.now() - (parsed.updatedAt || 0) < 120000;
    } catch {
      return false;
    }
  }

  // Get or Create Customer Session ID
  public getOrCreateCustomerSessionId(): string {
    try {
      let id = localStorage.getItem(CURRENT_SESSION_KEY);
      if (!id) {
        id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        localStorage.setItem(CURRENT_SESSION_KEY, id);
      }
      return id;
    } catch {
      return 'session_default';
    }
  }

  // Session storage management
  public getAllSessions(): ChatSession[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public getSession(sessionId: string): ChatSession | undefined {
    const sessions = this.getAllSessions();
    return sessions.find((s) => s.id === sessionId);
  }

  public saveMessage(msg: LiveMessage) {
    const sessions = this.getAllSessions();
    let session = sessions.find((s) => s.id === msg.sessionId);

    if (!session) {
      session = {
        id: msg.sessionId,
        customerName: msg.sender === 'customer' ? msg.senderName || 'ลูกค้าทั่วไป' : 'ลูกค้าทั่วไป',
        lastMessage: msg.text,
        lastMessageTime: msg.timestamp,
        unreadByOwner: msg.sender === 'customer' ? 1 : 0,
        unreadByCustomer: msg.sender === 'owner' ? 1 : 0,
        updatedAt: Date.now(),
        messages: [msg],
      };
      sessions.unshift(session);
    } else {
      session.messages.push(msg);
      session.lastMessage = msg.text;
      session.lastMessageTime = msg.timestamp;
      session.updatedAt = Date.now();
      if (msg.sender === 'customer') {
        session.unreadByOwner = (session.unreadByOwner || 0) + 1;
      } else if (msg.sender === 'owner') {
        session.unreadByCustomer = (session.unreadByCustomer || 0) + 1;
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch {}

    this.broadcast('NEW_MESSAGE', { message: msg, session });
    this.playChime(msg.sender === 'owner' ? 'outgoing' : 'incoming');
  }

  public markAsReadByOwner(sessionId: string) {
    const sessions = this.getAllSessions();
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      session.unreadByOwner = 0;
      try {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      } catch {}
      this.broadcast('SESSION_READ', { sessionId, reader: 'owner' });
    }
  }

  public markAsReadByCustomer(sessionId: string) {
    const sessions = this.getAllSessions();
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      session.unreadByCustomer = 0;
      try {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      } catch {}
      this.broadcast('SESSION_READ', { sessionId, reader: 'customer' });
    }
  }
}

export const chatSync = new ChatSyncEngine();
