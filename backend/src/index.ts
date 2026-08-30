import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import quotationRoutes from './routes/quotations.js';
import gasRoutes from './routes/gasWebhook.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'โต๊ะจีน รพีพัฒน์ พรีเมียม (RAPEEPHAT BANQUET CATERING)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/quotations', quotationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gas', gasRoutes);

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(` Banquet Server running on http://0.0.0.0:${PORT}`);
});
