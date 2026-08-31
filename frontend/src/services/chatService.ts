// Cloud Real-Time Two-Way Chat Sync Engine for โต๊ะจีน รพีพัฒน์
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

const STORAGE_KEY_SESSIONS = 'rapeephat_chat_sessions_v2';
const STORAGE_KEY_OPERATOR = 'rapeephat_operator_online_status_v2';
const CURRENT_SESSION_KEY = 'rapeephat_current_customer_session_id_v2';

const TOPIC_MESSAGES = 'rapeephat_banquet_chat_messages_2026';
const TOPIC_OPERATOR = 'rapeephat_banquet_chat_operator_2026';

class ChatSyncEngine {
  private localBroadcast: BroadcastChannel | null = null;
  private listeners: Array<(event: { type: string; payload: any }) => void> = [];
  private eventSourceMessages: EventSource | null = null;
  private eventSourceOperator: EventSource | null = null;
  private operatorHeartbeatTimer: any = null;
  private processedMsgIds = new Set<string>();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.localBroadcast = new BroadcastChannel('rapeephat_live_chat_bus_v2');
        this.localBroadcast.onmessage = (e) => {
          this.notifyListeners(e.data);
        };
      } catch {}
    }

    if (typeof window !== 'undefined') {
      this.initCloudListener();
      this.fetchCloudHistory();
    }
  }

  // Connect to global SSE stream for instant cross-device delivery
  private initCloudListener() {
    try {
      // 1. Message Stream
      this.eventSourceMessages = new EventSource(`https://ntfy.sh/${TOPIC_MESSAGES}/sse`);
      this.eventSourceMessages.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'message' && data.message) {
            const parsed = JSON.parse(data.message);
            if (parsed.type === 'NEW_MESSAGE' && parsed.message) {
              this.handleIncomingCloudMessage(parsed.message);
            }
          }
        } catch {}
      };

      // 2. Operator Presence Stream
      this.eventSourceOperator = new EventSource(`https://ntfy.sh/${TOPIC_OPERATOR}/sse`);
      this.eventSourceOperator.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'message' && data.message) {
            const parsed = JSON.parse(data.message);
            if (parsed.type === 'OPERATOR_PRESENCE') {
              localStorage.setItem(STORAGE_KEY_OPERATOR, JSON.stringify(parsed));
              this.notifyListeners({ type: 'OPERATOR_PRESENCE', payload: parsed });
            }
          }
        } catch {}
      };
    } catch (err) {
      console.warn('SSE Cloud Listener init warning:', err);
    }
  }

  // Fetch past 24 hours of cloud messages on page load
  public async fetchCloudHistory() {
    try {
      const res = await fetch(`https://ntfy.sh/${TOPIC_MESSAGES}/json?poll=1&since=24h`, {
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) return;
      const text = await res.text();
      const lines = text.trim().split('\n');
      for (const line of lines) {
        if (!line) continue;
        try {
          const item = JSON.parse(line);
          if (item.message) {
            const parsed = JSON.parse(item.message);
            if (parsed.type === 'NEW_MESSAGE' && parsed.message) {
              this.handleIncomingCloudMessage(parsed.message, false);
            }
          }
        } catch {}
      }
      this.notifyListeners({ type: 'STORAGE_UPDATE', payload: {} });
    } catch {}
  }

  private handleIncomingCloudMessage(msg: LiveMessage, playAudio = true) {
    if (!msg || !msg.id || this.processedMsgIds.has(msg.id)) return;
    this.processedMsgIds.add(msg.id);

    const sessions = this.getAllSessions();
    let session = sessions.find((s) => s.id === msg.sessionId);

    if (!session) {
      session = {
        id: msg.sessionId,
        customerName: msg.sender === 'customer' ? msg.senderName || 'ลูกค้าจากหน้าเว็บ' : 'ลูกค้าจากหน้าเว็บ',
        lastMessage: msg.text,
        lastMessageTime: msg.timestamp,
        unreadByOwner: msg.sender === 'customer' ? 1 : 0,
        unreadByCustomer: msg.sender === 'owner' ? 1 : 0,
        updatedAt: msg.createdAt || Date.now(),
        messages: [msg],
      };
      sessions.unshift(session);
    } else {
      if (!session.messages.some((m) => m.id === msg.id)) {
        session.messages.push(msg);
        session.lastMessage = msg.text;
        session.lastMessageTime = msg.timestamp;
        session.updatedAt = msg.createdAt || Date.now();
        if (msg.sender === 'customer') {
          session.unreadByOwner = (session.unreadByOwner || 0) + 1;
        } else if (msg.sender === 'owner') {
          session.unreadByCustomer = (session.unreadByCustomer || 0) + 1;
        }
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch {}

    this.notifyListeners({ type: 'NEW_MESSAGE', payload: { message: msg, session } });
    if (playAudio) {
      this.playChime(msg.sender === 'owner' ? 'outgoing' : 'incoming');
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

  // Play crisp notification chime using Web Audio API
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
    } catch {}
  }

  // Operator Presence Cloud Broadcaster
  public setOperatorOnline(isOnline: boolean) {
    try {
      const status = {
        type: 'OPERATOR_PRESENCE',
        isOnline,
        updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY_OPERATOR, JSON.stringify(status));
      this.notifyListeners({ type: 'OPERATOR_PRESENCE', payload: status });

      // Publish to cloud
      fetch(`https://ntfy.sh/${TOPIC_OPERATOR}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(status),
      }).catch(() => {});

      if (isOnline && !this.operatorHeartbeatTimer) {
        this.operatorHeartbeatTimer = setInterval(() => {
          fetch(`https://ntfy.sh/${TOPIC_OPERATOR}`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ type: 'OPERATOR_PRESENCE', isOnline: true, updatedAt: Date.now() }),
          }).catch(() => {});
        }, 15000);
      } else if (!isOnline && this.operatorHeartbeatTimer) {
        clearInterval(this.operatorHeartbeatTimer);
        this.operatorHeartbeatTimer = null;
      }
    } catch {}
  }

  public isOperatorOnline(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_OPERATOR);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return parsed.isOnline && Date.now() - (parsed.updatedAt || 0) < 60000;
    } catch {
      return false;
    }
  }

  public getOrCreateCustomerSessionId(): string {
    try {
      let id = localStorage.getItem(CURRENT_SESSION_KEY);
      if (!id) {
        id = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        localStorage.setItem(CURRENT_SESSION_KEY, id);
      }
      return id;
    } catch {
      return 'cust_default';
    }
  }

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
    this.processedMsgIds.add(msg.id);

    const sessions = this.getAllSessions();
    let session = sessions.find((s) => s.id === msg.sessionId);

    if (!session) {
      session = {
        id: msg.sessionId,
        customerName: msg.sender === 'customer' ? msg.senderName || 'ลูกค้าจากหน้าเว็บ' : 'ลูกค้าจากหน้าเว็บ',
        lastMessage: msg.text,
        lastMessageTime: msg.timestamp,
        unreadByOwner: msg.sender === 'customer' ? 1 : 0,
        unreadByCustomer: msg.sender === 'owner' ? 1 : 0,
        updatedAt: msg.createdAt || Date.now(),
        messages: [msg],
      };
      sessions.unshift(session);
    } else {
      if (!session.messages.some((m) => m.id === msg.id)) {
        session.messages.push(msg);
      }
      session.lastMessage = msg.text;
      session.lastMessageTime = msg.timestamp;
      session.updatedAt = msg.createdAt || Date.now();
      if (msg.sender === 'customer') {
        session.unreadByOwner = (session.unreadByOwner || 0) + 1;
      } else if (msg.sender === 'owner') {
        session.unreadByCustomer = (session.unreadByCustomer || 0) + 1;
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch {}

    const payload = { type: 'NEW_MESSAGE', message: msg, session };
    this.notifyListeners(payload);
    if (this.localBroadcast) {
      try {
        this.localBroadcast.postMessage(payload);
      } catch {}
    }

    // Publish to cloud so other physical devices (phone ↔ computer) get it instantly
    fetch(`https://ntfy.sh/${TOPIC_MESSAGES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    }).catch(() => {});

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
      this.notifyListeners({ type: 'SESSION_READ', payload: { sessionId, reader: 'owner' } });
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
      this.notifyListeners({ type: 'SESSION_READ', payload: { sessionId, reader: 'customer' } });
    }
  }
}

export const chatSync = new ChatSyncEngine();
