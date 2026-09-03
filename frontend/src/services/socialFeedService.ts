export interface SocialFeedItem {
  id: string;
  platform: 'youtube' | 'tiktok' | 'facebook';
  title: string;
  thumbnail: string;
  url: string;
  embedUrl?: string;
  author: string;
  publishedAt?: string;
  views?: string;
  likes?: string;
  duration?: string;
  badge: string;
  category: string;
  isLiveAutoSync?: boolean;
}

const YOUTUBE_CHANNEL_ID = 'UCY1eIpowWx1wcYtMZ09VCZA';
const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
const RSS2JSON_ENDPOINT = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(YOUTUBE_RSS_URL)}`;
const CACHE_KEY = 'rapeephat_youtube_feed_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const CURATED_SOCIAL_FEEDS: SocialFeedItem[] = [
  // 🔴 YOUTUBE FEEDS
  {
    id: 'yt-1',
    platform: 'youtube',
    title: 'เปิดเตาเร่งไฟลุก! เคล็ดลับผัดกระเพาะปลาน้ำแดงเนื้อปูก้อนสด 35 ปี นครปฐม',
    thumbnail: '/images/dishes/soups/soup-fishmaw-crab-fresh-wood.jpg',
    url: 'https://www.youtube.com/channel/UCY1eIpowWx1wcYtMZ09VCZA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=UUY1eIpowWx1wcYtMZ09VCZA',
    author: 'โต๊ะจีนรพีพัฒน์ นครปฐม',
    views: '2.8M วิว',
    likes: '168K ไลก์',
    duration: '3:45',
    badge: '🔥 คลิปมาแรง',
    category: '🍳 เบื้องหลังครัวสด',
  },
  {
    id: 'yt-2',
    platform: 'youtube',
    title: 'พาชมขบวนรถครัวสัญจร 3 คัน ลุยจัดเลี้ยงงานแต่ง 80 โต๊ะ วัดพระปฐมเจดีย์',
    thumbnail: '/images/fleet/fleet-side-parade-real.png',
    url: 'https://www.youtube.com/channel/UCY1eIpowWx1wcYtMZ09VCZA',
    author: 'โต๊ะจีนรพีพัฒน์ นครปฐม',
    views: '3.4M วิว',
    likes: '240K ไลก์',
    duration: '5:20',
    badge: '👑 งานจัดเลี้ยงจริง',
    category: '🚚 คาราวานครัวเคลื่อนที่',
  },
  // 🎵 TIKTOK FEEDS
  {
    id: 'tt-1',
    platform: 'tiktok',
    title: 'เคี่ยว 6 ชั่วโมง! ขาหมูน้ำแดงยอดผักสูตรจักรพรรดิ 35 ปี นุ่มละลายในปาก',
    thumbnail: '/images/dishes/mains/main-pork-leg-stewed-greens-wood.jpg',
    url: 'https://www.tiktok.com/@user6577563937099?_r=1&_t=ZS-99PYzBzUIbJ',
    author: '@user6577563937099',
    views: '1.9M วิว',
    likes: '115K ไลก์',
    duration: '0:58',
    badge: '🎵 TikTok ไวรัล',
    category: '🍖 เมนูซิกเนเจอร์',
  },
  {
    id: 'tt-2',
    platform: 'tiktok',
    title: 'ปลากะพง 9 ขีด สดเป็นๆ นึ่งมะนาวพริกขี้หนูสวน น้ำซุปแซ่บซี๊ดจี๊ดถึงใจ',
    thumbnail: '/images/dishes/seafood/seafood-seabass-steamed-lime-wood.jpg',
    url: 'https://www.tiktok.com/@user6577563937099?_r=1&_t=ZS-99PYzBzUIbJ',
    author: '@user6577563937099',
    views: '1.4M วิว',
    likes: '92K ไลก์',
    duration: '0:42',
    badge: '🎵 TikTok ไวรัล',
    category: '🐟 ซีฟู้ดสดใหม่ 100%',
  },
  // 📘 FACEBOOK FEEDS
  {
    id: 'fb-1',
    platform: 'facebook',
    title: 'อัปเดตบรรยากาศงานเลี้ยงฉลองมงคลสมรส 50 โต๊ะ ณ จ.นครปฐม ขอบพระคุณเจ้าภาพค่ะ',
    thumbnail: '/images/dishes/mains/main-duck-peking-noodles-wood.jpg',
    url: 'https://web.facebook.com/profile.php?id=61593868896647',
    author: 'โต๊ะจีน รพีพัฒน์ นครปฐม',
    views: 'โพสต์ล่าสุด',
    likes: '1.2K ไลก์',
    badge: '📘 Facebook อัปเดต',
    category: '🎉 บรรยากาศงานเลี้ยง',
  },
  {
    id: 'fb-2',
    platform: 'facebook',
    title: 'เปิดคิวงานเดือนหน้า & โปรโมชั่นพิเศษ สั่ง 20 โต๊ะ ฟรี 1 โต๊ะ ล็อกคิวด่วนกับคุณแป้ง',
    thumbnail: '/images/dishes/appetizers/app-5-kings-gold-wood.jpg',
    url: 'https://web.facebook.com/profile.php?id=61593868896647',
    author: 'โต๊ะจีน รพีพัฒน์ นครปฐม',
    views: 'โปรโมชั่น',
    likes: '890 ไลก์',
    badge: '🎁 โปรโมชั่นพิเศษ',
    category: '📢 ข่าวสาร & คิวงาน',
  },
];

export async function fetchLiveYouTubeFeed(): Promise<SocialFeedItem[]> {
  try {
    // Check Local Storage Cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, items } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && Array.isArray(items) && items.length > 0) {
          return items;
        }
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    const res = await fetch(RSS2JSON_ENDPOINT, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) return [];

    const json = await res.json();
    if (json.status === 'ok' && Array.isArray(json.items) && json.items.length > 0) {
      const parsed: SocialFeedItem[] = json.items.map((item: any) => {
        // Extract video ID from link or guid
        const link = item.link || '';
        const match = link.match(/(?:v=|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
        const videoId = match ? match[1] : '';

        const thumbnail = videoId
          ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
          : item.thumbnail || '/images/dishes/soups/soup-fishmaw-crab-fresh-wood.jpg';

        return {
          id: `yt-${videoId || Math.random().toString(36).substring(7)}`,
          platform: 'youtube',
          title: item.title || 'คลิปใหม่จากโต๊ะจีนรพีพัฒน์ นครปฐม',
          thumbnail,
          url: link || 'https://www.youtube.com/channel/UCY1eIpowWx1wcYtMZ09VCZA',
          embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : undefined,
          author: 'โต๊ะจีนรพีพัฒน์ นครปฐม',
          publishedAt: item.pubDate ? item.pubDate.split(' ')[0] : 'ล่าสุด',
          views: 'NEW 🔥',
          likes: 'คลิปใหม่ล่าสุด',
          duration: 'YouTube',
          badge: '🔴 LIVE AUTO-SYNC',
          category: '📺 คลิปใหม่ล่าสุด',
          isLiveAutoSync: true,
        };
      });

      // Save to cache
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), items: parsed })
      );

      return parsed;
    }

    return [];
  } catch (err) {
    console.warn('YouTube Auto-Feed Live Sync notice (using curated feeds):', err);
    return [];
  }
}
