import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Endpoint to proxy or handle Google Apps Script (GAS) Webhook for Drive uploads
 */
router.post('/upload-drive', async (req: Request, res: Response) => {
  try {
    const { quoteNo, customerName, base64Pdf, gasWebhookUrl } = req.body;

    if (!base64Pdf) {
      return res.status(400).json({ success: false, message: 'Base64 PDF content is required' });
    }

    const targetUrl = gasWebhookUrl || process.env.GAS_WEBHOOK_URL;

    if (targetUrl) {
      // Forward to actual Google Apps Script Webhook
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteNo,
          customerName,
          base64Pdf,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      return res.json({ success: true, data });
    } else {
      // Mock / Simulation mode if no GAS webhook URL is set
      const mockDriveId = `1gDrive_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const mockWebViewLink = `https://drive.google.com/file/d/${mockDriveId}/view?usp=sharing`;

      return res.json({
        success: true,
        message: 'PDF processed (Drive simulation mode). Connect your Google Apps Script URL for live Drive sync.',
        data: {
          fileId: mockDriveId,
          webViewLink: mockWebViewLink,
          fileName: `ใบเสนอราคา_รพีพัฒน์_${quoteNo}_${customerName || 'ลูกค้า'}.pdf`,
          uploadedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error: any) {
    console.error('GAS Webhook proxy error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload to Google Drive', error: error.message });
  }
});

export default router;
