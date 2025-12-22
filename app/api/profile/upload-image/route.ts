import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { clientID: number };
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const type = formData.get('type') as 'profile' | 'cover';

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be less than 5MB' }, { status: 400 });
    }

    // Create unique filename
    const timestamp = Date.now();
    const extension = image.name.split('.').pop();
    const filename = `${type}-${decoded.clientID}-${timestamp}.${extension}`;
    
    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
    const filepath = path.join(uploadDir, filename);
    
    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true });

    // Convert file to buffer and save
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Update database
    const imageUrl = `/uploads/profiles/${filename}`;
    const updateData = type === 'profile' 
      ? { profileImage: imageUrl }
      : { coverImage: imageUrl };

    await prisma.client.update({
      where: { clientID: decoded.clientID },
      data: updateData
    });

    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      imageUrl 
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
