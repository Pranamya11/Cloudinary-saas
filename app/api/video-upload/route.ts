import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import error from 'next/error';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient()

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Log the configuration
console.log(cloudinary.config());

interface CloudinaryUploadResult {

    title: string;
    public_id: string;
    bytes: number;
    duration?: number;
    secure_url: string;
}


export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            console.log("Cloudinary env variables are not set properly");
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;



        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "videos-uploads",
                        transformation: [
                            {
                                quality: "auto", fetch_format: 'mp4',
                            }
                        ]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve({
                            title,
                            public_id: result?.public_id || '',
                            bytes: result?.bytes || 0,
                            duration: result?.duration,
                            secure_url: result?.secure_url || '',
                        } as CloudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer);

            }
        )
        const video = await prisma.video.create({
            data: {
                title,
                description: description,
                publicId: result.public_id,

                originalSize: originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,

            }
        })
        return NextResponse.json(video)


    } catch (error) {
        console.log("upload Video Failed", error)
        return NextResponse.json({ error: 'Upload Video Failed' }, { status: 500 });

    }
    finally {
        await prisma.$disconnect();
    }
}