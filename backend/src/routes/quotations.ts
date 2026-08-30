import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// Helper to generate Quote Number QT-YYYYMM-XXXX
function generateQuoteNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `QT-${year}${month}-${random}`;
}

// GET all quotations
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, status } = req.query;
    const whereClause: any = {};

    if (status && typeof status === 'string' && status !== 'all') {
      whereClause.status = status;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      whereClause.OR = [
        { quoteNo: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { eventLocation: { contains: search } },
      ];
    }

    const quotations = await prisma.quotation.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: quotations.map(q => ({
        ...q,
        selectedDishes: JSON.parse(q.selectedDishes || '[]'),
      })),
    });
  } catch (error: any) {
    console.error('Error fetching quotations:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch quotations', error: error.message });
  }
});

// GET quotation by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const quotation = await prisma.quotation.findUnique({
      where: { id },
    });

    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    return res.json({
      success: true,
      data: {
        ...quotation,
        selectedDishes: JSON.parse(quotation.selectedDishes || '[]'),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error fetching quotation', error: error.message });
  }
});

// POST create quotation
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      eventDate,
      eventTime,
      eventLocation,
      eventType,
      packagePrice,
      packageName,
      tableCount,
      beveragePrice = 0,
      beverageName = '',
      floorService = 0,
      selectedDishes = [],
      notes = '',
      pdfDriveUrl = null,
    } = req.body;

    if (!customerName || !customerPhone || !eventDate || !eventLocation || !packagePrice || !tableCount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const validTableCount = Math.max(5, parseInt(tableCount, 10));
    const validPackagePrice = parseInt(packagePrice, 10);
    const validBeveragePrice = parseInt(beveragePrice, 10) || 0;
    const validFloorService = parseInt(floorService, 10) || 0;

    // Promotion rule: Order 20 tables, get 1 free table
    const freeTableCount = Math.floor(validTableCount / 20);
    const discount = freeTableCount * validPackagePrice;

    const subtotal = (validPackagePrice * validTableCount) + (validBeveragePrice * validTableCount) + (validFloorService * validTableCount);
    const grandTotal = Math.max(0, subtotal - discount);
    const depositAmount = Math.round(grandTotal * 0.30); // 30% Deposit to lock date
    const finalAmount = grandTotal - depositAmount;       // 70% Remaining on event day

    const quoteNo = req.body.quoteNo || generateQuoteNumber();

    const created = await prisma.quotation.create({
      data: {
        quoteNo,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        eventDate,
        eventTime: eventTime || 'ช่วงเย็น (18:00 น.)',
        eventLocation,
        eventType: eventType || 'งานเลี้ยงสังสรรค์',
        packagePrice: validPackagePrice,
        packageName: packageName || `แพ็กเกจโต๊ะจีน ฿${validPackagePrice.toLocaleString()}`,
        tableCount: validTableCount,
        freeTableCount,
        beveragePrice: validBeveragePrice,
        beverageName: beverageName || null,
        floorService: validFloorService,
        subtotal,
        discount,
        grandTotal,
        depositAmount,
        finalAmount,
        selectedDishes: JSON.stringify(selectedDishes),
        notes: notes || null,
        pdfDriveUrl: pdfDriveUrl || null,
        status: 'pending',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Quotation created successfully',
      data: {
        ...created,
        selectedDishes: JSON.parse(created.selectedDishes),
      },
    });
  } catch (error: any) {
    console.error('Error creating quotation:', error);
    return res.status(500).json({ success: false, message: 'Failed to create quotation', error: error.message });
  }
});

// PATCH update status or Google Drive URL
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, pdfDriveUrl, notes } = req.body;

    const updated = await prisma.quotation.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(pdfDriveUrl !== undefined && { pdfDriveUrl }),
        ...(notes !== undefined && { notes }),
      },
    });

    return res.json({
      success: true,
      message: 'Quotation updated successfully',
      data: {
        ...updated,
        selectedDishes: JSON.parse(updated.selectedDishes || '[]'),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update quotation', error: error.message });
  }
});

// DELETE quotation
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.quotation.delete({ where: { id } });
    return res.json({ success: true, message: 'Quotation deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete quotation', error: error.message });
  }
});

export default router;
