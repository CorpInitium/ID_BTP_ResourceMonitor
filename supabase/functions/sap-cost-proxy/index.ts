import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const AUTH_URL = 'https://initiumdigitalpvtltd.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials&response_type=token';
const COST_API_URL = 'https://uas-reporting.cfapps.eu10.hana.ondemand.com/odata/MonthlySubaccountCmCosts';

const USERNAME = 'sb-5eead6c7-ae37-4e33-bb37-54c261f8f385!b501823|uas!b36585';
const PASSWORD = '6589e840-701a-4fc9-8294-901884444e12$9OyAGVOiGlKFvOrrxQYfWxaH7YCmCqvVhNbiUMZJM6c=';

async function getAccessToken(): Promise<string> {
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);

  const response = await fetch(AUTH_URL, {
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
  return data.access_token;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const token = await getAccessToken();

    const costUrl = `${COST_API_URL}?$format=json`;

    const costResponse = await fetch(costUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!costResponse.ok) {
      const errorText = await costResponse.text();
      throw new Error(`Failed to fetch cost data: ${costResponse.statusText} - ${errorText}`);
    }

    const data = await costResponse.json();

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in sap-cost-proxy:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});