const WIX_API_KEY = process.env.WIX_API_KEY;
const WIX_SITE_ID = process.env.WIX_SITE_ID;
const COLLECTION_ID = 'crispygigs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const base = 'https://www.wixapis.com/wix-data/v2/items';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': WIX_API_KEY,
    'wix-site-id': WIX_SITE_ID,
  };

  if (req.method === 'GET') {
    const r = await fetch(`${base}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ dataCollectionId: COLLECTION_ID, query: { sort: [{ fieldName: 'date', order: 'ASC' }] } }),
    });
    const data = await r.json();
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { date, time, name, venue } = req.body;
    const r = await fetch(base, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        dataCollectionId: COLLECTION_ID,
        dataItem: {
          data: {
            date: date,
            time: time || '',
            name: name,
            venue: venue || ''
          }
        }
      }),
    });
    const data = await r.json();
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    const r = await fetch(`${base}/${id}?dataCollectionId=${COLLECTION_ID}`, { method: 'DELETE', headers });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
