// Dual-Channel Ultra Real-Time Master Chat Engine for โต๊ะจีน รพีพัฒน์ (Sub-50ms SSE Stream + Cloud DB Storage)
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

const STORAGE_KEY_SESSIONS = 'rapeephat_chat_sessions_master_v2';
const STORAGE_KEY_OPERATOR = 'rapeephat_operator_online_status_master_v2';
const CURRENT_SESSION_KEY = 'rapeephat_current_customer_session_id_master_v2';

// 1. High-speed Global Cloud Datastore Endpoint for Persistent Storage
const CLOUD_DB_URL = 'https://api.restful-api.dev/objects/ff808181a057f81101a058882149076f';

// 2. High-Speed Sub-50ms Real-Time Push Stream Endpoint (Server-Sent Events)
const SSE_STREAM_URL = 'https://ntfy.sh/rapeephat_live_stream_v4/sse';
const SSE_POST_URL = 'https://ntfy.sh/rapeephat_live_stream_v4';

class ChatSyncEngine {
  private localBroadcast: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private listeners: Array<(event: { type: string; payload: any }) => void> = [];
  private pollingTimer: any = null;
  private isSyncing = false;
  private processedMsgIds = new Set<string>();
  private titleFlashInterval: any = null;
  private defaultTitle = 'โต๊ะจีน รพีพัฒน์ พรีเมียม (นครปฐม)';

