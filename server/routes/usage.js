import express from 'express';
import { getAccessToken } from '../utils/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'fromDate and toDate are required' });
    }

    const sapApiUrl = process.env.SAP_USAGE_API_URL;

    if (!sapApiUrl) {
      return res.status(500).json({ error: 'SAP Usage API URL is not configured' });
    }

    const token = await getAccessToken();

    const url = `${sapApiUrl}?fromDate=${fromDate}&toDate=${toDate}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SAP API returned ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Usage API Error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch usage data',
    });
  }
});

export default router;
