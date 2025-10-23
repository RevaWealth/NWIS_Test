import { NextResponse } from 'next/server'

export async function GET() {
  const region = process.env.REGION || 'unknown'
  
  return NextResponse.json(
    {
      status: 'healthy',
      region: region,
      timestamp: new Date().toISOString(),
      service: 'nexuswealth-main-website',
    },
    {
      headers: {
        'X-Cloud-Region': region,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  )
}
