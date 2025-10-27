import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const LOG_FILE_PATH = path.join(process.cwd(), 'quest-log.json')

// Ensure the log file exists
async function ensureLogFile() {
  try {
    await fs.access(LOG_FILE_PATH)
  } catch {
    // File doesn't exist, create it with empty array
    await fs.writeFile(LOG_FILE_PATH, JSON.stringify([], null, 2))
  }
}

// GET handler - Fetch all quest logs
export async function GET() {
  try {
    await ensureLogFile()
    const fileContents = await fs.readFile(LOG_FILE_PATH, 'utf-8')
    const logs = JSON.parse(fileContents)
    
    return NextResponse.json({ logs }, { status: 200 })
  } catch (error) {
    console.error('Error reading quest log:', error)
    return NextResponse.json(
      { error: 'Failed to read quest log' },
      { status: 500 }
    )
  }
}

// POST handler - Add new quest completion
export async function POST(request: NextRequest) {
  try {
    await ensureLogFile()
    
          const body = await request.json()
          const { walletAddress, transactionHash, questId, timestamp, xPostLink, instagramPostLink, tokenAmount } = body

    // Validate required fields
    if (!walletAddress || !transactionHash || !questId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate social media links if provided (for quest ID 2)
    if (questId === 2 && (xPostLink || instagramPostLink)) {
      const validateSocialLinks = (xLink: string, igLink: string) => {
        // X (Twitter) URL patterns
        const xPatterns = [
          /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/i,
          /^https?:\/\/(www\.)?x\.com\/\w+\/status\/\d+/i,
          /^https?:\/\/(www\.)?twitter\.com\/\w+\/status\/\d+/i
        ]
        
        // Instagram URL patterns
        const igPatterns = [
          /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/i,
          /^https?:\/\/(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?/i,
          /^https?:\/\/(www\.)?instagram\.com\/tv\/[A-Za-z0-9_-]+\/?/i
        ]
        
        const isValidX = xPatterns.some(pattern => pattern.test(xLink))
        const isValidIG = igPatterns.some(pattern => pattern.test(igLink))
        
        return { isValidX, isValidIG }
      }

      const { isValidX, isValidIG } = validateSocialLinks(xPostLink || '', instagramPostLink || '')
      
      if (xPostLink && !isValidX) {
        return NextResponse.json(
          { error: 'Invalid X (Twitter) post URL format' },
          { status: 400 }
        )
      }
      
      if (instagramPostLink && !isValidIG) {
        return NextResponse.json(
          { error: 'Invalid Instagram post URL format' },
          { status: 400 }
        )
      }
    }

    // Read existing logs
    const fileContents = await fs.readFile(LOG_FILE_PATH, 'utf-8')
    const logs = JSON.parse(fileContents)

          // Add new log entry
          const newLog = {
            id: logs.length + 1,
            walletAddress,
            transactionHash,
            questId,
            timestamp: timestamp || new Date().toISOString(),
            status: 'completed',
            // Add social media post links if provided (for quest ID 2)
            ...(questId === 2 && xPostLink && instagramPostLink && {
              xPostLink,
              instagramPostLink
            }),
            // Add token amount if provided (for quest ID 1)
            ...(questId === 1 && tokenAmount && {
              tokenAmount
            })
          }

    logs.push(newLog)

    // Write back to file
    await fs.writeFile(LOG_FILE_PATH, JSON.stringify(logs, null, 2))

    return NextResponse.json({ success: true, log: newLog }, { status: 200 })
  } catch (error) {
    console.error('Error writing quest log:', error)
    return NextResponse.json(
      { error: 'Failed to write quest log' },
      { status: 500 }
    )
  }
}
