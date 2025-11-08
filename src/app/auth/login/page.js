import LoginForm from '@/components/forms/loginForm';

export default function LoginPage() {
	return (
		<div
			className="flex items-center justify-center bg-background px-4"
			style={{ height: 'calc(100vh - var(--header-height))' }}
		>
			<div className="max-w-md sm:max-w-md lg:max-w-lg w-full bg-background p-2 py-8 pt-12 rounded-lg border">
				<h2 className="text-2xl font-bold text-center">
					Login to Your Account
				</h2>
				<LoginForm />
			</div>
		</div>
	);
}
