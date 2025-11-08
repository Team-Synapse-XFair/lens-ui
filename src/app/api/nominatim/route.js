import { NextResponse } from 'next/server';

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const q = searchParams.get('q') || '';

	const res = await fetch(
		`https://nominatim.openstreetmap.org/search?format=json&q=${q}`,
		{
			headers: {
				'User-Agent': 'InfraLens/1.0 (contact@example.com)', // required by Nominatim TOS
			},
		}
	);

	const data = await res.json();
	return NextResponse.json(data);
}