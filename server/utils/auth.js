import dotenv from 'dotenv';
dotenv.config();
export async function getAccessToken() {
  const authUrl = process.env.SAP_AUTH_URL;
  const username = process.env.SAP_USERNAME;
  const password = process.env.SAP_PASSWORD;

  if (!authUrl || !username || !password) {
    throw new Error('SAP authentication configuration is missing');
  }

  const credentials = Buffer.from(`${username}:${password}`).toString('base64');

  const response = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error('No access token received from authentication service');
  }

  return data.access_token;
}
