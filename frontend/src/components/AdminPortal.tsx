import React, { useState, useEffect } from 'react';
import { QuotationDoc } from '../types/quotation.js';
import { QuotationApi } from '../services/api.js';
import { BANQUET_PACKAGES } from '../data/packages.js';
import { formatCurrency } from '../utils/currency.js';
import { formatThaiDate } from '../utils/thaiDate.js';
import { QueueService, BlockedDateEntry, BookingPolicy, formatThaiDateShort, getDayOfWeekThai } from '../services/queueService.js';
import { QuotationModal } from './QuotationBuilder/QuotationModal.js';
import { CateringContractModal } from './CateringContractModal.js';
import { CateringReceiptModal, ReceiptType } from './CateringReceiptModal.js';
import { EditQuotationModal } from './EditQuotationModal.js';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Users,
  Calendar,
  Search,
  Filter,
  Eye,
  Trash2,
  CloudUpload,
  Phone,
  RefreshCw,
  Edit3,
  Save,
  Settings,
  Utensils,
  TrendingUp,
  ChevronRight,
  MessageSquare,
  Send,
  Radio,
  Sparkles,
  Crown,
  Bell,
  ExternalLink,
  FileCheck,
  Receipt,
  Printer,
  FileSpreadsheet,
  Download,
  CreditCard,
  AlertCircle,
  Check
} from 'lucide-react';
import { chatSync, ChatSession, LiveMessage } from '../services/chatService.js';

