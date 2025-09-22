import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const file = searchParams.get('file')
    
    if (!file) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 })
    }

    // Security: Only allow files from the public directory
    const publicDir = path.join(process.cwd(), 'public')
    const filePath = path.join(publicDir, file)
    
    // Ensure the file is within the public directory
    if (!filePath.startsWith(publicDir)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath)
    
    // Set appropriate headers for PDF streaming
    const headers = new Headers({
      'Content-Type': 'application/pdf',
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      'Accept-Ranges': 'bytes',
      'Content-Disposition': `inline; filename="${path.basename(file)}"`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })

    // Return the PDF with proper headers
    return new NextResponse(fileBuffer as BodyInit, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('PDF proxy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
