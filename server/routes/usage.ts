import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'fromDate and toDate are required' });
    }

    const sapApiUrl = process.env.SAP_USAGE_API_URL;
    const sapUsername = process.env.SAP_USERNAME;
    const sapPassword = process.env.SAP_PASSWORD;

    if (!sapApiUrl || !sapUsername || !sapPassword) {
      return res.status(500).json({ error: 'SAP API configuration is missing' });
    }

    const credentials = Buffer.from(`${sapUsername}:${sapPassword}`).toString('base64');

    const url = `${sapApiUrl}?$filter=reportYearMonth ge ${fromDate} and reportYearMonth le ${toDate}`;

    const response = await fetch(url, {
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
    console.error('Usage API Error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch usage data',
    });
  }
});

export default router;
