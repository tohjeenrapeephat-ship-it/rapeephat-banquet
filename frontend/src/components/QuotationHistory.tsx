import React, { useState, useEffect } from 'react';
import { QuotationDoc } from '../types/quotation.js';
import { QuotationApi } from '../services/api.js';
import { formatCurrency } from '../utils/currency.js';
import { formatThaiDate } from '../utils/thaiDate.js';
import { QuotationModal } from './QuotationBuilder/QuotationModal.js';
import {
  FileText,
  Calendar,
  Eye,
  Trash2,
  CloudUpload,
  X,
  Search
} from 'lucide-react';

interface QuotationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationHistory: React.FC<QuotationHistoryProps> = ({ isOpen, onClose }) => {
  const [quotations, setQuotations] = useState<QuotationDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuote, setActiveQuote] = useState<QuotationDoc | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await QuotationApi.getAll(searchTerm);
      setQuotations(data);
    } catch (e) {
      console.error('Error fetching quotation history:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, searchTerm]);

  if (!isOpen) return null;

  const handleDelete = async (quote: QuotationDoc) => {
    if (!confirm(`ต้องการลบประวัติใบเสนอราคา ${quote.quoteNo} หรือไม่?`)) return;
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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">ประวัติใบเสนอราคาที่เคยสร้าง</h3>
              <p className="text-xs text-slate-500 font-medium">ดูรายละเอียด พิมพ์ซ้ำ หรือเปิดไฟล์ Google Drive</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาตามเลขที่เอกสาร, ชื่อลูกค้า หรือเบอร์โทรศัพท์..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Quotation List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {quotations.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-600">ยังไม่มีประวัติใบเสนอราคา</div>
              <p className="text-xs text-slate-400 mt-1">ใบเสนอราคาที่ออกผ่าน Smart Builder จะถูกบันทึกไว้ที่นี่</p>
            </div>
          ) : (
            quotations.map((quote) => (
              <div
                key={quote.quoteNo}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 p-3 rounded-2xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-red-600">
                      {quote.quoteNo ? quote.quoteNo.replace(/^QT-/, 'QT') : ''}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {quote.package?.name} ({quote.tableCount} โต๊ะ)
                    </span>
                  </div>
                  <div className="text-xs text-slate-800 font-bold">
                    {quote.customer?.name} • <span className="text-slate-500 font-medium">{quote.customer?.phone}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    📅 วันจัดงาน: {formatThaiDate(quote.customer?.eventDate)} ({quote.customer?.eventLocation})
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">{formatCurrency(quote.grandTotal)}</div>
                    <div className="text-[10px] text-red-600 font-bold">มัดจำ: {formatCurrency(quote.depositAmount)}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveQuote(quote)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white font-bold transition-all border border-red-200"
                      title="ดูใบเสนอราคา"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {quote.pdfDriveUrl && (
                      <a
                        href={quote.pdfDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white transition-colors border border-blue-200"
                        title="เปิดไฟล์ Google Drive"
                      >
                        <CloudUpload className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(quote)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600"
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {activeQuote && (
        <QuotationModal
          quotation={activeQuote}
          onClose={() => setActiveQuote(null)}
        />
      )}
    </div>
  );
};
