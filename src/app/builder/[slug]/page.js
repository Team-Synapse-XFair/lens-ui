import axios from 'axios';
import BuilderDisplay from '@/components/builderDisplay';

export default async function BuilderPage({ params }) {
	const { slug } = await params;

	const response = await axios
		.get(`${process.env.LENS_API_URL}/builders/${slug}`, {
			headers: { 'Content-Type': 'application/json' },
		})
		.then((res) => res.data)
		.catch((err) => {
			console.error(`Failed to load report ${slug}:`, err);
			return null;
		});

	if (!response) {
		return (
			<div className="p-4 md:p-8 text-center">
				<h1 className="text-2xl font-bold mb-4">Builder Id: {slug}</h1>
				<p className="text-lg">Failed to load report.</p>
			</div>
		);
	}

	const builder = response.builder;

	return (
		<BuilderDisplay builder={builder} />
	);
}
