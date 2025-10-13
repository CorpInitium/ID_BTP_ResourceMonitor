import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sapApiUrl = process.env.SAP_COST_API_URL;
    const sapUsername = process.env.SAP_USERNAME;
    const sapPassword = process.env.SAP_PASSWORD;

    if (!sapApiUrl || !sapUsername || !sapPassword) {
      return res.status(500).json({ error: 'SAP API configuration is missing' });
    }

    const credentials = Buffer.from(`${sapUsername}:${sapPassword}`).toString('base64');

    const response = await fetch(sapApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`SAP API returned ${response.status}: ${response.statusText}`);
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
