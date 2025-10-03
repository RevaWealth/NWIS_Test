import { NextResponse } from 'next/server';

// In-memory cache for ETH price
interface PriceCache {
  price: number;
  timestamp: number;
  source: string;
}

let priceCache: PriceCache | null = null;
const CACHE_DURATION = 30000; // 30 seconds in milliseconds

export async function GET() {
  try {
    const now = Date.now();
    
    // Check if we have a valid cached price
    if (priceCache && (now - priceCache.timestamp) < CACHE_DURATION) {
      console.log('📦 Using cached ETH price:', priceCache.price);
      return NextResponse.json({
        price: priceCache.price,
        timestamp: Math.floor(priceCache.timestamp / 1000),
        source: priceCache.source,
        cached: true
      });
    }
    
    console.log('🔗 Fetching fresh ETH price from CoinGecko...');
    
    // Fetch ETH price from CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 30 }, // Keep Next.js cache as backup
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

    // Update cache with new price
    priceCache = {
      price: ethPrice,
      timestamp: now,
      source: 'coingecko'
    };

    console.log('✅ ETH price fetched and cached:', ethPrice);

    return NextResponse.json({
      price: ethPrice,
      timestamp: Math.floor(now / 1000), // Convert to seconds
      source: 'coingecko',
      cached: false
    });

  } catch (error) {
    console.error('❌ Error fetching ETH price:', error);
    
    // If we have cached data, use it even if it's expired
    if (priceCache) {
      console.log('📦 Using expired cached ETH price as fallback:', priceCache.price);
      return NextResponse.json({
        price: priceCache.price,
        timestamp: Math.floor(priceCache.timestamp / 1000),
        source: priceCache.source,
        cached: true,
        expired: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Final fallback to a reasonable default price
    const fallbackPrice = 2500;
    console.log('⚠️ Using default fallback ETH price:', fallbackPrice);
    
    return NextResponse.json({
      price: fallbackPrice,
      timestamp: Math.floor(Date.now() / 1000), // Convert to seconds
      source: 'fallback',
      cached: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
