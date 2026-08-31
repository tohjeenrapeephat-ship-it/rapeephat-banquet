import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Bell,
  Crown,
  Trash2,
  Maximize2,
  RefreshCw,
  Phone,
  Radio,
  ExternalLink,
  Volume2,
  VolumeX
} from 'lucide-react';
import { chatSync, ChatSession, LiveMessage } from '../services/chatService.js';

interface OwnerMiniChatPortalProps {
  onExpandToFullAdmin?: () => void;
}

export const OwnerMiniChatPortal: React.FC<OwnerMiniChatPortalProps> = ({ onExpandToFullAdmin }) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => chatSync.getAllSessions());
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(() => {
    const all = chatSync.getAllSessions();
    return all.length > 0 ? all[0].id : null;
  });
  const [ownerReplyText, setOwnerReplyText] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifPermission, setNotifPermission] = useState<string>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported';
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSync.setOperatorOnline(true);
    chatSync.fetchCloudHistory(false);

    const presenceInterval = setInterval(() => {
      chatSync.setOperatorOnline(true);
    }, 12000);

    const pollInterval = setInterval(() => {
      const updated = chatSync.getAllSessions();
      setChatSessions([...updated]);
      setSelectedSessionId((curr) => {
        if (!curr && updated.length > 0) return updated[0].id;
        return curr;
      });
    }, 2000);

    const unsubscribe = chatSync.subscribe((event) => {
      const updated = chatSync.getAllSessions();
      setChatSessions([...updated]);
      setSelectedSessionId((curr) => {
        if (!curr && updated.length > 0) return updated[0].id;
        return curr;
      });
    });

    return () => {
      chatSync.setOperatorOnline(false);
      clearInterval(presenceInterval);
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatSessions, selectedSessionId]);

  const handleSendOwnerReply = (textToSend?: string) => {
    const text = (textToSend || ownerReplyText).trim();
    if (!text || !selectedSessionId) return;

    const replyMsg: LiveMessage = {
      id: `owner-${Date.now()}`,
      sessionId: selectedSessionId,
      sender: 'owner',
      senderName: 'คุณแป้ง (เจ้าของร้าน)',
      text,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
    };

    chatSync.saveMessage(replyMsg);
    setOwnerReplyText('');
    setChatSessions([...chatSync.getAllSessions()]);
  };

  const handleSelectSession = (sId: string) => {
    setSelectedSessionId(sId);
    chatSync.markAsReadByOwner(sId);
  };

  const activeSession = chatSessions.find((s) => s.id === selectedSessionId);
  const currentMessages = activeSession ? activeSession.messages : [];

  return (
    <div className="w-full h-screen bg-slate-900 text-slate-900 font-sans flex flex-col overflow-hidden select-none border-2 border-amber-400">
      
      {/* 1. Header Bar: Compact Gold & Ruby Style */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 p-2.5 px-3.5 text-white flex items-center justify-between border-b-2 border-amber-400 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-red-600 flex items-center justify-center font-black text-xs text-white shadow-xs">
            👑
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black text-amber-300">
                แชทสดหลังบ้าน (คุณแป้ง)
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[9.5px] text-emerald-400 font-bold">
              ออนไลน์มุมจอ 24 ชม. 🟢
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {/* Notification Permission Button */}
          {notifPermission !== 'granted' && (
            <button
              onClick={async () => {
                const res = await chatSync.requestNotificationPermission();
                setNotifPermission(res);
              }}
              className="p-1 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] flex items-center gap-1 animate-pulse"
              title="เปิดการแจ้งเตือนเวลาพับหน้าจอ"
            >
              <Bell className="w-3 h-3" />
              <span>เปิดเตือน</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title={soundEnabled ? 'เปิดเสียงเตือนอยู่' : 'ปิดเสียงเตือน'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => chatSync.fetchCloudHistory(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="รีเฟรชข้อความ"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Expand to Full Admin */}
          {onExpandToFullAdmin && (
            <button
              onClick={onExpandToFullAdmin}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="ขยายเป็นหน้าจอใหญ่"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Customer Session Selector Chips Bar */}
      <div className="bg-slate-950/80 px-2.5 py-1.5 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {chatSessions.length === 0 ? (
          <span className="text-[10px] text-slate-400 px-2 py-0.5">
            รอข้อความจากลูกค้า...
          </span>
        ) : (
          chatSessions.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelectSession(s.id)}
              className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                selectedSessionId === s.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="truncate max-w-[80px]">{s.customerName}</span>
              {s.unreadByOwner > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center">
                  {s.unreadByOwner}
                </span>
              )}
            </button>
          ))
        )}
      </div>

      {/* 3. Message Feed */}
      <div className="flex-1 p-3 overflow-y-auto bg-[#FFFDF9] space-y-2.5 text-xs">
        {currentMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-1 p-4">
            <MessageSquare className="w-7 h-7 text-slate-300" />
            <p className="text-[11px] font-bold text-slate-600">ยังไม่มีข้อความในห้องนี้</p>
            <p className="text-[10px] text-slate-400">เมื่อลูกค้าทักเข้ามา จะแสดงตรงนี้ทันที</p>
          </div>
        ) : (
          currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'owner' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[9px] text-slate-400 font-bold mb-0.5 px-1 flex items-center gap-1">
                {msg.sender === 'owner' && (
                  <span className="text-amber-600 font-black">👑 คุณแป้ง:</span>
                )}
                {msg.sender === 'customer' && `ลูกค้า (${msg.senderName}):`}
                {msg.sender === 'bot' && 'บอทผู้ช่วย:'}
              </span>

              <div
                className={`max-w-[88%] rounded-2xl p-2.5 space-y-0.5 shadow-xs ${
                  msg.sender === 'owner'
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-br-xs'
                    : msg.sender === 'customer'
                    ? 'bg-white border-2 border-red-200 text-slate-950 font-bold rounded-bl-xs'
                    : 'bg-slate-100 border border-slate-200 text-slate-700 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed text-[11px]">
                  {msg.text}
                </p>
                <div
                  className={`text-[8.5px] font-bold text-right ${
                    msg.sender === 'owner' ? 'text-red-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Quick Reply Suggestions */}
      <div className="px-2.5 py-1.5 bg-amber-50/80 border-t border-amber-200 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => handleSendOwnerReply('สวัสดีค่ะ โต๊ะจีนรพีพัฒน์ยินดีดูแลค่ะ สนใจจัดเลี้ยงกี่โต๊ะคะ 😊')}
          className="px-2 py-0.5 rounded-full bg-white hover:bg-red-50 text-slate-800 border border-amber-300 font-bold text-[10px] whitespace-nowrap shrink-0"
        >
          👋 ทักทาย
        </button>
        <button
          onClick={() => handleSendOwnerReply('วันที่ลูกค้าแจ้ง มีคิวว่างพร้อมดูแลได้เลยนะคะ สามารถล็อกคิวได้เลยค่ะ ✨')}
          className="px-2 py-0.5 rounded-full bg-white hover:bg-red-50 text-slate-800 border border-amber-300 font-bold text-[10px] whitespace-nowrap shrink-0"
        >
          📅 มีคิวว่าง
        </button>
        <button
          onClick={() => handleSendOwnerReply('แพ็กเกจเริ่มต้น 1,400.- ฟรีโต๊ะ เก้าอี้ ผ้าคลุมผูกโบว์ และบริกรครบชุดค่ะ 🍽️')}
          className="px-2 py-0.5 rounded-full bg-white hover:bg-red-50 text-slate-800 border border-amber-300 font-bold text-[10px] whitespace-nowrap shrink-0"
        >
          🍽️ ราคา 1,400
        </button>
        <button
          onClick={() => handleSendOwnerReply('รบกวนขอทราบเบอร์โทรศัพท์และสถานที่จัดงาน เพื่อให้แป้งติดต่อกลับด้วยนะคะ 📞')}
          className="px-2 py-0.5 rounded-full bg-white hover:bg-amber-50 text-amber-900 border border-amber-400 font-black text-[10px] whitespace-nowrap shrink-0"
        >
          📞 ขอเบอร์โทร
        </button>
      </div>

      {/* 5. Reply Input Box */}
      <div className="p-2 bg-white border-t border-slate-200 flex items-center gap-1.5 shrink-0">
        <input
          type="text"
          placeholder="พิมพ์ตอบลูกค้า..."
          value={ownerReplyText}
          onChange={(e) => setOwnerReplyText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendOwnerReply();
          }}
          className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-xs"
        />

        <button
          type="button"
          onClick={() => handleSendOwnerReply()}
          disabled={!ownerReplyText.trim()}
          className={`p-2 px-3 rounded-xl font-black text-xs flex items-center gap-1 transition-all ${
            ownerReplyText.trim()
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>ส่ง</span>
        </button>
      </div>

    </div>
  );
};
