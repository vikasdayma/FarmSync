import { v2 as cloudinary } from 'cloudinary'
import { NextRequest, NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert File to base64 for Cloudinary
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'marketplace',   // organizes uploads in a folder
    })

    return NextResponse.json(
      { url: result.secure_url },
      { status: 200 }
    )

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { message: 'Upload failed' },
      { status: 500 }
    )
  }
}
