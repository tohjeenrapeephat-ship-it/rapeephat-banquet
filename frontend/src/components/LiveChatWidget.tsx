import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Phone,
  Clock,
  User,
  CheckCircle2,
  FileText,
  Minimize2,
  Maximize2,
  Crown,
  Radio,
  Bell
} from 'lucide-react';
import { chatSync, LiveMessage } from '../services/chatService.js';

interface LiveChatWidgetProps {
  onOpenBuilder?: () => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ onOpenBuilder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOwnerOnline, setIsOwnerOnline] = useState(false);
  const [sessionId] = useState(() => chatSync.getOrCreateCustomerSessionId());

  // Customer Lead Capture State
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadTables, setLeadTables] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Message History
  const [messages, setMessages] = useState<LiveMessage[]>(() => {
    const existing = chatSync.getSession(sessionId);
    if (existing && existing.messages.length > 0) {
      return existing.messages;
    }
    const welcomeMsg: LiveMessage = {
      id: 'msg-welcome-1',
      sessionId,
      sender: 'bot',
      senderName: 'ผู้ช่วยโต๊ะจีนรพีพัฒน์',
      text: 'สวัสดีค่ะ! ยินดีต้อนรับสู่ โต๊ะจีน รพีพัฒน์ พรีเมียม (นครปฐม) ค่ะ 👑✨\n\nสนใจจัดเลี้ยงโต๊ะจีนกี่โต๊ะ หรือต้องการสอบถามเรื่องใด พิมพ์คุยกับเจ้าหน้าที่ตรงนี้ได้เลยนะคะ ยินดีดูแลตลอด 24 ชม. ค่ะ',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
    };
    return [welcomeMsg];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen to live events from chatSync (Owner reply, Operator status)
  useEffect(() => {
    setIsOwnerOnline(chatSync.isOperatorOnline());

    const unsubscribe = chatSync.subscribe((event) => {
      if (event.type === 'OPERATOR_PRESENCE') {
        setIsOwnerOnline(event.payload.isOnline);
      } else if (event.type === 'NEW_MESSAGE') {
        const msg: LiveMessage = event.payload.message;
        if (msg.sessionId === sessionId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });

          if (msg.sender === 'owner' && !isOpen) {
            setUnreadCount((c) => c + 1);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [sessionId, isOpen]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      chatSync.markAsReadByCustomer(sessionId);
    }
  }, [messages, isOpen, isMinimized, isTyping, sessionId]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    chatSync.markAsReadByCustomer(sessionId);
  };

  // Smart Real-time Knowledge Engine
  const generateBotReply = (userText: string) => {
    const text = userText.toLowerCase();

    // 1. Price / Packages
    if (text.includes('ราคา') || text.includes('แพ็กเกจ') || text.includes('แพคเกจ') || text.includes('ชุดละ') || text.includes('โต๊ะละ') || text.includes('คอร์ส')) {
      return {
        text: 'โต๊ะจีน รพีพัฒน์ มีบริการแพ็กเกจอาหารระดับภัตตาคาร 8 ระดับราคาค่ะ:\n\n• 🌟 มิตรภาพ: 1,400.- (9 จาน รวมของหวาน)\n• 🌸 มงคลสมรส: 1,700.- (เมนูยอดนิยม)\n• 👑 เศรษฐี: 2,000.- (คุ้มค่าที่สุด)\n• 💎 พรีเมียม: 2,400.- (เป็ดย่างฮ่องกง & ซีฟู้ด)\n• 🏆 วีไอพี: 2,800.- (ปลากะพงนึ่งซีอิ๊วตัวโต)\n• 👑 จักรพรรดิ: 3,300.- / 3,800.- (วัตถุดิบชั้นสูง)\n\n🎁 พิเศษ! สั่ง 20 โต๊ะขึ้นไป แถมฟรี 1 โต๊ะทันทีค่ะ',
      };
    }

    // 2. Minimum tables
    if (text.includes('ขั้นต่ำ') || text.includes('กี่โต๊ะ') || text.includes('น้อยสุด')) {
      return {
        text: 'รับจัดเลี้ยงเริ่มต้นตั้งแต่ 5 โต๊ะขึ้นไปค่ะ จัดได้ตั้งแต่ 5 โต๊ะ ถึง 500+ โต๊ะ พร้อมทีมงานเชฟมืออาชีพและบริกรดูแลครบวงจรค่ะ\n\n📌 โปรโมชั่นพิเศษ: สั่งจอง 20 โต๊ะ แถมฟรี 1 โต๊ะทันทีค่ะ!',
      };
    }

    // 3. Location / Provinces
    if (text.includes('จังหวัด') || text.includes('ส่ง') || text.includes('พื้นที่') || text.includes('ต่างจังหวัด') || text.includes('กทม') || text.includes('กรุงเทพ') || text.includes('ที่ไหน')) {
      return {
        text: 'เรามีรถบริการควบคุมอุณหภูมิพร้อมจัดเลี้ยง ทั่วประเทศไทย 77 จังหวัด เลยค่ะ!\n\n• กรุงเทพฯ และปริมณฑล (นครปฐม นนทบุรี ปทุมธานี สมุทรปราการ สมุทรสาคร)\n• ภาคกลาง ภาคตะวันออก ภาคอีสาน ภาคเหนือ ภาคใต้\n\nครัวของเรายกเตาและปรุงสุกสดใหม่หน้างาน 100% อาหารร้อนอร่อยทุกโต๊ะแน่นอนค่ะ 🚚💨',
      };
    }

    // 4. Equipment / Tables & Chairs
    if (text.includes('เก้าอี้') || text.includes('โต๊ะ') || text.includes('ผ้าคลุม') || text.includes('อุปกรณ์') || text.includes('จาน') || text.includes('แก้ว')) {
      return {
        text: 'ฟรี! อุปกรณ์จัดเลี้ยงครบชุดทุกแพ็กเกจค่ะ:\n\n✅ โต๊ะจีนกลมขนาดมาตรฐาน 10 ที่นั่ง\n✅ เก้าอี้พร้อมผ้าคลุมและผูกโบว์ซาตินหรูหรา (เลือกสีได้: ทอง, เขียวมรกต, ม่วง, ชมพู)\n✅ ชุดจานชามเมลามีน ช้อนส้อม ตะเกียบ แก้วน้ำ ผ้าเช็ดปาก\n✅ พนักงานบริกรคอยเสิร์ฟและบริการตลอดงาน',
      };
    }

    // 5. Popular Menus
    if (text.includes('เมนู') || text.includes('แนะนำ') || text.includes('อร่อย') || text.includes('กับข้าว')) {
      return {
        text: 'เมนูซิกเนเจอร์ต้นตำรับ 35 ปี ที่เจ้าภาพนิยมสั่งมากที่สุด:\n\n1. 🌟 ขาหมูน้ำแดงยอดผัก & เห็ดหอมตุ๋นยาจีน (เนื้อนุ่มละลายในปาก)\n2. 🦆 เป็ดย่างน้ำผึ้งฮ่องกงหมี่หยก (หนังกรอบเนื้อฉ่ำ)\n3. 🐟 ปลากะพงนึ่งมะนาว / นึ่งซีอิ๊วขิงสด\n4. 👑 ข้าวผัดห่อใบบัวทรงเครื่องจักรพรรดิ\n5. 🍲 กระเพาะปลาน้ำแดงเนื้อปูก้อน\n6. 🥣 แปะก๊วยนมสดมะพร้าวอ่อน / บัวลอยน้ำขิง',
      };
    }

    // 6. Contact / Phone
    if (text.includes('เบอร์') || text.includes('โทร') || text.includes('ติดต่อ') || text.includes('คุณแป้ง') || text.includes('ไลน์')) {
      return {
        text: 'ช่องทางติดต่อโต๊ะจีน รพีพัฒน์ พรีเมียม:\n\n📞 โทรด่วน: 083-087-2257 (คุณแป้ง)\n💬 LINE: pang_baichaa\n✉️ Email: info@rapeephat-catering.com\n\nหรือจะพิมพ์เบอร์โทรไว้ในแชทนี้ได้เลยนะคะ เจ้าหน้าที่จะโทรกลับทันทีค่ะ 😊',
      };
    }

    // 7. Lead Detection
    const phoneMatch = userText.match(/(0\d{8,9})/);
    if (phoneMatch) {
      try {
        const lead = {
          name: leadName || 'ลูกค้าจาก Live Chat',
          phone: phoneMatch[0],
          rawText: userText,
          time: new Date().toISOString(),
        };
        const existingLeads = JSON.parse(localStorage.getItem('rapeephat_chat_leads') || '[]');
        existingLeads.push(lead);
        localStorage.setItem('rapeephat_chat_leads', JSON.stringify(existingLeads));
      } catch {}

      return {
        text: `ขอบพระคุณมากค่ะ! ได้รับเบอร์ติดต่อ ${phoneMatch[0]} เรียบร้อยแล้วค่ะ เจ้าหน้าที่จะติดต่อกลับเพื่อให้ข้อมูลและแนะนำโปรโมชั่นพิเศษโดยเร็วที่สุดนะคะ 💖`,
      };
    }

    // Default Fallback
    return {
      text: isOwnerOnline
        ? 'ขอบคุณสำหรับข้อความนะคะ ขณะนี้คุณแป้ง (เจ้าของร้าน) กำลังออนไลน์อยู่ กำลังอ่านข้อความและเตรียมพิมพ์ตอบกลับค่ะ หรือต้องการให้ออกใบเสนอราคาสามารถกดปุ่มด้านล่างได้เลยนะคะ 😊'
        : 'ขอบคุณสำหรับข้อความนะคะ หากต้องการให้ออกใบเสนอราคาทางการ หรือต้องการคุยรายละเอียดเพิ่มเติม แป้งยินดีแนะนำให้ทันทีค่ะ สามารถเลือกเมนูด้านล่างหรือพิมพ์สอบถามเพิ่มเติมได้เลยนะคะ 😊',
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: LiveMessage = {
      id: `usr-${Date.now()}`,
      sessionId,
      sender: 'customer',
      senderName: leadName || 'ลูกค้าผู้มีเกียรติ',
      text,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
    };

    chatSync.saveMessage(userMsg);
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // If owner is NOT actively typing a manual reply, respond with intelligent assistant
    if (!isOwnerOnline) {
      setIsTyping(true);
      setTimeout(() => {
        const reply = generateBotReply(text);
        const botMsg: LiveMessage = {
          id: `bot-${Date.now()}`,
          sessionId,
          sender: 'bot',
          senderName: 'ผู้ช่วยโต๊ะจีนรพีพัฒน์',
          text: reply.text,
          timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          createdAt: Date.now(),
        };
        chatSync.saveMessage(botMsg);
        setIsTyping(false);
      }, 700);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadPhone.trim()) return;

    try {
      const newLead = {
        name: leadName || 'ลูกค้าจาก Live Chat',
        phone: leadPhone,
        tables: leadTables,
        source: 'Live Chat Web Widget',
        createdAt: new Date().toISOString(),
      };
      const saved = JSON.parse(localStorage.getItem('rapeephat_chat_leads') || '[]');
      saved.push(newLead);
      localStorage.setItem('rapeephat_chat_leads', JSON.stringify(saved));
    } catch {}

    const leadMsg: LiveMessage = {
      id: `usr-lead-${Date.now()}`,
      sessionId,
      sender: 'customer',
      senderName: leadName || 'ลูกค้า',
      text: `[ข้อมูลติดต่อกลับ] ชื่อ: ${leadName || '-'}, เบอร์โทร: ${leadPhone}, จำนวนโต๊ะ/วันที่: ${leadTables || '-'}`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
    };
    chatSync.saveMessage(leadMsg);

    setLeadSubmitted(true);
    setTimeout(() => {
      setShowLeadForm(false);
      setLeadSubmitted(false);
      setLeadName('');
      setLeadPhone('');
      setLeadTables('');
    }, 1500);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 🟢 1. FLOATING CHAT TRIGGER BUTTON */}
      {/* ========================================================================= */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          
          {/* Greeting Tooltip Bubble */}
          <div
            onClick={handleOpenChat}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-slate-900 border-2 border-amber-300 shadow-xl shadow-amber-900/10 cursor-pointer hover:border-red-500 transition-all transform hover:-translate-x-1 animate-fadeIn group"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div className="text-xs">
              <span className="font-bold text-red-700">
                {isOwnerOnline ? 'คุณแป้ง (เจ้าของร้าน) ออนไลน์อยู่' : 'แชทสดสอบถาม'}
              </span>
              {' • '}
              <span className="text-slate-600 font-medium">พร้อมคุยสดทันทีค่ะ</span>
            </div>
          </div>

          {/* Main Floating Trigger Button */}
          <button
            onClick={handleOpenChat}
            className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-amber-500 text-white shadow-2xl shadow-red-900/40 ring-4 ring-white flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all group"
            aria-label="เปิดแชทสดกับเจ้าหน้าที่"
            title="คุยแชทสดกับเจ้าหน้าที่โต๊ะจีน รพีพัฒน์"
          >
            <MessageSquare className="w-7 h-7 text-amber-100 group-hover:scale-110 transition-transform" />
            
            {/* Unread Counter Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-white shadow-md animate-bounce">
                {unreadCount}
              </span>
            )}

            {/* Online Pulse Dot */}
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          </button>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 💬 2. EXPANDED REAL-TIME CHAT WINDOW MODAL */}
      {/* ========================================================================= */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-4 right-4 w-72 h-14 bg-slate-900 rounded-2xl shadow-2xl border border-amber-300 flex items-center justify-between px-4 text-white cursor-pointer'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-[100dvh] sm:h-[590px] sm:w-[420px] sm:rounded-3xl bg-white shadow-2xl border sm:border-2 border-amber-300/90 flex flex-col overflow-hidden animate-fadeIn'
          }`}
        >
          {/* Header Bar */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white flex items-center justify-between border-b-2 border-amber-400 shrink-0">
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white p-0.5 border border-amber-300 shadow-sm flex items-center justify-center overflow-hidden">
                  <img
                    src="/images/brand/logo.png"
                    alt="รพีพัฒน์ โต๊ะจีน"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">
                    {isOwnerOnline ? 'คุณแป้ง (โต๊ะจีนรพีพัฒน์)' : 'แชทสด โต๊ะจีนรพีพัฒน์'}
                  </h3>
                  <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded text-[9px] font-black uppercase">
                    {isOwnerOnline ? '👑 เจ้าของร้าน' : 'OFFICIAL'}
                  </span>
                </div>
                <p className="text-[10.5px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isOwnerOnline ? 'เจ้าของร้านออนไลน์อยู่ พร้อมตอบทันที 🟢' : 'ออนไลน์พร้อมตอบ 24 ชม.'}
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title={isMinimized ? 'ขยายหน้าต่าง' : 'ย่อหน้าต่าง'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="ปิดหน้าต่างแชท"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Active Chat Content (When NOT minimized) */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto bg-[#FFFDF9] space-y-3.5 text-xs selection:bg-red-500 selection:text-white">
                
                {/* Security Guarantee Pill */}
                <div className="text-center my-1">
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Crown className="w-3 h-3 text-amber-600" />
                    คุยสดกับฝ่ายจัดเลี้ยง โต๊ะจีน รพีพัฒน์ พรีเมียม 35+ ปี
                  </span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}
                  >
                    {/* Sender Label */}
                    <span className="text-[10px] text-slate-400 font-bold mb-1 px-1 flex items-center gap-1">
                      {msg.sender === 'owner' && (
                        <span className="text-amber-600 font-black flex items-center gap-0.5">
                          <Crown className="w-3 h-3 text-amber-600" />
                          คุณแป้ง (เจ้าของร้าน):
                        </span>
                      )}
                      {msg.sender === 'customer' && 'คุณ'}
                      {msg.sender === 'bot' && 'โต๊ะจีนรพีพัฒน์'}
                    </span>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 space-y-1.5 shadow-xs ${
                        msg.sender === 'customer'
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-br-xs'
                          : msg.sender === 'owner'
                          ? 'bg-gradient-to-br from-amber-50 to-amber-100/80 border-2 border-amber-400 text-slate-950 rounded-bl-xs shadow-md'
                          : 'bg-white border border-amber-200/90 text-slate-900 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed font-medium">
                        {msg.text}
                      </p>

                      <div
                        className={`text-[9.5px] font-bold text-right pt-0.5 ${
                          msg.sender === 'customer'
                            ? 'text-red-200'
                            : msg.sender === 'owner'
                            ? 'text-amber-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs py-1">
                    <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[10px] font-black text-red-700">
                      รพี
                    </div>
                    <div className="bg-white border border-amber-200 px-3.5 py-2 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[10.5px] text-slate-400 font-bold ml-1">กำลังพิมพ์ตอบ...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestion Chips */}
              <div className="px-3 py-2 bg-amber-50/60 border-t border-amber-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <button
                  onClick={() => {
                    onOpenBuilder?.();
                    setIsOpen(false);
                  }}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[10.5px] whitespace-nowrap shadow-2xs transition-colors shrink-0 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>ออกใบเสนอราคา A4</span>
                </button>

                <button
                  onClick={() => handleSendMessage('ขอทราบราคาแพ็กเกจโต๊ะจีนทั้งหมด')}
                  className="px-3 py-1 rounded-full bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 border border-amber-300 font-bold text-[10.5px] whitespace-nowrap shadow-2xs transition-colors shrink-0"
                >
                  🍽️ ราคาแพ็กเกจ
                </button>

                <button
                  onClick={() => handleSendMessage('ขั้นต่ำกี่โต๊ะ มีโปรโมชั่นอะไรบ้าง')}
                  className="px-3 py-1 rounded-full bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 border border-amber-300 font-bold text-[10.5px] whitespace-nowrap shadow-2xs transition-colors shrink-0"
                >
                  🎁 โปรสั่ง 20 ฟรี 1
                </button>

                <button
                  onClick={() => setShowLeadForm(true)}
                  className="px-3 py-1 rounded-full bg-white hover:bg-amber-50 text-amber-900 border border-amber-400 font-black text-[10.5px] whitespace-nowrap shadow-2xs transition-colors shrink-0 flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-red-600" />
                  <span>ฝากเบอร์โทรกลับ</span>
                </button>
              </div>

              {/* Lead Capture Popup Drawer inside Chat */}
              {showLeadForm && (
                <div className="p-3.5 bg-gradient-to-br from-slate-900 to-red-950 text-white border-t-2 border-amber-400 animate-slideUp">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>ฝากเบอร์ให้เจ้าหน้าที่ติดต่อกลับด่วน</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLeadForm(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {leadSubmitted ? (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-center font-bold text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ส่งข้อมูลสำเร็จ เจ้าหน้าที่จะรีบโทรกลับนะคะ!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="ชื่อของคุณ"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="เบอร์โทรศัพท์ *"
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs font-mono font-bold"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="จำนวนโต๊ะ / วันที่จัดงาน (ถ้ามี)"
                        value={leadTables}
                        onChange={(e) => setLeadTables(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-md active:scale-95 transition-all"
                      >
                        ยืนยันให้เจ้าหน้าที่โทรกลับ
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder={isOwnerOnline ? 'พิมพ์คุยกับคุณแป้งตรงนี้ได้เลย...' : 'พิมพ์ข้อความคุยกับเจ้าหน้าที่ตรงนี้...'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-xs font-medium"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className={`p-2.5 rounded-2xl transition-all ${
                    inputValue.trim()
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md transform hover:scale-105 active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  aria-label="ส่งข้อความ"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </>
          )}

        </div>
      )}
    </>
  );
};
