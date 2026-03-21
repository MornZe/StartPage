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
    const response = await fetch(
      'https://api.bilibili.com/x/web-interface/popular?ps=20&pn=1',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.bilibili.com',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch Bilibili popular: ${response.status}`)
    }

    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(data)
  } catch (error) {
    console.error('Bilibili popular API error:', error)
    return res.status(500).json({ error: 'Failed to fetch Bilibili popular' })
  }
}
