import { QuotationDoc } from '../types/quotation.js';

const STORAGE_KEY = 'rapeephat_quotations_db';

// Helper to get fallback data from localStorage
function getLocalQuotations(): QuotationDoc[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('LocalStorage error:', e);
    return [];
  }
}

// Helper to save fallback data to localStorage
function saveLocalQuotations(quotes: QuotationDoc[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

export const QuotationApi = {
  async getAll(search?: string): Promise<QuotationDoc[]> {
    try {
      const url = new URL('/api/quotations', window.location.origin);
      if (search) url.searchParams.set('search', search);

      const res = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500),
      });

      if (!res.ok) throw new Error('API server returned ' + res.status);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Sync local cache
        saveLocalQuotations(json.data);
        return json.data;
      }
      throw new Error('Invalid response structure');
    } catch (err) {
      console.warn('Backend API unavailable, using localStorage fallback:', err);
      let local = getLocalQuotations();
      if (search && search.trim() !== '') {
        const s = search.toLowerCase();
        local = local.filter(
          q =>
            q.quoteNo?.toLowerCase().includes(s) ||
            q.customer?.name?.toLowerCase().includes(s) ||
            q.customer?.phone?.includes(s) ||
            q.customer?.eventLocation?.toLowerCase().includes(s)
        );
      }
      return local;
    }
  },

  async create(quote: QuotationDoc): Promise<QuotationDoc> {
    try {
      const payload = {
        quoteNo: quote.quoteNo,
        customerName: quote.customer.name,
        customerPhone: quote.customer.phone,
        customerEmail: quote.customer.email,
        eventDate: quote.customer.eventDate,
        eventTime: quote.customer.eventTime,
        eventLocation: quote.customer.eventLocation,
        eventType: quote.customer.eventType,
        packagePrice: quote.package.price,
        packageName: quote.package.name,
        tableCount: quote.tableCount,
        freeTableCount: quote.freeTableCount,
        beveragePrice: quote.beverage?.pricePerTable || 0,
        beverageName: quote.beverage?.name || '',
        floorService: quote.floorService?.total || 0,
        subtotal: quote.subtotal,
        discount: quote.discount,
        grandTotal: quote.grandTotal,
        depositAmount: quote.depositAmount,
        finalAmount: quote.finalAmount,
        selectedDishes: quote.selectedDishes,
        notes: quote.customer.notes,
        pdfDriveUrl: quote.pdfDriveUrl,
      };

      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          // Also save in local storage
          const local = getLocalQuotations();
          saveLocalQuotations([json.data, ...local.filter(q => q.quoteNo !== quote.quoteNo)]);
          return json.data;
        }
      }
      throw new Error('API save failed');
    } catch (err) {
      console.warn('Backend API save failed, saving to localStorage:', err);
      const local = getLocalQuotations();
      const newRecord = { ...quote, id: 'loc_' + Date.now() };
      saveLocalQuotations([newRecord, ...local.filter(q => q.quoteNo !== quote.quoteNo)]);
      return newRecord;
    }
  },

  async update(quote: QuotationDoc): Promise<QuotationDoc> {
    try {
      await fetch(`/api/quotations/${quote.id || quote.quoteNo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote),
        signal: AbortSignal.timeout(3000),
      });
    } catch (e) {
      console.warn('Backend API update skipped:', e);
    }
    const local = getLocalQuotations();
    const updated = local.map(q => (q.quoteNo === quote.quoteNo || (quote.id && q.id === quote.id) ? quote : q));
    saveLocalQuotations(updated);
    return quote;
  },

  async delete(idOrQuoteNo: string): Promise<void> {
    try {
      await fetch(`/api/quotations/${idOrQuoteNo}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000),
      });
    } catch (e) {
      console.warn('Backend API delete skipped:', e);
    }
    const local = getLocalQuotations();
    const updated = local.filter(q => q.quoteNo !== idOrQuoteNo && q.id !== idOrQuoteNo);
    saveLocalQuotations(updated);
  },

  async updateDriveUrl(id: string, quoteNo: string, driveUrl: string): Promise<void> {
    try {
      await fetch(`/api/quotations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfDriveUrl: driveUrl }),
        signal: AbortSignal.timeout(3000),
      });
    } catch (e) {
      console.warn('Backend drive url update skipped:', e);
    }
    // Update local storage
    const local = getLocalQuotations();
    const updated = local.map(q => (q.quoteNo === quoteNo || q.id === id ? { ...q, pdfDriveUrl: driveUrl } : q));
    saveLocalQuotations(updated);
  }
};
