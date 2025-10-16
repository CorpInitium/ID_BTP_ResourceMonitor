import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usageRoutes from './routes/usage.js';
import costRoutes from './routes/cost.js';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.use('/api/usage', usageRoutes);
app.use('/api/cost', costRoutes);

app.use(express.static(path.join(__dirname, '../dist')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
