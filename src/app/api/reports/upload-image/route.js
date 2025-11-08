import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
    const formData = await request.formData();
    const file = formData.get('file');

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    const fileName = file.name;
    const fileSize = file.size;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
        return NextResponse.json({ success: false, message: 'Unsupported file type.' }, { status: 400 });
    }

    if (fileSize > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, message: 'File size exceeds the 5MB limit.' }, { status: 400 });
    }

    const data = new FormData();
    data.append('file', file, fileName);

    const result = await axios.post(`${process.env.LENS_API_URL}/upload`, data, {
        headers: {
            'Content-Type': file.type,
            'Authorization': `Bearer ${session.accessToken}`,
        },
        validateStatus: () => true,
    });

    if (result.data.success !== true) {
        console.error('Image upload failed with status:', result.status);
        console.error('Response data:', result.data);
        return NextResponse.json({ success: false, message: 'Image upload failed.' }, { status: 500 });
    }

    const fileUrl = result.data.file_url;
    const fileId = result.data.file_id;

    return NextResponse.json({ success: true, fileUrl, fileId }, { status: 200 });
}