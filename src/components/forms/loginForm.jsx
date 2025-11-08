'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
	CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
	email: z.email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
});

export default function LoginForm({ redirectTo = '/' }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [serverError, setServerError] = useState(null);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data) => {
		setLoading(true);
		setServerError(null);

		console.log('Submitting login form with data:', data);

		const result = await signIn('credentials', {
			redirect: false,
			email: data.email,
			password: data.password,
		});

		console.log('SignIn result:', result);
		setLoading(false);

		if (!result) {
			setServerError('No response from server. Please try again.');
			return;
		} else if (result.error) {
			setServerError(result.error || 'Login failed. Please try again.');
			return;
		}

		router.push(redirectTo);
	};

	return (
		<div className="flex items-center justify-center bg-background">
			<Card className="w-full p-6 pt-1 bg-card-border/50 border-none shadow-none">
				<CardHeader>
					<CardDescription className="text-center">
						Enter your credentials to continue
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className="grid gap-4">
						{serverError && (
							<div className="text-sm text-destructive bg-sidebar-primary/10 p-2 rounded">
								{serverError}
							</div>
						)}

						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								{...register('email')}
							/>
							{errors.email && (
								<p className="text-xs text-sidebar-primary">
									{errors.email.message}
								</p>
							)}
						</div>

						<div className="grid gap-2 mb-4">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									{...register('password')}
								/>
								<Button
									type="button"
									size="icon"
									onClick={() =>
										setShowPassword((prev) => !prev)
									}
									className="absolute right-0 top-1/2 -translate-y-1/2 hover:cursor-pointer border-none bg-transparent hover:bg-input/50 size-8 mr-0.5"
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
							{errors.password && (
								<p className="text-xs text-sidebar-primary">
									{errors.password.message}
								</p>
							)}
						</div>
					</CardContent>

					<CardFooter className="flex flex-col gap-3 mt-2">
						<Button
							type="submit"
							className="w-full py-2 transition-all duration-300 transform hover:bg-chart-1 hover:scale-[1.05] hover:cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
							disabled={loading}
						>
							{loading ? 'Signing in...' : 'Sign in'}
						</Button>
						<a
							href="/auth/forgot"
							className="text-sm underline text-center"
						>
							Forgot password?
						</a>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