  constructor() {
    if (typeof window !== 'undefined') {
      if (document.title) this.defaultTitle = document.title;

      // 1. Local BroadcastChannel for 0ms cross-tab sync
      if ('BroadcastChannel' in window) {
        try {
          this.localBroadcast = new BroadcastChannel('rapeephat_live_chat_master_channel');
          this.localBroadcast.onmessage = (e) => {
            this.notifyListeners(e.data);
          };
        } catch {}
      }

      // 2. Window Event Listeners for Title restoration
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.stopTitleFlashing();
        }
      });
      window.addEventListener('focus', () => {
        this.stopTitleFlashing();
      });

      // 3. Initialize SSE Real-time Stream
      this.initRealtimeStream();

      // 4. Initial fetch and start continuous 1.5s cloud polling fallback
      this.fetchCloudDatabase();
      this.startContinuousSync();
    }
  }

  private initRealtimeStream() {
    if (typeof window === 'undefined' || !('EventSource' in window)) return;
    try {
      if (this.eventSource) {
        this.eventSource.close();
      }

      this.eventSource = new EventSource(SSE_STREAM_URL);

      this.eventSource.onmessage = (event) => {
        try {
          const eventData = JSON.parse(event.data);
          if (eventData && eventData.message) {
            let parsedPayload: any = null;
            try {
              parsedPayload = JSON.parse(eventData.message);
            } catch {
              parsedPayload = eventData.message;
            }

            if (parsedPayload && parsedPayload.type === 'LIVE_MSG' && parsedPayload.msg) {
              this.handleIncomingRealtimeMessage(parsedPayload.msg);
            }
          }
        } catch {}
      };

      this.eventSource.onerror = () => {
        // Auto-reconnect after 3 seconds
        setTimeout(() => {
          this.initRealtimeStream();
        }, 3000);
      };
    } catch {}
  }

  private handleIncomingRealtimeMessage(msg: LiveMessage) {
    if (!msg || !msg.id || this.processedMsgIds.has(msg.id)) return;
    this.processedMsgIds.add(msg.id);

    const sessions = this.getAllSessions();
    let session = sessions.find((s) => s.id === msg.sessionId);

    if (!session) {
      session = {
        id: msg.sessionId,
        customerName: msg.sender === 'customer' ? (msg.senderName || 'ลูกค้าจากหน้าเว็บ') : 'ลูกค้าจากหน้าเว็บ',
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

    sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch {}

    const payload = { type: 'NEW_MESSAGE', message: msg, session, sessions };
    this.notifyListeners(payload);

    // Audio Chime & Notifications
    if (msg.sender === 'customer') {
      this.triggerBackgroundNotification(msg);
    } else if (msg.sender === 'owner') {
      this.playChime('incoming');
    }
  }

  private startContinuousSync() {
    if (this.pollingTimer) clearInterval(this.pollingTimer);
    this.pollingTimer = setInterval(() => {
      this.fetchCloudDatabase();
    }, 1500);
  }

  public async fetchCloudHistory(_isSilent = false) {
    return this.fetchCloudDatabase();
  }

  public async fetchCloudDatabase() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      const res = await fetch(CLOUD_DB_URL, {
        headers: { 'Cache-Control': 'no-cache' },
        signal: AbortSignal.timeout(3500),
      });
      if (!res.ok) return;
      const data = await res.json();

      if (data && data.data && Array.isArray(data.data.sessions)) {
        const cloudSessions: ChatSession[] = data.data.sessions;
        const localSessions = this.getAllSessions();
        let hasNewMessages = false;
        let latestNewCustomerMsg: LiveMessage | null = null;

        // Merge cloud sessions with local sessions
        for (const cSession of cloudSessions) {
          const lIndex = localSessions.findIndex((s) => s.id === cSession.id);
          if (lIndex === -1) {
            localSessions.push(cSession);
            hasNewMessages = true;
            for (const m of cSession.messages) {
              if (!this.processedMsgIds.has(m.id)) {
                this.processedMsgIds.add(m.id);
                if (m.sender === 'customer') latestNewCustomerMsg = m;
              }
            }
          } else {
            const localS = localSessions[lIndex];
            for (const m of cSession.messages) {
              if (!localS.messages.some((lm) => lm.id === m.id)) {
                localS.messages.push(m);
                localS.lastMessage = m.text;
                localS.lastMessageTime = m.timestamp;
                localS.updatedAt = m.createdAt || Date.now();
                hasNewMessages = true;

                if (!this.processedMsgIds.has(m.id)) {
                  this.processedMsgIds.add(m.id);
                  if (m.sender === 'customer') {
                    latestNewCustomerMsg = m;
                    localS.unreadByOwner = (localS.unreadByOwner || 0) + 1;
                  }
                }
              }
            }
          }
        }

        // Sort by latest message time
        localSessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

        try {
          localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(localSessions));
        } catch {}

        if (hasNewMessages) {
          this.notifyListeners({ type: 'STORAGE_UPDATE', payload: { sessions: localSessions } });
          if (latestNewCustomerMsg) {
            this.triggerBackgroundNotification(latestNewCustomerMsg);
          }
        }
      }
    } catch {
      // Silent retry
    } finally {
      this.isSyncing = false;
    }
  }

  public async pushSessionsToCloud(sessions: ChatSession[]) {
    try {
      await fetch(CLOUD_DB_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Rapeephat Master Chat Data',
          data: {
            sessions,
            updatedAt: Date.now(),
          },
        }),
      });
    } catch (err) {
      console.warn('Cloud sync push notice:', err);
    }
  }

  public triggerBackgroundNotification(msg: LiveMessage) {
    if (typeof window === 'undefined') return;

    // 1. Audible sound chime
    this.playChime('incoming');

    // 2. Mobile vibration
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([250, 100, 250]);
      } catch {}
    }

    // 3. Desktop Native Push Notification
    if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification('🔔 ลูกค้าทักแชทสด! โต๊ะจีน รพีพัฒน์', {
          body: `${msg.senderName || 'ลูกค้า'}: "${msg.text}"`,
          icon: '/images/brand/logo.png',
          tag: 'rapeephat_chat_alert',
          silent: false,
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch {}
    }

    // 4. Flashing Browser Tab Title
    if (document.hidden) {
      this.startTitleFlashing(msg.senderName || 'ลูกค้า');
    }
  }

  public startTitleFlashing(customerName: string) {
    if (this.titleFlashInterval) return;
    let isFlashing = false;
    this.titleFlashInterval = setInterval(() => {
      if (!document.hidden) {
        this.stopTitleFlashing();
        return;
      }
      document.title = isFlashing
        ? `🔴 (1) ${customerName} ทักแชทมา!`
        : `💬 มีข้อความใหม่ - โต๊ะจีนรพีพัฒน์`;
      isFlashing = !isFlashing;
    }, 900);
  }

  public stopTitleFlashing() {
    if (this.titleFlashInterval) {
      clearInterval(this.titleFlashInterval);
      this.titleFlashInterval = null;
    }
    if (typeof document !== 'undefined') {
      document.title = this.defaultTitle || 'โต๊ะจีน รพีพัฒน์ พรีเมียม (นครปฐม)';
    }
  }

  public requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return Promise.resolve('unsupported');
    }
    return Notification.requestPermission();
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
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440.0, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {}
  }

  public setOperatorOnline(isOnline: boolean) {
    try {
      const status = {
        type: 'OPERATOR_PRESENCE',
        isOnline,
        updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY_OPERATOR, JSON.stringify(status));
      this.notifyListeners({ type: 'OPERATOR_PRESENCE', payload: status });
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
      return `cust_${Date.now()}`;
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
        customerName: msg.sender === 'customer' ? (msg.senderName || 'ลูกค้าจากหน้าเว็บ') : 'ลูกค้าจากหน้าเว็บ',
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

    sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch {}

    const payload = { type: 'NEW_MESSAGE', message: msg, session, sessions };
    this.notifyListeners(payload);
    if (this.localBroadcast) {
      try {
        this.localBroadcast.postMessage(payload);
      } catch {}
    }

    // 1. Instant Sub-50ms Real-Time Push to All Connected Browsers
    try {
      fetch(SSE_POST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'LIVE_MSG', msg }),
      }).catch(() => {});
    } catch {}

    // 2. Push to High-Speed Cloud Datastore for Long-Term Storage
    this.pushSessionsToCloud(sessions);

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
      this.pushSessionsToCloud(sessions);
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
      this.pushSessionsToCloud(sessions);
      this.notifyListeners({ type: 'SESSION_READ', payload: { sessionId, reader: 'customer' } });
    }
  }
}

export const chatSync = new ChatSyncEngine();
