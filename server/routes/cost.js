import express from 'express';
import { getAccessToken } from '../utils/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sapApiUrl = process.env.SAP_COST_API_URL;

    if (!sapApiUrl) {
      return res.status(500).json({ error: 'SAP Cost API URL is not configured' });
    }

    const token = await getAccessToken();

    const url = `${sapApiUrl}?$format=json`;

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
    console.error('Cost API Error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch cost data',
    });
  }
});

export default router;
