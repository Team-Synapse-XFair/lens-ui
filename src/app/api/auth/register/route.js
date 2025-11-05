import axios from 'axios';
import { NextResponse } from 'next/server';

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const body = await req.json();

    console.log('Received registration request with body:', body);

    const { username, name, email, password } = body;
    
    try {
        const response = await axios.post(`${process.env.LENS_API_URL}/auth/register`, {
            username,
            name,
            email,
            password
        });

        if (response.data.success) {
            return NextResponse.json({ success: true, message: 'Registration successful' }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: response.data.message || 'Registration failed' }, { status: 400 });
        }

    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export { handler as POST };