import { NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    console.log('Received builder creation request with body:', body);

    const { name, estd, location, email, phone, website, projects } = body;

    if (!name || !email) {
        console.error('Validation failed: Name and Email are required.');
        return NextResponse.json({ success: false, message: 'Name and Email are required.' }, { status: 400 });
    }

    const contact = {
        email,
        phone: phone || '',
        website: website || '',
    };

    const payload = {
        name,
        estd: estd || '',
        hq_location: location || [],
        contact,
        projects: projects || [],
    };

    const response = await axios.post(`${process.env.LENS_API_URL}/builders/create`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
        },
    });

    const { data } = response;
    console.log('Builder creation response from API:', data);
    if (data.success) {
        return NextResponse.json({ success: true, builderId: data.builder._id }, { status: 200 });
    } else {
        console.error('Builder creation failed with message:', data.message);
        return NextResponse.json({ success: false, message: data.message || 'Builder creation failed.' }, { status: 500 });
    }

}