interface AdminPortalProps {
  onBackToSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToSite }) => {
  const [quotations, setQuotations] = useState<QuotationDoc[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuote, setActiveQuote] = useState<QuotationDoc | null>(null);
  const [contractQuote, setContractQuote] = useState<QuotationDoc | null>(null);
  const [receiptQuote, setReceiptQuote] = useState<QuotationDoc | null>(null);
  const [receiptType, setReceiptType] = useState<ReceiptType>('deposit_30');
  const [editingQuote, setEditingQuote] = useState<QuotationDoc | null>(null);
  const [activeTab, setActiveTab] = useState<'quotations' | 'queue_manager' | 'chat_leads' | 'packages' | 'settings'>('quotations');
  
  // Queue & Blocked Dates Management State
  const [bookingPolicy, setBookingPolicy] = useState<BookingPolicy>(() => QueueService.getBookingPolicy());
  const [policyMinTables, setPolicyMinTables] = useState<string>(() => QueueService.getBookingPolicy().minTables?.toString() || '10');
  const [policyReason, setPolicyReason] = useState<string>(() => QueueService.getBookingPolicy().closedReason || '');
  const [blockedDates, setBlockedDates] = useState<BlockedDateEntry[]>(() => QueueService.getBlockedDates());
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedStatusType, setNewBlockedStatusType] = useState<'fully_booked' | 'available_capacity'>('fully_booked');
  const [newBlockedTableCount, setNewBlockedTableCount] = useState<string>('80');
  const [newBlockedNote, setNewBlockedNote] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState<BlockedDateEntry['reason']>('fully_booked');
  const [queueSuccessMsg, setQueueSuccessMsg] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const all = chatSync.getAllSessions();
    if (all.length === 0) {
      return [{
        id: 'room_main',
        customerName: 'ลูกค้าจากหน้าเว็บ (แชทสด)',
        lastMessage: 'ยินดีต้อนรับสู่โต๊ะจีนรพีพัฒน์ค่ะ',
        lastMessageTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        unreadByOwner: 0,
        unreadByCustomer: 0,
        updatedAt: Date.now(),
        messages: [{
          id: 'sys-welcome',
          sessionId: 'room_main',
          sender: 'bot',
          senderName: 'ระบบโต๊ะจีนรพีพัฒน์',
          text: 'ยินดีต้อนรับสู่ศูนย์รับแชทสดโต๊ะจีน รพีพัฒน์ ค่ะ คุณแป้งสามารถพิมพ์ตอบข้อความลูกค้าได้ทันทีตรงนี้เลยนะคะ 😊',
          timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          createdAt: Date.now(),
        }]
      }];
    }
    return all;
  });
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(() => {
    const all = chatSync.getAllSessions();
    return all.length > 0 ? all[0].id : 'room_main';
  });
  const [ownerReplyText, setOwnerReplyText] = useState('');
  const [chatSubView, setChatSubView] = useState<'live_room' | 'leads_table'>('live_room');
  const [notifPermission, setNotifPermission] = useState<string>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported';
  });

  const [chatLeads, setChatLeads] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('rapeephat_chat_leads') || '[]');
    } catch {
      return [];
    }
  });

  // Operator presence heartbeat & real-time chat listener
  useEffect(() => {
    chatSync.setOperatorOnline(true);
    chatSync.fetchCloudHistory(false);

    const presenceInterval = setInterval(() => {
      chatSync.setOperatorOnline(true);
    }, 15000);

    const pollInterval = setInterval(() => {
      const updated = chatSync.getAllSessions();
      if (updated.length > 0) {
        setChatSessions([...updated]);
        setSelectedSessionId((curr) => curr || updated[0].id);
      }
      try {
        setChatLeads(JSON.parse(localStorage.getItem('rapeephat_chat_leads') || '[]'));
      } catch {}
    }, 2000);

    const unsubscribe = chatSync.subscribe((event) => {
      const updated = chatSync.getAllSessions();
      if (updated.length > 0) {
        setChatSessions([...updated]);
        setSelectedSessionId((curr) => curr || updated[0].id);
      }
      try {
        setChatLeads(JSON.parse(localStorage.getItem('rapeephat_chat_leads') || '[]'));
      } catch {}
    });

    return () => {
      chatSync.setOperatorOnline(false);
      clearInterval(presenceInterval);
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, []);

  const handleSelectSession = (sId: string) => {
    setSelectedSessionId(sId);
    chatSync.markAsReadByOwner(sId);
  };

  const handleSendOwnerReply = (textToSend?: string) => {
    const text = (textToSend || ownerReplyText).trim();
    const targetSessionId = selectedSessionId || (chatSessions.length > 0 ? chatSessions[0].id : 'room_main');
    if (!text || !targetSessionId) return;

    const replyMsg: LiveMessage = {
      id: `owner-${Date.now()}`,
      sessionId: targetSessionId,
      sender: 'owner',
      senderName: 'คุณแป้ง',
      text,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
    };

    chatSync.saveMessage(replyMsg);
    setOwnerReplyText('');
    setChatSessions([...chatSync.getAllSessions()]);
  };

  // GAS Webhook Settings
  const [gasUrl, setGasUrl] = useState(() => localStorage.getItem('rapeephat_gas_url') || '');
  const [gasSaved, setGasSaved] = useState(false);

  // Edit Note Modal
  const [editingNoteQuote, setEditingNoteQuote] = useState<QuotationDoc | null>(null);
  const [tempNote, setTempNote] = useState('');

  const fetchQuotations = async () => {
    setIsLoading(true);
    try {
      const data = await QuotationApi.getAll(searchTerm);
      setQuotations(data);
    } catch (e) {
      console.error('Error fetching quotations in admin:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [searchTerm]);

  // Status Change Handler
  const handleStatusChange = async (quote: QuotationDoc, newStatus: string) => {
    try {
      if (quote.id && !quote.id.startsWith('loc_')) {
        await fetch(`/api/quotations/${quote.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      }
    } catch (e) {
      console.warn('Backend status update error:', e);
    }

    const updated = quotations.map((q) =>
      q.quoteNo === quote.quoteNo ? { ...q, status: newStatus as any } : q
    );
    setQuotations(updated);
    try {
      localStorage.setItem('rapeephat_quotations_db', JSON.stringify(updated));
    } catch {}
  };

  // Save Note Handler
  const handleSaveNote = async () => {
    if (!editingNoteQuote) return;
    try {
      if (editingNoteQuote.id && !editingNoteQuote.id.startsWith('loc_')) {
        await fetch(`/api/quotations/${editingNoteQuote.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: tempNote }),
        });
      }
    } catch (e) {
      console.warn('Backend note update error:', e);
    }

    const updated = quotations.map((q) =>
      q.quoteNo === editingNoteQuote.quoteNo ? { ...q, notes: tempNote, customer: { ...q.customer, notes: tempNote } } : q
    );
    setQuotations(updated);
    try {
      localStorage.setItem('rapeephat_quotations_db', JSON.stringify(updated));
    } catch {}
    setEditingNoteQuote(null);
  };

  // Delete Quote Handler
  const handleDelete = async (quote: QuotationDoc) => {
    if (!confirm(`ยืนยันการลบใบเสนอราคา ${quote.quoteNo} หรือไม่?`)) return;
    try {
      if (quote.id && !quote.id.startsWith('loc_')) {
        await fetch(`/api/quotations/${quote.id}`, { method: 'DELETE' });
      }
    } catch (e) {
      console.warn('Delete error:', e);
    }
    const updated = quotations.filter((q) => q.quoteNo !== quote.quoteNo);
    setQuotations(updated);
    try {
      localStorage.setItem('rapeephat_quotations_db', JSON.stringify(updated));
    } catch {}
  };

  // Save Edited Quotation Handler (Full Update + Re-Generate PDF workflow)
  const handleSaveEditedQuote = async (updatedQuote: QuotationDoc, openPreview?: boolean) => {
    try {
      await QuotationApi.update(updatedQuote);
    } catch (e) {
      console.warn('API update error:', e);
    }

    const updatedList = quotations.map((q) =>
      q.quoteNo === updatedQuote.quoteNo || (updatedQuote.id && q.id === updatedQuote.id) ? updatedQuote : q
    );
    setQuotations(updatedList);
    try {
      localStorage.setItem('rapeephat_quotations_db', JSON.stringify(updatedList));
    } catch {}

    setEditingQuote(null);

    if (openPreview) {
      setActiveQuote(updatedQuote);
    }
  };

  // 1-Click Excel / CSV Report Exporter with UTF-8 BOM for perfect Thai font rendering in Excel
  const exportQuotationsToExcel = (quotesToExport: QuotationDoc[]) => {
    if (!quotesToExport || quotesToExport.length === 0) {
      alert('ไม่มีข้อมูลใบเสนอราคาสำหรับการส่งออก');
      return;
    }

    const headers = [
      'เลขที่ใบเสนอราคา',
      'วันที่ออกเอกสาร',
      'ชื่อลูกค้า/หน่วยงาน',
      'เบอร์โทรศัพท์',
      'อีเมล',
      'วันที่จัดงาน',
      'เวลาเริ่มเสิร์ฟ',
      'สถานที่จัดงาน',
      'ประเภทงาน',
      'แพ็กเกจอาหาร',
      'ราคาต่อโต๊ะ (บาท)',
      'จำนวนโต๊ะที่สั่ง',
      'จำนวนโต๊ะแถมฟรี',
      'รวมจำนวนโต๊ะจัดเสิร์ฟ',
      'รายการอาหารที่เลือก',
      'แพ็กเกจเครื่องดื่ม',
      'ค่าบริการยกขึ้นชั้น',
      'ยอดรวมก่อนหักส่วนลด (บาท)',
      'ส่วนลด (บาท)',
      'ยอดรวมสุทธิ (บาท)',
      'ยอดเงินมัดจำ 30% (บาท)',
      'ยอดคงเหลือชำระวันงาน 70% (บาท)',
      'สถานะเอกสาร',
      'หมายเหตุเพิ่มเติม',
      'ลิงก์ Google Drive PDF'
    ];

    const rows = quotesToExport.map((q) => {
      const totalTables = (q.tableCount || 0) + (q.freeTableCount || 0);
      const dishesStr = q.selectedDishes?.map((d) => d.dishName).join(' / ') || '';
      const dateFormatted = q.createdAt ? new Date(q.createdAt).toLocaleDateString('th-TH') : '';
      const eventDateFormatted = q.customer?.eventDate || '';

      const statusThaiMap: Record<string, string> = {
        pending: 'รอยืนยันมัดจำ',
        deposit_paid: 'ชำระมัดจำ 30% แล้ว',
        confirmed: 'ยืนยันล็อกคิวงาน',
        completed: 'จัดเลี้ยงสำเร็จ',
        cancelled: 'ยกเลิก',
      };

      return [
        `"${q.quoteNo || ''}"`,
        `"${dateFormatted}"`,
        `"${(q.customer?.name || '').replace(/"/g, '""')}"`,
        `"${q.customer?.phone || ''}"`,
        `"${q.customer?.email || ''}"`,
        `"${eventDateFormatted}"`,
        `"${q.customer?.eventTime || ''}"`,
        `"${(q.customer?.eventLocation || '').replace(/"/g, '""')}"`,
        `"${(q.customer?.eventType || '').replace(/"/g, '""')}"`,
        `"${(q.package?.name || '').replace(/"/g, '""')}"`,
        q.package?.price || 0,
        q.tableCount || 0,
        q.freeTableCount || 0,
        totalTables,
        `"${dishesStr.replace(/"/g, '""')}"`,
        `"${(q.beverage?.name || '-').replace(/"/g, '""')}"`,
        q.floorService?.total || 0,
        q.subtotal || 0,
        q.discount || 0,
        q.grandTotal || 0,
        q.depositAmount || 0,
        q.finalAmount || 0,
        `"${statusThaiMap[q.status || 'pending'] || q.status || 'รอยืนยัน'}"`,
        `"${(q.customer?.notes || q.notes || '').replace(/"/g, '""')}"`,
        `"${q.pdfDriveUrl || ''}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const nowStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `รายงานใบเสนอราคา_โต๊ะจีนรพีพัฒน์_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveGasUrl = () => {
    localStorage.setItem('rapeephat_gas_url', gasUrl);
    setGasSaved(true);
    setTimeout(() => setGasSaved(false), 3000);
  };

  // Queue Management Handlers
  const handleSaveBookingPolicy = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const minT = parseInt(policyMinTables) || 10;
    const updated: BookingPolicy = {
      ...bookingPolicy,
      minTables: minT,
      closedReason: policyReason.trim() || 'กราบขออภัยเป็นอย่างยิ่งค่ะ ขณะนี้ทางร้านโต๊ะจีนรพีพัฒน์ของดรับงานจัดเลี้ยงชั่วคราวค่ะ',
      updatedAt: Date.now(),
    };
    QueueService.saveBookingPolicy(updated);
    setBookingPolicy(updated);
    setQueueSuccessMsg(`✓ บันทึกนโยบายการรับงานเรียบร้อยแล้วค่ะ (${updated.isAcceptingBookings ? `เปิดรับงานปกติ ขั้นต่ำ ${updated.minTables} โต๊ะ` : 'งดรับงานชั่วคราว'}) 🟢`);
    setTimeout(() => setQueueSuccessMsg(''), 4000);
  };

  const handleToggleAccepting = (isOpen: boolean) => {
    const updated: BookingPolicy = {
      ...bookingPolicy,
      isAcceptingBookings: isOpen,
      minTables: parseInt(policyMinTables) || 10,
      closedReason: policyReason.trim() || 'กราบขออภัยเป็นอย่างยิ่งค่ะ ขณะนี้ทางร้านโต๊ะจีนรพีพัฒน์ของดรับงานจัดเลี้ยงชั่วคราวค่ะ',
      updatedAt: Date.now(),
    };
    QueueService.saveBookingPolicy(updated);
    setBookingPolicy(updated);
    setQueueSuccessMsg(isOpen ? '✓ เปิดรับงานตามปกติเรียบร้อยแล้วค่ะ 🟢' : '✓ ปรับเป็น "งดรับงานชั่วคราว / ไม่รับงานเลย" เรียบร้อยแล้วค่ะ 🔴');
    setTimeout(() => setQueueSuccessMsg(''), 4000);
  };

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) {
      alert('กรุณาเลือกวันที่ต้องการระบุค่ะ');
      return;
    }
    const tableNum = newBlockedTableCount ? parseInt(newBlockedTableCount) : undefined;
    const defaultNote = newBlockedStatusType === 'available_capacity'
      ? `คิวงานยังไม่เต็มค่ะ (รับได้ตามจำนวน ${tableNum || 50} โต๊ะ)`
      : tableNum ? `คิวงานเต็ม (รับจัดเลี้ยง ${tableNum} โต๊ะ เต็มกำลัง)` : 'คิวงานเต็มทุกช่วงเวลา (งดรับจอง)';

    const entry = QueueService.addBlockedDate(
      newBlockedDate,
      newBlockedNote.trim() || defaultNote,
      newBlockedReason,
      tableNum,
      newBlockedStatusType
    );
    setBlockedDates([...QueueService.getBlockedDates()]);
    setNewBlockedDate('');
    setNewBlockedNote('');
    const msg = newBlockedStatusType === 'available_capacity'
      ? `✓ บันทึกวันที่ ${formatThaiDateShort(entry.date)} แจ้งว่า "งานไม่เต็ม รับได้ ${entry.tableCount || 50} โต๊ะ" เรียบร้อยแล้วค่ะ 🟢`
      : `✓ บันทึกวันที่ ${formatThaiDateShort(entry.date)} ${entry.tableCount ? `(รับ ${entry.tableCount} โต๊ะ)` : ''} เป็นวันคิวงานเต็มเรียบร้อยแล้วค่ะ 🔴`;
    setQueueSuccessMsg(msg);
    setTimeout(() => setQueueSuccessMsg(''), 4000);
  };

  const handleRemoveBlockedDate = (id: string, dateStr: string) => {
    if (!confirm(`ต้องการปลดล็อกคิววันที่ ${formatThaiDateShort(dateStr)} เพื่อเปิดรับจองตามปกติหรือไม่คะ?`)) return;
    QueueService.removeBlockedDate(id);
    setBlockedDates([...QueueService.getBlockedDates()]);
    setQueueSuccessMsg(`✓ ปลดล็อกคิววันที่ ${formatThaiDateShort(dateStr)} เรียบร้อยแล้วค่ะ`);
    setTimeout(() => setQueueSuccessMsg(''), 4000);
  };

  const handleQuickStatusChange = async (quote: QuotationDoc, newStatus: string) => {
    const updated: QuotationDoc = { ...quote, status: newStatus as any, updatedAt: Date.now() };
    try {
      await QuotationApi.update(updated);
    } catch {}
    setQuotations((prev) => prev.map((q) => (q.quoteNo === quote.quoteNo ? updated : q)));
    window.dispatchEvent(new Event('rapeephat_queue_updated'));
    setQueueSuccessMsg(
      newStatus === 'deposit_paid'
        ? `✓ ได้รับเงินมัดจำแล้วค่ะ! คิวงาน ${quote.quoteNo} ถูกแสดงบนตารางคิวหน้าเว็บเรียบร้อยแล้ว 🟢`
        : `✓ อัปเดตสถานะ ${quote.quoteNo} เรียบร้อยแล้วค่ะ`
    );
    setTimeout(() => setQueueSuccessMsg(''), 4000);
  };

  // Calculate Metrics
  const totalQuotations = quotations.length;
  const totalRevenue = quotations.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
  const totalDeposit = quotations.reduce((acc, q) => acc + (q.depositAmount || 0), 0);
  const totalTables = quotations.reduce((acc, q) => acc + (q.tableCount || 0), 0);
  
  const pendingCount = quotations.filter((q) => !q.status || q.status === 'pending').length;
  const depositPaidCount = quotations.filter((q) => q.status === 'deposit_paid').length;
  const confirmedCount = quotations.filter((q) => q.status === 'confirmed').length;
  const completedCount = quotations.filter((q) => q.status === 'completed').length;

  const filteredQuotes = quotations.filter((q) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return !q.status || q.status === 'pending';
    return q.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-luxury-mesh text-slate-900 font-sans pb-16 relative">
      
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900 tracking-tight">
                  ระบบจัดการหลังบ้าน (Admin Portal)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black shadow-sm">
                  LIVE SYSTEM
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                โต๊ะจีน รพีพัฒน์ พรีเมียม • แดชบอร์ดบริหารจัดการใบเสนอราคาและคิวจัดเลี้ยง
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setActiveTab('quotations')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'quotations'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>ใบเสนอราคา</span>
              </button>

              <button
                onClick={() => setActiveTab('queue_manager')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 relative ${
                  activeTab === 'queue_manager'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>จัดการคิวงาน & วันคิวเต็ม</span>
                {blockedDates.length > 0 && (
                  <span className="bg-red-700 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full leading-none border border-white/40">
                    {blockedDates.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('chat_leads');
                  try {
                    setChatLeads(JSON.parse(localStorage.getItem('rapeephat_chat_leads') || '[]'));
                  } catch {}
                }}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 relative ${
                  activeTab === 'chat_leads'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>ลูกค้าแชทสด</span>
                {chatLeads.length > 0 && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full leading-none">
                    {chatLeads.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('packages')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'packages'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>แพ็กเกจอาหาร</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>ตั้งค่า Cloud / GAS</span>
              </button>
            </div>

            {/* Back to Website Button */}
            <button
              onClick={onBackToSite}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>กลับสู่หน้าเว็บไซต์</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 relative z-10">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Total Revenue */}
          <div className="p-6 rounded-3xl bg-white border border-red-200 shadow-md space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-700 uppercase">ยอดคำนวณรวมทั้งหมด</span>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              มัดจำ 30% รวม: <strong className="text-red-700 font-bold">{formatCurrency(totalDeposit)}</strong>
            </div>
          </div>

          {/* Total Tables */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">จำนวนโต๊ะจัดเลี้ยง</span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalTables.toLocaleString()} <span className="text-sm text-slate-500 font-normal">โต๊ะ</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              รองรับแขกประมาณ <strong className="text-slate-800">{(totalTables * 10).toLocaleString()}</strong> ท่าน
            </div>
          </div>

          {/* Total Quotations */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">ใบเสนอราคาที่ออก</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalQuotations} <span className="text-sm text-slate-500 font-normal">ฉบับ</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              เฉลี่ย ฿{totalQuotations > 0 ? Math.round(totalRevenue / totalQuotations).toLocaleString() : 0} / งาน
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">สถานะคิวงาน</span>
              <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 border border-green-200 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                <span>รอยืนยัน:</span>
                <span className="font-bold">{pendingCount}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-green-50 text-green-800 border border-green-200 font-medium">
                <span>มัดจำแล้ว:</span>
                <span className="font-bold">{depositPaidCount + confirmedCount}</span>
              </div>
            </div>
          </div>

        </div>

        {/* TAB 1: Quotations Management Table */}
        {activeTab === 'quotations' && (
          <div className="space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Search Box (Strict Bottom-Aligned Box) */}
              <div className="flex-1 flex flex-col justify-end h-full">
                <label className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-red-600" />
                  <span>ค้นหาใบเสนอราคา (เลขที่เอกสาร, ชื่อลูกค้า, หรือเบอร์โทรศัพท์):</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="พิมพ์ QT..., ชื่อลูกค้า, สถานที่ หรือเบอร์โทร..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 font-medium"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-col justify-end h-full">
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-red-600" />
                  <span>กรองสถานะ:</span>
                </label>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto text-xs">
                  {[
                    { id: 'all', name: `ทั้งหมด (${quotations.length})` },
                    { id: 'pending', name: `รอยืนยัน (${pendingCount})` },
                    { id: 'deposit_paid', name: `ชำระมัดจำแล้ว (${depositPaidCount})` },
                    { id: 'confirmed', name: `ยืนยันคิวแล้ว (${confirmedCount})` },
                    { id: 'completed', name: `สำเร็จ (${completedCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all ${
                        statusFilter === tab.id
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Excel Export & Refresh */}
              <div className="flex items-center gap-2">
                {/* 1-Click Excel Export Button */}
                <button
                  type="button"
                  onClick={() => exportQuotationsToExcel(filteredQuotes)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white flex items-center justify-center gap-2 text-xs font-black shadow-md transition-all border border-emerald-500 transform hover:scale-102"
                  title="ส่งออกรายงานใบเสนอราคาทั้งหมดเป็นไฟล์ Excel (.csv รองรับภาษาไทย 100%)"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                  <span>ส่งออก Excel ({filteredQuotes.length})</span>
                </button>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={fetchQuotations}
                  className="p-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                  title="รีเฟรชรายการ"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-red-600' : ''}`} />
                  <span className="hidden sm:inline">รีเฟรช</span>
                </button>
              </div>

            </div>

            {/* Quotations Table */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">เลขที่เอกสาร / วันที่</th>
                      <th className="p-4">ข้อมูลลูกค้า & สถานที่จัดงาน</th>
                      <th className="p-4">แพ็กเกจ & จำนวนโต๊ะ</th>
                      <th className="p-4 text-right">ยอดสุทธิ / มัดจำ 30%</th>
                      <th className="p-4 text-center">สถานะการจอง</th>
                      <th className="p-4 text-center">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredQuotes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-400">
                          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                          <div className="text-sm font-bold text-slate-600">ไม่พบใบเสนอราคาที่ค้นหา</div>
                        </td>
                      </tr>
                    ) : (
                      filteredQuotes.map((quote) => (
                        <tr key={quote.quoteNo} className="hover:bg-slate-50 transition-colors">
                          
                          {/* Quote No & Date */}
                          <td className="p-4 space-y-1">
                            <div className="font-mono text-sm font-black text-red-600">
                              {quote.quoteNo}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              ออกเมื่อ: {formatThaiDate(quote.createdAt)}
                            </div>
                          </td>

                          {/* Customer & Location */}
                          <td className="p-4 space-y-1">
                            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span>{quote.customer?.name}</span>
                              <a
                                href={`tel:${quote.customer?.phone}`}
                                className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                              >
                                <Phone className="w-3 h-3" /> {quote.customer?.phone}
                              </a>
                            </div>
                            <div className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                              <span>วันจัดงาน:</span>
                              <strong className="text-slate-900 font-bold">{formatThaiDate(quote.customer?.eventDate)}</strong>
                              <span>({quote.customer?.eventTime || 'ช่วงเย็น'})</span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-xs font-medium">
                              📍 {quote.customer?.eventLocation}
                            </div>
                            {quote.notes && (
                              <div className="text-[10px] text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded-lg border border-red-200 inline-block">
                                หมายเหตุ: {quote.notes}
                              </div>
                            )}
                          </td>

                          {/* Package & Tables */}
                          <td className="p-4 space-y-1">
                            <div className="font-bold text-slate-900 text-xs">{quote.package?.name}</div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-xs">
                                {quote.tableCount} โต๊ะ
                              </span>
                              {quote.freeTableCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-bold text-[10px] border border-green-200">
                                  +แถม {quote.freeTableCount} โต๊ะ
                                </span>
                              )}
                            </div>
                            {quote.beverage && quote.beverage.pricePerTable > 0 && (
                              <div className="text-[10px] text-slate-500 font-medium">
                                + {quote.beverage.name}
                              </div>
                            )}
                          </td>

                          {/* Total & Deposit */}
                          <td className="p-4 text-right space-y-0.5">
                            <div className="text-base font-black text-red-600">
                              {formatCurrency(quote.grandTotal)}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium">
                              มัดจำ: <strong className="text-slate-900 font-bold">{formatCurrency(quote.depositAmount)}</strong>
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              วันงาน: {formatCurrency(quote.finalAmount)}
                            </div>
                          </td>

                          {/* Status Dropdown */}
                          <td className="p-4 text-center">
                            <select
                              value={quote.status || 'pending'}
                              onChange={(e) => handleStatusChange(quote, e.target.value)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border focus:outline-none cursor-pointer transition-all ${
                                quote.status === 'confirmed' || quote.status === 'deposit_paid'
                                  ? 'bg-green-50 text-green-800 border-green-300'
                                  : quote.status === 'completed'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : quote.status === 'cancelled'
                                  ? 'bg-red-50 text-red-800 border-red-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="pending">รอยืนยันมัดจำ</option>
                              <option value="deposit_paid">ชำระมัดจำ 30% แล้ว</option>
                              <option value="confirmed">ยืนยันล็อกคิวงาน</option>
                              <option value="completed">จัดเลี้ยงสำเร็จ</option>
                              <option value="cancelled">ยกเลิก</option>
                            </select>
                          </td>

                          {/* Action Buttons */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Print Contract Button */}
                              <button
                                onClick={() => setContractQuote(quote)}
                                className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all border ${
                                  quote.status === 'deposit_paid' || quote.status === 'confirmed'
                                    ? 'bg-amber-50 hover:bg-amber-500 text-amber-900 hover:text-white border-amber-300 shadow-2xs'
                                    : 'bg-slate-50 hover:bg-slate-200 text-slate-700 border-slate-200'
                                }`}
                                title="พิมพ์สัญญาจ้างงานจัดเลี้ยงโต๊ะจีน (A4)"
                              >
                                <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                                <span className="hidden xl:inline">สัญญาจ้าง</span>
                              </button>

                              {/* Print 30% Deposit Receipt Button */}
                              <button
                                onClick={() => {
                                  setReceiptType('deposit_30');
                                  setReceiptQuote(quote);
                                }}
                                className={`px-2 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all border ${
                                  quote.status === 'deposit_paid' || quote.status === 'confirmed'
                                    ? 'bg-emerald-50 hover:bg-emerald-600 text-emerald-900 hover:text-white border-emerald-300 shadow-2xs'
                                    : 'bg-slate-50 hover:bg-slate-200 text-slate-700 border-slate-200'
                                }`}
                                title="พิมพ์ใบเสร็จรับเงินมัดจำ 30% (A4)"
                              >
                                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="hidden xl:inline">ใบเสร็จ 30%</span>
                              </button>

                              {/* Print 70% Final Settlement Receipt Button */}
                              <button
                                onClick={() => {
                                  setReceiptType('final_70');
                                  setReceiptQuote(quote);
                                }}
                                className="px-2 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-900 hover:text-white font-bold text-xs flex items-center gap-1 transition-all border border-blue-300 shadow-2xs"
                                title="พิมพ์ใบเสร็จรับเงินยอดคงเหลือ 70% / ปิดงาน (A4)"
                              >
                                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                                <span className="hidden xl:inline">ใบเสร็จ 70%</span>
                              </button>

                              {/* Edit Quotation & Re-generate PDF Button */}
                              <button
                                onClick={() => setEditingQuote(quote)}
                                className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-800 hover:text-white font-bold text-xs flex items-center gap-1 transition-all border border-blue-200 shadow-2xs"
                                title="แก้ไขข้อมูลใบเสนอราคา / แก้ไขรายละเอียดเพื่อออก PDF ใหม่"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-blue-600 group-hover:text-white" />
                                <span>แก้ไข</span>
                              </button>

                              {/* Open A4 Full Quotation */}
                              <button
                                onClick={() => setActiveQuote(quote)}
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white font-bold transition-all border border-red-200"
                                title="เปิดดูใบเสนอราคา A4"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Google Drive Link */}
                              {quote.pdfDriveUrl ? (
                                <a
                                  href={quote.pdfDriveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white transition-colors border border-blue-200"
                                  title="เปิดไฟล์ PDF บน Google Drive"
                                >
                                  <CloudUpload className="w-4 h-4" />
                                </a>
                              ) : (
                                <span className="p-2 text-slate-300" title="ยังไม่มีไฟล์ Drive">
                                  <CloudUpload className="w-4 h-4 opacity-25" />
                                </span>
                              )}

                              {/* Edit Note */}
                              <button
                                onClick={() => {
                                  setEditingNoteQuote(quote);
                                  setTempNote(quote.notes || '');
                                }}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                                title="แก้ไขบันทึกภายใน"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(quote)}
                                className="p-2 rounded-xl bg-slate-50 hover:bg-red-100 text-slate-400 hover:text-red-600"
                                title="ลบ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Live Chat & Real-Time Operator Room */}
        {activeTab === 'chat_leads' && (
          <div className="space-y-6">
            
            {/* Top Status & Sub-Navigation Bar */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center shadow-md">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      ศูนย์รับแชทสด & ข้อมูลลูกค้าเรียลไทม์
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      คุณแป้งกำลังออนไลน์ (LIVE)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    เมื่อคุณเปิดหน้านี้อยู่ ลูกค้าบนหน้าเว็บจะเห็นว่าเจ้าของร้านออนไลน์ และสามารถพิมพ์คุยตอบโต้กันได้ทันที
                  </p>
                </div>
              </div>

              {/* Sub-view Switcher & Desktop Notification Toggle */}
              <div className="flex flex-wrap items-center gap-2.5">
                
                {/* Desktop Notification Toggle */}
                <button
                  onClick={async () => {
                    const res = await chatSync.requestNotificationPermission();
                    setNotifPermission(res);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border shadow-sm ${
                    notifPermission === 'granted'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white border-transparent animate-pulse shadow-md'
                  }`}
                  title="แจ้งเตือนป๊อปอัปบนหน้าจอคอมพิวเตอร์เมื่อย่อหน้าจอหรือเปิดแท็บอื่น"
                >
                  <Bell className={`w-4 h-4 ${notifPermission === 'granted' ? 'text-emerald-600' : 'text-white animate-bounce'}`} />
                  <span>
                    {notifPermission === 'granted'
                      ? 'เปิดป๊อปอัปแจ้งเตือนเวลาพับหน้าจอแล้ว 🔔'
                      : 'กดเปิดป๊อปอัปแจ้งเตือนเวลาพับจอ 🔔'}
                  </span>
                </button>

                <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center gap-1 text-xs font-bold">
                  <button
                    onClick={() => setChatSubView('live_room')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      chatSubView === 'live_room'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>ห้องสนทนาสด ({chatSessions.length})</span>
                  </button>

                  <button
                    onClick={() => setChatSubView('leads_table')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      chatSubView === 'leads_table'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>ลูกค้าฝากเบอร์ ({chatLeads.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* VIEW A: Real-Time Two-Way Live Chat Operator Room */}
            {chatSubView === 'live_room' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid md:grid-cols-12 min-h-[580px]">
                
                {/* Left Pane: Customer Sessions List (4 Cols) */}
                <div className={`md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50 ${selectedSessionId ? 'hidden md:flex' : 'flex'}`}>
                  <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      รายการลูกค้าที่กำลังแชท ({chatSessions.length})
                    </span>
                    <button
                      onClick={() => setChatSessions(chatSync.getAllSessions())}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="รีเฟรชรายการ"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[500px] md:max-h-none">
                    {chatSessions.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                        <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                        <p>ยังไม่มีข้อความแชทใหม่</p>
                        <p className="text-[11px] text-slate-400">เมื่อลูกค้าทักแชทหน้าเว็บ รายชื่อจะปรากฏตรงนี้ทันที</p>
                      </div>
                    ) : (
                      chatSessions.map((session) => (
                        <div
                          key={session.id}
                          onClick={() => handleSelectSession(session.id)}
                          className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 ${
                            selectedSessionId === session.id
                              ? 'bg-red-50/80 border-l-4 border-red-600 shadow-2xs'
                              : 'hover:bg-slate-100/80'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-300 text-red-700 font-black text-xs flex items-center justify-center shrink-0">
                            {(session?.customerName || 'ลูกค้า').substring(0, 2)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-black text-slate-900 truncate">
                                {session?.customerName || 'ลูกค้า'}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {session?.lastMessageTime || ''}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                              {session?.lastMessage || ''}
                            </p>
                          </div>

                          {(session?.unreadByOwner || 0) > 0 && (
                            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs">
                              {session.unreadByOwner}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Pane: Active Conversation Console (8 Cols) */}
                <div className="md:col-span-8 flex flex-col bg-[#FFFDF9] flex-1">
                  {(() => {
                    const session = (chatSessions && chatSessions.find((s) => s.id === selectedSessionId)) || (chatSessions && chatSessions[0]);
                    const currentMessages = Array.isArray(session?.messages) ? session.messages : [];

                    return (
                      <>
                        {/* Chat Room Top Bar */}
                        <div className="p-3.5 px-4 sm:px-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                          <div className="flex items-center gap-2.5">
                            {/* Mobile Back to List Button */}
                            <button
                              onClick={() => setSelectedSessionId(null)}
                              className="md:hidden px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                            >
                              <span>← รายชื่อ</span>
                            </button>

                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-red-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs">
                              {(session?.customerName || 'ลูกค้า').substring(0, 2)}
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                                <span>{session?.customerName || 'ลูกค้า (แชทสด)'}</span>
                                <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[9px] font-bold">
                                  ออนไลน์
                                </span>
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono">
                                ID: {session?.id || 'room_main'}
                              </p>
                            </div>
                          </div>

                            <button
                              onClick={() => {
                                if (confirm('ต้องการลบการสนทนานี้ใช่หรือไม่?')) {
                                  const updated = chatSessions.filter((s) => s.id !== selectedSessionId);
                                  localStorage.setItem('rapeephat_chat_sessions_v2', JSON.stringify(updated));
                                  setChatSessions(updated);
                                  setSelectedSessionId(null);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                              title="ลบแชทนี้"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Chat Message Scrollable Feed */}
                          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 text-xs">
                            {currentMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex flex-col ${msg.sender === 'owner' ? 'items-end' : 'items-start'}`}
                              >
                                <span className="text-[10px] text-slate-400 font-bold mb-1 px-1 flex items-center gap-1">
                                  {msg.sender === 'owner' && (
                                    <span className="text-amber-600 font-black flex items-center gap-0.5">
                                      <Crown className="w-3 h-3 text-amber-600" />
                                      คุณแป้ง:
                                    </span>
                                  )}
                                  {msg.sender === 'customer' && `ลูกค้า (${msg.senderName}):`}
                                  {msg.sender === 'bot' && 'ระบบผู้ช่วยอัตโนมัติ:'}
                                </span>

                                <div
                                  className={`max-w-[80%] rounded-2xl p-3.5 space-y-1 shadow-xs ${
                                    msg.sender === 'owner'
                                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-br-xs'
                                      : msg.sender === 'customer'
                                      ? 'bg-white border-2 border-red-200 text-slate-950 font-bold rounded-bl-xs'
                                      : 'bg-slate-100 border border-slate-200 text-slate-700 rounded-bl-xs'
                                  }`}
                                >
                                  <p className="whitespace-pre-line leading-relaxed font-medium">
                                    {msg.text}
                                  </p>
                                  <div
                                    className={`text-[9.5px] font-bold text-right pt-0.5 ${
                                      msg.sender === 'owner' ? 'text-red-200' : 'text-slate-400'
                                    }`}
                                  >
                                    {msg.timestamp}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Quick Reply Suggestions for Owner */}
                          <div className="px-4 py-2 bg-amber-50/60 border-t border-amber-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                            <button
                              onClick={() => handleSendOwnerReply('สวัสดีค่ะ โต๊ะจีนรพีพัฒน์ยินดีดูแลค่ะ สนใจจัดเลี้ยงกี่โต๊ะคะ 😊')}
                              className="px-3 py-1 rounded-full bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 border border-amber-300 font-bold text-[10.5px] whitespace-nowrap shadow-2xs transition-colors shrink-0"
                            >
                              👋 ทักทายต้อนรับ
                            </button>
                            <button
                              onClick={() => handleSendOwnerReply('วันที่ลูกค้าสอบถาม มีคิวว่างพร้อมดูแลได้เลยนะคะ สามารถล็อกคิวได้เลยค่ะ ✨')}
                              className="px-3 py-1 rounded-full bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 border border-amber-300 font-bold text-[10.5px] whitespace-nowrap shadow-2xs transition-colors shrink-0"
                            >
                              📅 แจ้งคิวว่าง
                            </button>
                            <button
                              onClick={() => handleSendOwnerReply('แพ็กเกจยอดนิยมเริ่มต้น 1,400.- ฟรีโต๊ะ เก้าอี้ ผ้าคลุมผูกโบว์ และบริกรครบชุดค่ะ')}
                              className="px-3 py-1 rounded-full bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 border border-amber-300 font-bold text-[10.5px] whitespace-nowrap shadow-2xs transition-colors shrink-0"
                            >
                              🍽️ แนะนำแพ็กเกจ
                            </button>
                            <button
                              onClick={() => handleSendOwnerReply('รบกวนขอทราบสถานที่จัดงาน และเบอร์โทรศัพท์ติดต่อกลับด้วยนะคะ เดี๋ยวแป้งโทรคุยรายละเอียดให้ค่ะ 📞')}
                              className="px-3 py-1 rounded-full bg-white hover:bg-amber-50 text-amber-900 border border-amber-400 font-black text-[10.5px] whitespace-nowrap shadow-2xs transition-colors shrink-0"
                            >
                              📞 ขอเบอร์โทรกลับ
                            </button>
                          </div>

                          {/* Owner Message Input Box */}
                          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                            <input
                              type="text"
                              placeholder="พิมพ์ข้อความตอบกลับลูกค้าในฐานะคุณแป้ง..."
                              value={ownerReplyText}
                              onChange={(e) => setOwnerReplyText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendOwnerReply();
                              }}
                              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-xs font-medium"
                            />

                            <button
                              type="button"
                              onClick={() => handleSendOwnerReply()}
                              disabled={!ownerReplyText.trim()}
                              className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all ${
                                ownerReplyText.trim()
                                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md transform hover:scale-105 active:scale-95'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <Send className="w-4 h-4" />
                              <span>ส่งตอบกลับ</span>
                            </button>
                          </div>
                        </>
                      );
                    })()}
                </div>

              </div>
            )}

            {/* VIEW B: Lead Capture Table */}
            {chatSubView === 'leads_table' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    รายการลูกค้าที่กด "ฝากเบอร์โทรกลับ" ทั้งหมด ({chatLeads.length} ท่าน)
                  </span>

                  {chatLeads.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('ต้องการล้างประวัติข้อมูลลูกค้าฝากเบอร์ทั้งหมดใช่หรือไม่?')) {
                          localStorage.removeItem('rapeephat_chat_leads');
                          setChatLeads([]);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ล้างประวัติ</span>
                    </button>
                  )}
                </div>

                {chatLeads.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
                    <Phone className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="text-base font-bold text-slate-800">ยังไม่มีข้อมูลลูกค้าที่ฝากเบอร์ในขณะนี้</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      เมื่อลูกค้าเข้ามาคุยในระบบ Live Chat หน้าเว็บและฝากเบอร์โทรศัพท์ไว้ ข้อมูลจะปรากฏในหน้านี้ทันทีแบบเรียลไทม์
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black uppercase text-[11px]">
                            <th className="p-4">ลำดับ</th>
                            <th className="p-4">ชื่อลูกค้า</th>
                            <th className="p-4">เบอร์โทรศัพท์</th>
                            <th className="p-4">จำนวนโต๊ะ / วันที่จัดงาน</th>
                            <th className="p-4">เวลาที่ส่ง</th>
                            <th className="p-4 text-center">การจัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {chatLeads.map((lead, idx) => (
                            <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                              <td className="p-4 font-bold text-slate-500">{idx + 1}</td>
                              <td className="p-4 font-black text-slate-900 text-sm">
                                {lead.name || 'ลูกค้าหน้าเว็บ'}
                              </td>
                              <td className="p-4">
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="font-mono font-black text-red-700 hover:text-red-900 flex items-center gap-1.5 text-sm"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>{lead.phone}</span>
                                </a>
                              </td>
                              <td className="p-4 font-medium text-slate-700">
                                {lead.tables || lead.rawText || '-'}
                              </td>
                              <td className="p-4 text-slate-500 font-medium">
                                {lead.createdAt || lead.time ? new Date(lead.createdAt || lead.time).toLocaleString('th-TH') : '-'}
                              </td>
                              <td className="p-4 text-center">
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="px-3.5 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>โทรกลับ</span>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* TAB: Queue & Blocked Dates Management */}
        {activeTab === 'queue_manager' && (
          <div className="space-y-6">
            
            {/* Header & Explanation */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase">
                    LIVE QUEUE CONTROL
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    เชื่อมต่อหน้าเว็บสด
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  📅 ระบบจัดการคิวงาน & วันที่คิวเต็ม (Queue Manager)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  ใส่วันที่คิวงานเต็มเพื่อให้ระบบแจ้งเตือนลูกค้าบนหน้าเว็บทันที และติดตามรายการที่ได้รับมัดจำแล้วเพื่อแสดงผลบนตารางคิวงานสด
                </p>
              </div>

              {/* Stat Counters */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3 px-4 rounded-2xl bg-red-50 border border-red-200 text-center">
                  <div className="text-xs font-bold text-red-700">วันที่คิวเต็ม (บล็อก)</div>
                  <div className="text-xl font-black text-red-900">{blockedDates.length} วัน</div>
                </div>
                <div className="p-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-xs font-bold text-emerald-700">มัดจำล็อกคิวแล้ว</div>
                  <div className="text-xl font-black text-emerald-900">{depositPaidCount + confirmedCount} งาน</div>
                </div>
              </div>
            </div>

            {/* Notification Message */}
            {queueSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 font-bold text-sm flex items-center gap-2 shadow-sm animate-fadeIn">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{queueSuccessMsg}</span>
              </div>
            )}

            {/* Section 0: Booking Policy & Minimum Tables Settings (นโยบายการรับงาน & กำหนดขั้นต่ำ) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 text-white shadow-xl space-y-6 border border-red-900/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-black text-amber-400">
                      ⚙️ นโยบายการรับงานจัดเลี้ยง & กำหนดขั้นต่ำ (Booking Policy)
                    </h4>
                    <p className="text-xs text-slate-300 font-medium">
                      ตั้งค่าสถานะการรับงานของร้าน (เปิดรับปกติ หรือ งดรับงานชั่วคราว) และกำหนดจำนวนโต๊ะขั้นต่ำที่รับ
                    </p>
                  </div>
                </div>

                {/* Status Indicator Badge */}
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm flex items-center gap-2 ${
                    bookingPolicy.isAcceptingBookings
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${bookingPolicy.isAcceptingBookings ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                    {bookingPolicy.isAcceptingBookings ? 'สถานะ: เปิดรับงานตามปกติ 🟢' : 'สถานะ: ไม่รับงานเลย (งดรับชั่วคราว) 🔴'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveBookingPolicy} className="grid md:grid-cols-12 gap-6 items-end">
                {/* 1. Accepting Mode Toggle */}
                <div className="md:col-span-4 space-y-2">
                  <label className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <span>1. สถานะการเปิดรับงานจัดเลี้ยง:</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => handleToggleAccepting(true)}
                      className={`py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        bookingPolicy.isAcceptingBookings
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>เปิดรับงานปกติ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleAccepting(false)}
                      className={`py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        !bookingPolicy.isAcceptingBookings
                          ? 'bg-red-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 text-amber-200" />
                      <span>ไม่รับงานเลย 🔴</span>
                    </button>
                  </div>
                </div>

                {/* 2. Minimum Table Count */}
                <div className="md:col-span-4 space-y-2">
                  <label className="text-xs font-black text-amber-300 flex items-center justify-between">
                    <span>2. รับจัดเลี้ยงขั้นต่ำกี่โต๊ะขึ้นไป:</span>
                    <span className="text-[11px] text-slate-400 font-normal">ปัจจุบัน: ขั้นต่ำ {bookingPolicy.minTables || 10} โต๊ะ</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={policyMinTables}
                      onChange={(e) => setPolicyMinTables(e.target.value)}
                      placeholder="เช่น 5, 10, 20, 30"
                      className="w-full bg-white/10 border-2 border-white/20 hover:border-amber-400 focus:border-amber-400 rounded-2xl px-4 py-2 text-sm text-white font-black pr-16 focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-300">
                      โต๊ะขึ้นไป
                    </span>
                  </div>
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {[5, 10, 15, 20, 30, 50].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPolicyMinTables(t.toString())}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                          policyMinTables === t.toString()
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-black'
                            : 'bg-white/5 hover:bg-white/15 text-slate-300 border-white/10'
                        }`}
                      >
                        {t} โต๊ะ
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Reason & Save Button */}
                <div className="md:col-span-4 space-y-2">
                  <label className="text-xs font-black text-amber-300">
                    3. ข้อความแจ้งเตือนเมื่อปิดรับงาน:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={policyReason}
                      onChange={(e) => setPolicyReason(e.target.value)}
                      placeholder="เช่น กราบขออภัยค่ะ ขณะนี้ทางร้านของดรับงานชั่วคราวค่ะ"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 shadow-md transition-transform hover:scale-102 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>บันทึก</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Section 1: Add / Manage Blocked Dates (วันที่คิวงานเต็ม) */}
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Add Blocked Date Form Card */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">จัดการวันที่คิวงาน & ความพร้อมรับงาน</h4>
                    <p className="text-[11px] text-slate-500 font-medium">ระบุวันคิวเต็ม หรือระบุวันพิเศษที่ยังรับงานได้ตามจำนวนโต๊ะที่กำหนด</p>
                  </div>
                </div>

                <form onSubmit={handleAddBlockedDate} className="space-y-3.5">
                  {/* Status Mode Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      เลือกสถานะที่จะแสดงบนหน้าเว็บ:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewBlockedStatusType('fully_booked');
                          setNewBlockedReason('fully_booked');
                        }}
                        className={`py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                          newBlockedStatusType === 'fully_booked'
                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>🔴 คิวงานเต็ม</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewBlockedStatusType('available_capacity');
                          setNewBlockedReason('available_capacity');
                          if (!newBlockedTableCount || newBlockedTableCount === '80') setNewBlockedTableCount('50');
                        }}
                        className={`py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                          newBlockedStatusType === 'available_capacity'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>🟢 งานไม่เต็ม (รับได้)</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-red-600" />
                      <span>เลือกวันที่ต้องการจัดการ <span className="text-red-600">*</span></span>
                    </label>
                    <input
                      type="date"
                      required
                      value={newBlockedDate}
                      onChange={(e) => setNewBlockedDate(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-red-600 cursor-pointer"
                    />
                  </div>

                  {/* Table Count Input with Quick Presets */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-red-600" />
                        <span>{newBlockedStatusType === 'available_capacity' ? 'จำนวนโต๊ะที่ยังเปิดรับได้ในวันนี้:' : 'จำนวนโต๊ะที่รับจัดเลี้ยงในวันนี้:'}</span>
                      </label>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        newBlockedStatusType === 'available_capacity'
                          ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                          : 'text-red-700 bg-red-50 border-red-200'
                      }`}>
                        {newBlockedStatusType === 'available_capacity' ? 'ระบุว่ารับได้กี่โต๊ะ' : 'ระบุจำนวนที่รับเต็ม'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={newBlockedTableCount}
                        onChange={(e) => setNewBlockedTableCount(e.target.value)}
                        placeholder="เช่น 30, 50, 80, 100"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-black focus:outline-none focus:border-red-600 pr-12"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                        โต๊ะ
                      </span>
                    </div>
                    
                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[20, 30, 50, 60, 80, 100, 120, 150, 200].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewBlockedTableCount(t.toString())}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                            newBlockedTableCount === t.toString()
                              ? (newBlockedStatusType === 'available_capacity' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-red-600 text-white border-red-600 shadow-xs')
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          }`}
                        >
                          {t} โต๊ะ
                        </button>
                      ))}
                    </div>
                  </div>

                  {newBlockedStatusType === 'fully_booked' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        เหตุผล / ประเภทการล็อกคิว:
                      </label>
                      <select
                        value={newBlockedReason}
                        onChange={(e) => setNewBlockedReason(e.target.value as any)}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-red-600 cursor-pointer"
                      >
                        <option value="fully_booked">🔴 คิวงานเต็มทุกช่วงเวลา (งานแต่ง/งานใหญ่)</option>
                        <option value="maintenance">🛠️ ซ่อมบำรุงอุปกรณ์ / ปรับปรุงโรงครัว</option>
                        <option value="holiday">🏖️ วันหยุดเทศกาล / ประจำปี</option>
                        <option value="custom">🔒 ล็อกคิวเฉพาะกิจ</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      หมายเหตุเพิ่มเติม (แสดงบนหน้าเว็บ):
                    </label>
                    <input
                      type="text"
                      value={newBlockedNote}
                      onChange={(e) => setNewBlockedNote(e.target.value)}
                      placeholder={
                        newBlockedStatusType === 'available_capacity'
                          ? `เช่น คิวงานไม่เต็มค่ะ พร้อมเปิดรับจัดเลี้ยงได้ตามจำนวน ${newBlockedTableCount || 50} โต๊ะ`
                          : 'เช่น งานมงคลสมรสหอประชุมใหญ่ หรือ งานทำบุญขึ้นบ้านใหม่'
                      }
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer ${
                      newBlockedStatusType === 'available_capacity'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {newBlockedStatusType === 'available_capacity'
                        ? '+ บันทึกแจ้ง "งานไม่เต็ม รับได้ตามจำนวน" (อัปเดตทันที)'
                        : '+ บันทึกวันคิวงานเต็ม (อัปเดตหน้าเว็บทันที)'}
                    </span>
                  </button>
                </form>
              </div>

              {/* Blocked Dates List Card */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">รายการวันที่ควบคุมคิวงานทั้งหมด ({blockedDates.length} วัน)</h4>
                      <p className="text-[11px] text-slate-500 font-medium">วันที่เหล่านี้จะแสดงสถานะคิวเต็มหรือสถานะรับได้ตามจำนวนบนหน้าเว็บ</p>
                    </div>
                  </div>
                </div>

                <div className="max-h-[440px] overflow-y-auto space-y-2.5 pr-1">
                  {blockedDates.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      ยังไม่มีการระบุวันคิวงาน สามารถเพิ่มวันที่ได้จากฟอร์มด้านซ้าย
                    </div>
                  ) : (
                    blockedDates.map((item) => {
                      const isAvail = item.statusType === 'available_capacity' || item.reason === 'available_capacity';
                      return (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-2xl border transition-colors flex items-center justify-between gap-3 ${
                            isAvail
                              ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400'
                              : 'bg-slate-50 border-slate-200 hover:border-red-300'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md font-mono font-black text-xs border ${
                                isAvail ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-red-100 text-red-800 border-red-200'
                              }`}>
                                {item.date}
                              </span>
                              <span className="text-xs font-black text-slate-900">
                                {getDayOfWeekThai(item.date)}ที่ {formatThaiDateShort(item.date)}
                              </span>
                              {isAvail ? (
                                <span className="px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1">
                                  <span>งานไม่เต็ม 🟢</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                                  คิวเต็ม 🔴
                                </span>
                              )}
                              {item.tableCount && (
                                <span className={`px-2 py-0.2 rounded-full text-[10px] font-black border ${
                                  isAvail ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                                }`}>
                                  {isAvail ? `🎪 รับได้ ${item.tableCount} โต๊ะ` : `🎪 รับแล้ว ${item.tableCount} โต๊ะ (เต็มกำลัง)`}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-600 font-medium">
                              • {item.note || (isAvail ? `งานไม่เต็มค่ะ (รับได้ ${item.tableCount || 50} โต๊ะ)` : 'คิวงานเต็มทุกช่วงเวลา')}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveBlockedDate(item.id, item.date)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-100 hover:text-red-700 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs border border-slate-200"
                            title="ลบรายการเพื่อกลับเป็นคิวปกติ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ลบ</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* Section 2: Deposit Paid Bookings Live on Website */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">
                      รายการคิวงานที่ได้รับเงินมัดจำแล้ว & แสดงผลบนหน้าเว็บ (Live Queue)
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      คิวงานด้านล่างจะถูกนำไปแสดงผลบน "ตารางคิวงานจัดเลี้ยงมงคล" หน้าเว็บเพื่อเพิ่มความน่าเชื่อถือ (ระบบจะซ่อนชื่อจริงโดยอัตโนมัติ)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">แสดงทั้งหมด:</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300">
                    {quotations.filter((q) => q.status === 'deposit_paid' || q.status === 'confirmed').length} รายการ
                  </span>
                </div>
              </div>

              {/* Table of Paid Bookings */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-black">
                      <th className="p-3.5">เลขที่ / วันที่จัดงาน</th>
                      <th className="p-3.5">ชื่อเจ้าภาพ & เบอร์โทร</th>
                      <th className="p-3.5">ประเภทงาน & สถานที่</th>
                      <th className="p-3.5 text-center">จำนวนโต๊ะ</th>
                      <th className="p-3.5 text-right">ยอดมัดจำ 30%</th>
                      <th className="p-3.5 text-center">สถานะหน้าเว็บ</th>
                      <th className="p-3.5 text-center">ปรับสถานะด่วน</th>
                      <th className="p-3.5 text-center">เอกสาร</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quotations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                          ยังไม่มีข้อมูลใบเสนอราคาในระบบ
                        </td>
                      </tr>
                    ) : (
                      quotations.map((quote) => {
                        const isLiveOnWeb = quote.status === 'deposit_paid' || quote.status === 'confirmed' || quote.status === 'completed';
                        const totalT = quote.tableCount + (quote.freeTableCount || 0);
                        return (
                          <tr key={quote.quoteNo} className={`hover:bg-slate-50/80 transition-colors ${isLiveOnWeb ? 'bg-emerald-50/30' : ''}`}>
                            <td className="p-3.5">
                              <div className="font-mono font-black text-red-700 text-xs">{quote.quoteNo}</div>
                              <div className="text-slate-900 font-bold text-[11px] mt-0.5">
                                📅 {formatThaiDateShort(quote.customer?.eventDate || '')}
                              </div>
                              <div className="text-slate-500 text-[10px]">
                                ⏰ {quote.customer?.eventTime || 'ไม่ระบุ'}
                              </div>
                            </td>

                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{quote.customer?.name}</div>
                              <a href={`tel:${quote.customer?.phone}`} className="text-red-700 font-mono font-semibold text-[11px] hover:underline">
                                {quote.customer?.phone}
                              </a>
                            </td>

                            <td className="p-3.5">
                              <div className="font-bold text-slate-800">{quote.customer?.eventType || 'งานจัดเลี้ยง'}</div>
                              <div className="text-slate-500 text-[11px] truncate max-w-[160px]" title={quote.customer?.eventLocation}>
                                📍 {quote.customer?.eventLocation || '-'}
                              </div>
                            </td>

                            <td className="p-3.5 text-center">
                              <span className="font-black text-slate-900 text-sm">{totalT}</span>
                              <span className="text-slate-500 text-[10px] block">โต๊ะ</span>
                            </td>

                            <td className="p-3.5 text-right font-mono font-black text-emerald-800">
                              {formatCurrency(quote.depositAmount)}
                            </td>

                            <td className="p-3.5 text-center">
                              {isLiveOnWeb ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  แสดงผลสด 🟢
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                                  รอมัดจำ ⏳
                                </span>
                              )}
                            </td>

                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {quote.status !== 'deposit_paid' && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickStatusChange(quote, 'deposit_paid')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-xs cursor-pointer"
                                    title="บันทึกว่าได้รับมัดจำแล้ว และนำขึ้นแสดงผลหน้าเว็บ"
                                  >
                                    ✓ ได้รับมัดจำ
                                  </button>
                                )}
                                {quote.status !== 'confirmed' && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickStatusChange(quote, 'confirmed')}
                                    className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] shadow-xs cursor-pointer"
                                    title="ยืนยันคิวเต็ม 100%"
                                  >
                                    👑 คิวเต็ม
                                  </button>
                                )}
                                {quote.status && quote.status !== 'pending' && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickStatusChange(quote, 'pending')}
                                    className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-[10px] cursor-pointer"
                                    title="เปลี่ยนกลับเป็นรอยืนยัน"
                                  >
                                    รอยืนยัน
                                  </button>
                                )}
                              </div>
                            </td>

                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setActiveQuote(quote)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 transition-colors"
                                  title="ดูใบเสนอราคา"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setContractQuote(quote)}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                                  title="ดูสัญญาจ้างจัดเลี้ยง"
                                >
                                  <FileCheck className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReceiptQuote(quote);
                                    setReceiptType('deposit_30');
                                  }}
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                                  title="ออกใบเสร็จรับเงินมัดจำ 30%"
                                >
                                  <Receipt className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: Packages & Menus Management Overview */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
              <div>
                <h3 className="text-xl font-black text-slate-900">แพ็กเกจโต๊ะจีน & รายการอาหารมาตรฐาน ({BANQUET_PACKAGES.length} แพ็กเกจ)</h3>
                <p className="text-xs text-slate-500 font-medium">ตรวจสอบราคาและรายการอาหารมาตรฐานของแบรนด์ โต๊ะจีน รพีพัฒน์</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BANQUET_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700 px-3 py-1 rounded-full bg-red-50 border border-red-200">
                      {pkg.dishCount} จาน
                    </span>
                    <span className="text-xl font-black text-slate-900">{formatCurrency(pkg.price)}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900">{pkg.name}</h4>
                  <p className="text-xs text-slate-600 font-medium">{pkg.description}</p>
                  
                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="font-bold text-slate-800 text-[11px] uppercase">รายการอาหาร:</div>
                    {pkg.courses.map((c, i) => (
                      <div key={i} className="truncate font-medium">
                        • {c.title}: <span className="text-slate-800">{c.options[0]?.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Google Drive & GAS Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-md">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <CloudUpload className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-xl font-black text-slate-900">ตั้งค่า Google Apps Script (GAS) Webhook</h3>
                  <p className="text-xs text-slate-500 font-medium">เชื่อมต่อ Google Drive เพื่อจัดเก็บไฟล์ PDF ใบเสนอราคาแบบไม่จำกัด Quota</p>
                </div>
              </div>

              {/* Strict Bottom-Aligned Input */}
              <div className="flex flex-col justify-end h-full space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  Google Apps Script Web Application URL (Exec URL):
                </label>
                <input
                  type="url"
                  value={gasUrl}
                  onChange={(e) => setGasUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-red-600 font-medium"
                />
                <span className="text-[11px] text-slate-500 font-medium">
                  * เมื่อผู้ใช้ดาวน์โหลดหรือบันทึก PDF ระบบจะส่ง Base64 ไปยัง Webhook นี้เพื่อสร้างไฟล์ใน Google Drive ทันที
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleSaveGasUrl}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{gasSaved ? '✓ บันทึกเรียบร้อยแล้ว' : 'บันทึกการตั้งค่า'}</span>
                </button>
              </div>

              {/* Code Snippet for GAS Setup */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
                <div className="font-bold text-amber-300">ตัวอย่างโค้ด Google Apps Script (Code.gs):</div>
                <pre className="text-[11px] text-slate-300 font-mono overflow-x-auto p-3 rounded-lg bg-black/60 border border-white/10">
{`function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var bytes = Utilities.base64Decode(data.base64Pdf);
    var blob = Utilities.newBlob(bytes, 'application/pdf', 'ใบเสนอราคา_' + data.quoteNo + '.pdf');
    var file = DriveApp.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileId: file.getId(),
      webViewLink: file.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }));
  }
}`}
                </pre>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Edit Note Modal */}
      {editingNoteQuote && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">แก้ไขบันทึกภายใน ({editingNoteQuote.quoteNo})</h3>
            <div className="flex flex-col justify-end h-full">
              <label className="text-xs text-slate-600 font-medium mb-1">หมายเหตุของเจ้าหน้าที่ / ข้อมูลการชำระเงิน:</label>
              <textarea
                rows={4}
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="เช่น ได้รับเงินมัดจำ 30% แล้วเมื่อวันที่..., ผ้าคลุมสีทอง..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-red-600 font-medium"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingNoteQuote(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm"
              >
                บันทึกหมายเหตุ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quotation & PDF Modal */}
      {editingQuote && (
        <EditQuotationModal
          quotation={editingQuote}
          isOpen={!!editingQuote}
          onClose={() => setEditingQuote(null)}
          onSave={handleSaveEditedQuote}
        />
      )}

      {/* Full A4 Quotation Modal */}
      {activeQuote && (
        <QuotationModal
          quotation={activeQuote}
          onClose={() => setActiveQuote(null)}
        />
      )}

      {/* Official A4 Catering Contract Modal */}
      {contractQuote && (
        <CateringContractModal
          quotation={contractQuote}
          isOpen={!!contractQuote}
          onClose={() => setContractQuote(null)}
        />
      )}

      {/* Official A4 Catering Receipt Modal (Supports 30%, 70%, 100%) */}
      {receiptQuote && (
        <CateringReceiptModal
          quotation={receiptQuote}
          isOpen={!!receiptQuote}
          initialType={receiptType}
          onClose={() => setReceiptQuote(null)}
        />
      )}

    </div>
  );
};
