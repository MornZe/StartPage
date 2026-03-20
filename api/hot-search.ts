import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`)
    const platform = url.searchParams.get('platform') || 'wise'
    const tab = url.searchParams.get('tab') || 'realtime'

    const response = await fetch(
      `https://top.baidu.com/api/board?platform=${platform}&tab=${tab}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch hot search: ${response.status}`)
    }

    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json(data)
  } catch (error) {
    console.error('Hot search API error:', error)
    return res.status(500).json({ error: 'Failed to fetch hot search' })
  }
}
