/**
 * Google Analytics 4 (GA4) & Google Ads Conversion Tracking Helper
 * โต๊ะจีน รพีพัฒน์ พรีเมียม (rapeephat-catering.com)
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * ส่ง Event ไปยัง Google Analytics / Google Ads
 */
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
    // Also push to dataLayer for Google Tag Manager compatibility
    if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
    // Debug log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Event] ${eventName}:`, params);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
};

/**
 * แทร็กการกดปุ่มโทรด่วน (Click to Call) - Conversion สำคัญสูงสุดสำหรับ Google Ads
 */
export const trackClickToCall = (locationSource: string = 'unknown') => {
  trackEvent('click_to_call', {
    event_category: 'Engagement',
    event_label: `Call: 081-331-1646 (${locationSource})`,
    source_placement: locationSource,
    value: 1,
  });
};

/**
 * แทร็กการกดปุ่มแอด LINE (Click to LINE) - Conversion สำคัญสำหรับ Google Ads
 */
export const trackClickToLine = (locationSource: string = 'unknown') => {
  trackEvent('click_to_line', {
    event_category: 'Engagement',
    event_label: `LINE: pang_baichaa (${locationSource})`,
    source_placement: locationSource,
    value: 1,
  });
};

/**
 * แทร็กการสร้างใบเสนอราคา (Quotation Generated)
 */
export const trackQuotationGenerated = (data: {
  packageId?: string;
  packageName?: string;
  pricePerTable?: number;
  tableCount?: number;
  totalAmount?: number;
  customerName?: string;
  location?: string;
}) => {
  trackEvent('generate_lead', {
    event_category: 'Quotation',
    event_label: `Quote: ${data.packageName || 'Custom'} (${data.tableCount || 0} tables)`,
    package_id: data.packageId,
    package_name: data.packageName,
    price_per_table: data.pricePerTable,
    table_count: data.tableCount,
    value: data.totalAmount || 0,
    currency: 'THB',
  });
};

/**
 * แทร็กการดูรายละเอียดแพ็กเกจราคา
 */
export const trackViewPackage = (packageId: string, packageName: string, price: number) => {
  trackEvent('view_item', {
    event_category: 'Ecommerce',
    event_label: packageName,
    items: [
      {
        item_id: packageId,
        item_name: packageName,
        price: price,
        item_category: 'Catering Package',
      },
    ],
  });
};

/**
 * แทร็กการเปลี่ยนหน้า PageView
 */
export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_path: typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '',
  });
};
