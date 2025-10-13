import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usageRoutes from './routes/usage';
import costRoutes from './routes/cost';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/usage', usageRoutes);
app.use('/api/cost', costRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
