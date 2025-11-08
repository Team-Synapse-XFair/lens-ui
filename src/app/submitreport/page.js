import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

import ReportForm from '@/components/forms/reportForm';

export default async function ReportPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/auth/login');
	}

	return (
		<div
			className="flex items-center justify-center bg-background m-4" style={{ minHeight: 'calc(100vh - 60px' }}
		>
			<div className="max-w-4xl w-full bg-background p-2 rounded-lg border overflow-y-hidden">
				<h2 className="text-2xl font-bold text-center mt-3">
					Submit a Report
				</h2>
				<ReportForm />
			</div>
		</div>
	);
}
