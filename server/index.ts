import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usageRoutes from './routes/usage';
import costRoutes from './routes/cost';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.use('/api/usage', usageRoutes);
app.use('/api/cost', costRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../dist')));

// ✅ Express v5 compatible catch-all route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
