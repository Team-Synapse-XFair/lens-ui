import { NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request) {
    const body = await request.json()

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized', "success": false }, { status: 401 });
    }

    const { title, description, severity, images, location } = body;

    const payload = {
        "title": title,
        "description": description,
        "severity": severity,
        "images": images,
        "location": location
    }

    const response = await axios.post(`${process.env.LENS_API_URL}/report`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`
        }
    });

    const { data } = response;

    if (data.success == true) {
        return NextResponse.json({ message: 'Report submitted successfully', "success": true, "reportId": data.id }, { status: 201 });
    }

    return NextResponse.json({ message: 'Failed to submit report', "success": false }, { status: 500 });
}