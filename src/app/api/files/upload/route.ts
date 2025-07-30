import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: 'File size too large. Maximum 10MB allowed.'
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory already exists or other error
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name}`
    const filePath = path.join(uploadsDir, fileName)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return file info
    return NextResponse.json({
      success: true,
      data: {
        id: timestamp.toString(),
        name: file.name,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: `/uploads/${fileName}`,
        uploadedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({
      success: false,
      error: 'File upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Handle file listing
export async function GET() {
  try {
    // Mock file list for now - replace with real database query
    const mockFiles = [
      {
        id: '1',
        name: 'TD_Studios_Brand_Guide.pdf',
        size: 2048000,
        type: 'application/pdf',
        url: '/uploads/mock_brand_guide.pdf',
        uploadedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: '2',
        name: 'Command_Hub_Screenshot.png',
        size: 1024000,
        type: 'image/png',
        url: '/uploads/mock_screenshot.png',
        uploadedAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockFiles
    })

  } catch (error) {
    console.error('File listing error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve files'
    }, { status: 500 })
  }
}
