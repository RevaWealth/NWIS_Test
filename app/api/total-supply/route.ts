import { NextRequest, NextResponse } from 'next/server'

// API endpoint to return total supply as numerical value
// Similar to: https://chainz.cryptoid.info/grs/api.dws?q=totalcoins
export async function GET(request: NextRequest) {
  try {
    const contractAddress = process.env.NWIS_TOKEN_CONTRACT_ADDRESS || '0x3E3A84C2bE12035c68b39A2748D42aAabA329455'
    
    // Use a public RPC endpoint to call the contract
    const rpcUrl = 'https://ethereum.publicnode.com'
    const rpcPayload = {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          to: contractAddress,
          data: '0x18160ddd' // totalSupply() function selector
        },
        'latest'
      ],
      id: 1
    }
    
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rpcPayload)
      })
      const data = await response.json()
      
      if (data.error) {
        console.log('RPC API error:', data.error)
        // Fallback: return a static value for now
        return new NextResponse('1000000000', {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'public, max-age=60',
          },
        })
      }
      
      // Convert hex result to decimal
      const totalSupplyHex = data.result
      console.log('Raw hex result:', totalSupplyHex)
      
      if (!totalSupplyHex || totalSupplyHex === '0x') {
        console.log('Empty result, using fallback')
        return new NextResponse('1000000000', {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'public, max-age=60',
          },
        })
      }
      
      const totalSupplyWei = parseInt(totalSupplyHex, 16)
      console.log('Total supply in wei:', totalSupplyWei)
      
      if (isNaN(totalSupplyWei)) {
        console.log('Invalid number, using fallback')
        return new NextResponse('1000000000', {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'public, max-age=60',
          },
        })
      }
      
      const totalSupplyFormatted = (totalSupplyWei / Math.pow(10, 18)).toString()
      console.log('Formatted total supply:', totalSupplyFormatted)
      
      return new NextResponse(totalSupplyFormatted, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=60',
        },
      })
    } catch (fetchError) {
      console.log('RPC API failed, using fallback:', fetchError.message)
      // Fallback: return a static value
      return new NextResponse('1000000000', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=60',
        },
      })
    }
  } catch (error) {
    console.error('Error fetching total supply:', error)
    return new NextResponse('1000000000', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=60',
      },
    })
  }
}
