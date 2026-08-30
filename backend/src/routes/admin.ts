import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET Admin Dashboard Statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const totalQuotations = quotations.length;
    const totalRevenue = quotations.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
    const totalTables = quotations.reduce((acc, q) => acc + (q.tableCount || 0), 0);
    const totalDeposit = quotations.reduce((acc, q) => acc + (q.depositAmount || 0), 0);

    const pendingCount = quotations.filter(q => q.status === 'pending').length;
    const depositPaidCount = quotations.filter(q => q.status === 'deposit_paid').length;
    const confirmedCount = quotations.filter(q => q.status === 'confirmed').length;
    const completedCount = quotations.filter(q => q.status === 'completed').length;
    const cancelledCount = quotations.filter(q => q.status === 'cancelled').length;

    // Package Popularity stats
    const packageStats: Record<string, { count: number; revenue: number; name: string }> = {};
    quotations.forEach(q => {
      const key = `฿${q.packagePrice}`;
      if (!packageStats[key]) {
        packageStats[key] = { count: 0, revenue: 0, name: q.packageName };
      }
      packageStats[key].count += 1;
      packageStats[key].revenue += q.grandTotal;
    });

    return res.json({
      success: true,
      data: {
        summary: {
          totalQuotations,
          totalRevenue,
          totalTables,
          totalDeposit,
          pendingCount,
          depositPaidCount,
          confirmedCount,
          completedCount,
          cancelledCount,
        },
        packageStats,
        recentQuotations: quotations.slice(0, 5).map(q => ({
          ...q,
          selectedDishes: JSON.parse(q.selectedDishes || '[]'),
        })),
      },
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate stats', error: error.message });
  }
});

export default router;
