import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth/login');
    }

    return (
        <div className="flex items-center justify-center bg-background px-4" style={{ height: "calc(100vh - var(--header-height))" }}>
            <div className="max-w-4xl w-full bg-transparent border-none">
                <h2 className="text-2xl font-bold text-center mb-6">Welcome to Your Dashboard, {session.user.name}!</h2>
                <p className="text-center text-muted-foreground">This is your dashboard where you can manage your account and view your activities.</p>
            </div>
        </div>
    );
}