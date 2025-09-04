import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔗 Fetching ETH price from CoinGecko...');
    
    // Fetch ETH price from CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const ethPrice = data.ethereum?.usd;

    if (!ethPrice) {
      throw new Error('ETH price not found in response');
    }

    console.log('✅ ETH price fetched:', ethPrice);

    return NextResponse.json({
      price: ethPrice,
      timestamp: Math.floor(Date.now() / 1000), // Convert to seconds
      source: 'coingecko'
    });

  } catch (error) {
    console.error('❌ Error fetching ETH price:', error);
    
    // Fallback to a reasonable default price
    const fallbackPrice = 2500;
    console.log('⚠️ Using fallback ETH price:', fallbackPrice);
    
    return NextResponse.json({
      price: fallbackPrice,
      timestamp: Math.floor(Date.now() / 1000), // Convert to seconds
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
