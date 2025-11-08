import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/auth/login');
	}

	const username = session.user.name || 'User';

	return (
		<div
			className="flex items-center justify-center bg-background px-4"
			style={{ height: 'calc(100vh - var(--header-height))' }}
		>
			<div className="max-w-4xl w-full bg-transparent border-none">
				<h1 className="text-3xl font-bold mb-4 text-center">
					Welcome to your Dashboard, {username}!
				</h1>
				<p className="text-lg text-center mb-8">
					Manage your reports and view your activity here.
				</p>
				{/*
                <p className="text-lg text-center">This is your dashboard where you can manage your reports and view your activity.</p>
                <div className="mt-8 p-4 border rounded-lg bg-secondary/50">
                    <h2 className="text-2xl font-semibold mb-4">Your Recent Reports</h2>
                    <p className="text-center text-muted-foreground">You have not submitted any reports yet.</p>
                </div>
                */}
			</div>
		</div>
	);
}
