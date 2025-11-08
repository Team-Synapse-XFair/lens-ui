import axios from 'axios';
import ReportDisplay from '@/components/reportDisplay';

export default async function ReportPage({ params }) {
	const { slug } = await params;

	const response = await axios
		.get(`${process.env.LENS_API_URL}/report/${slug}`, {
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
				<h1 className="text-2xl font-bold mb-4">Report: {slug}</h1>
				<p className="text-lg">Failed to load report.</p>
			</div>
		);
	}

	const report = response.report;

	return (
		<ReportDisplay report={report} />
	);
}
