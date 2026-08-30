import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial quotations for โต๊ะจีน รพีพัฒน์...');

  const sampleQuotes = [
    {
      quoteNo: 'QT-202608-1001',
      customerName: 'คุณธนภัทร สุขเกษม',
      customerPhone: '081-998-7654',
      customerEmail: 'thanapat@example.com',
      eventDate: '2026-11-20',
      eventTime: 'ช่วงเย็น (17:00 - 19:00 น.)',
      eventLocation: 'หอประชุมเทศบาลเมืองนครปฐม จ.นครปฐม',
      eventType: 'งานมงคลสมรส (งานแต่งงาน)',
      packagePrice: 1700,
      packageName: 'แพ็กเกจยอดนิยม Best Seller 👑 (฿1,700)',
      tableCount: 25,
      freeTableCount: 1,
      beveragePrice: 250,
      beverageName: 'ชุดเครื่องดื่มมาตรฐาน',
      floorService: 0,
      subtotal: (1700 * 25) + (250 * 25),
      discount: 1700,
      grandTotal: (1700 * 25) + (250 * 25) - 1700,
      depositAmount: Math.round(((1700 * 25) + (250 * 25) - 1700) * 0.3),
      finalAmount: ((1700 * 25) + (250 * 25) - 1700) - Math.round(((1700 * 25) + (250 * 25) - 1700) * 0.3),
      selectedDishes: JSON.stringify([
        { courseId: 'c1', courseTitle: '1. ออเดิร์ฟ', dishName: 'ออเดิร์ฟจักรพรรดิ 5 อย่าง' },
        { courseId: 'c2', courseTitle: '2. ซุปกระเพาะปลา', dishName: 'กระเพาะปลาสดน้ำแดงเนื้อปูก้อน' },
        { courseId: 'c3', courseTitle: '3. เมนูเนื้อ', dishName: 'ขาหมูเยอรมันทอดกรอบ' },
        { courseId: 'c4', courseTitle: '4. เมนูปลา', dishName: 'ปลากะพงนึ่งมะนาวพริกขี้หนูสวน' },
        { courseId: 'c5', courseTitle: '5. ต้มยำ/ซุป', dishName: 'ต้มยำกุ้งแม่น้ำมะพร้าวอ่อน' },
        { courseId: 'c6', courseTitle: '6. เมนูผัด', dishName: 'กุ้งอบวุ้นเส้นหม้อดิน' },
        { courseId: 'c7', courseTitle: '7. เมนูข้าว', dishName: 'ข้าวผัดปูก้อนจัมโบ้' },
        { courseId: 'c8', courseTitle: '8. ของหวาน', dishName: 'โอนีแปะก๊วยเผือกกวนทรงเครื่อง' },
      ]),
      notes: 'ต้องการผ้าคลุมเก้าอี้ผูกโบว์สีทอง',
      pdfDriveUrl: 'https://drive.google.com/file/d/1gDrive_RPP_QT-202608-1001/view?usp=sharing',
      status: 'confirmed',
    },
    {
      quoteNo: 'QT-202608-1002',
      customerName: 'คุณกิตติศักดิ์ พรหมมินทร์',
      customerPhone: '089-765-4321',
      customerEmail: 'kittisak@business.co.th',
      eventDate: '2026-12-15',
      eventTime: 'ช่วงเพล (11:00 - 13:00 น.)',
      eventLocation: 'บ้านเลขที่ 99 หมู่ 4 ต.บางกระเบา อ.นครชัยศรี จ.นครปฐม',
      eventType: 'งานทำบุญขึ้นบ้านใหม่',
      packagePrice: 1800,
      packageName: 'แพ็กเกจพรีเมียมจัดเลี้ยง (฿1,800)',
      tableCount: 15,
      freeTableCount: 0,
      beveragePrice: 350,
      beverageName: 'ชุดเครื่องดื่มพรีเมียม + น้ำสมุนไพร',
      floorService: 0,
      subtotal: (1800 * 15) + (350 * 15),
      discount: 0,
      grandTotal: (1800 * 15) + (350 * 15),
      depositAmount: Math.round(((1800 * 15) + (350 * 15)) * 0.3),
      finalAmount: ((1800 * 15) + (350 * 15)) - Math.round(((1800 * 15) + (350 * 15)) * 0.3),
      selectedDishes: JSON.stringify([
        { courseId: 'c1', courseTitle: '1. ออเดิร์ฟ', dishName: 'ฮ่อยจ๊อปูทะลักเนื้อแน่น + แฮ่กึ๊นทอด' },
        { courseId: 'c2', courseTitle: '2. ซุปกระเพาะปลา', dishName: 'กระเพาะปลาสดน้ำแดงเนื้อปูก้อนจัมโบ้' },
        { courseId: 'c3', courseTitle: '3. เมนูเนื้อ', dishName: 'เป็ดย่างน้ำผึ้งฮ่องกงแท้' },
        { courseId: 'c4', courseTitle: '4. เมนูปลา', dishName: 'ปลากะพงขาวนึ่งซีอิ๊วฮ่องกง' },
        { courseId: 'c5', courseTitle: '5. ต้มยำ/ซุป', dishName: 'ต้มยำกุ้งแม่น้ำตัวโตน้ำข้น' },
        { courseId: 'c6', courseTitle: '6. เมนูผัด', dishName: 'ผัดโหงวก๊วยกระทงทองกุ้งสด' },
        { courseId: 'c7', courseTitle: '7. เมนูข้าว', dishName: 'ข้าวห่อใบบัวจักรพรรดิ' },
        { courseId: 'c8', courseTitle: '8. ของหวาน', dishName: 'แปะก๊วยนมสดมะพร้าวอ่อน' },
      ]),
      notes: 'เลี้ยงพระช่วงเช้าและเลี้ยงแขกช่วงเพล',
      pdfDriveUrl: 'https://drive.google.com/file/d/1gDrive_RPP_QT-202608-1002/view?usp=sharing',
      status: 'pending',
    },
  ];

  for (const q of sampleQuotes) {
    await prisma.quotation.upsert({
      where: { quoteNo: q.quoteNo },
      update: q,
      create: q,
    });
  }

  console.log(' Seeded 2 sample quotations successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
