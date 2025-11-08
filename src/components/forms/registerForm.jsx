'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
import { Spinner } from '@/components/ui/spinner';

const registerSchema = z
	.object({
		username: z
			.string()
			.min(3, { message: 'Username must be at least 3 characters' }),
		firstname: z.string().nonempty({ message: 'First name is required' }),
		lastname: z.string().nonempty({ message: 'Last name is required' }),
		email: z.email({ message: 'Invalid email address' }),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(32, { message: 'Password must be at most 32 characters' })
			.refine((val) => /[A-Z]/.test(val), {
				message: 'Password must contain at least one uppercase letter',
			})
			.refine((val) => /[a-z]/.test(val), {
				message: 'Password must contain at least one lowercase letter',
			})
			.refine((val) => /[0-9]/.test(val), {
				message: 'Password must contain at least one number',
			})
			.refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
				message: 'Password must contain at least one special character',
			}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export default function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [serverError, setServerError] = useState(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data) => {
		setLoading(true);
		setServerError(null);

		try {
			const response = await axios.post('/api/auth/register', {
				username: data.username,
				name: `${data.firstname} ${data.lastname}`,
				email: data.email,
				password: data.password,
			});

			if (!response.data.success) {
				setServerError(
					response.data.message ||
						'Registration failed. Please try again.'
				);
				setLoading(false);
				return;
			}
		} catch (error) {
			console.error('Error during registration:', error);
			setServerError('Internal Server Error. Please try again later.');
			setLoading(false);
			return;
		}

		// Auto Log in after successful registration
		const result = await signIn('credentials', {
			redirect: false,
			email: data.email,
			password: data.password,
		});

		setLoading(false);

		if (!result) {
			console.log(
				'No response from server during login after registration.'
			);
			router.push('/auth/login');
			return;
		} else if (result.error) {
			setServerError(
				result.error ||
					'Login after registration failed. Please try to login manually.'
			);
			return;
		}

		router.push('/');
	};

	return (
		<div className="flex items-center justify-center bg-background">
			<Card className="w-full p-6 pt-1 pb-2 bg-card-border/50 border-none shadow-none">
				<CardHeader>
					<CardDescription className="text-center mb-6">
						Please fill in the details to register.
					</CardDescription>
				</CardHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full max-w-md space-y-6"
				>
					<CardContent className="grid gap-7">
						{serverError && (
							<div className="text-sm text-destructive bg-sidebar-primary/10 p-2 rounded">
								{serverError}
							</div>
						)}
						<div className="grid gap-3">
							<div className="grid gap-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									type="text"
									placeholder="Enter your username"
									{...register('username')}
								/>
								{errors.username && (
									<p className="text-sidebar-primary text-sm">
										{errors.username.message}
									</p>
								)}
							</div>
							{/* First Name and Last Name in one line */}
							<div className="flex space-x-4">
								<div className="flex-1 grid gap-2">
									<Label htmlFor="firstname">
										First Name
									</Label>
									<Input
										id="firstname"
										type="text"
										placeholder="First Name"
										{...register('firstname')}
									/>
									{errors.firstname && (
										<p className="text-sidebar-primary text-sm">
											{errors.firstname.message}
										</p>
									)}
								</div>
								<div className="flex-1 grid gap-2">
									<Label htmlFor="lastname">Last Name</Label>
									<Input
										id="lastname"
										type="text"
										placeholder="Last Name"
										{...register('lastname')}
									/>
									{errors.lastname && (
										<p className="text-sidebar-primary text-sm">
											{errors.lastname.message}
										</p>
									)}
								</div>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									{...register('email')}
								/>
								{errors.email && (
									<p className="text-sidebar-primary text-sm">
										{errors.email.message}
									</p>
								)}
							</div>
						</div>
						<div className="grid gap-3">
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={
											showPassword ? 'text' : 'password'
										}
										placeholder="Enter your password"
										{...register('password')}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-0.5 top-1/2 -translate-y-1/2 p-0 hover:cursor-pointer"
										onClick={() =>
											setShowPassword(!showPassword)
										}
									>
										{showPassword ? (
											<EyeOff size={16} />
										) : (
											<Eye size={16} />
										)}
									</Button>
								</div>
								{errors.password && (
									<p className="text-sidebar-primary text-sm">
										{errors.password.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="confirmPassword">
									Confirm Password
								</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										type={
											showPassword ? 'text' : 'password'
										}
										placeholder="Confirm your password"
										{...register('confirmPassword')}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-0.5 top-1/2 -translate-y-1/2 p-0 hover:cursor-pointer"
										onClick={() =>
											setShowPassword(!showPassword)
										}
									>
										{showPassword ? (
											<EyeOff size={16} />
										) : (
											<Eye size={16} />
										)}
									</Button>
								</div>
								{errors.confirmPassword && (
									<p className="text-sidebar-primary text-sm">
										{errors.confirmPassword.message}
									</p>
								)}
							</div>
						</div>
					</CardContent>
				</form>
				<CardFooter className="flex flex-col gap-4 mt-2">
					<Button
						type="submit"
						className="w-full py-2 transition-all duration-300 transform hover:bg-chart-1 hover:scale-[1.05] hover:cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
						onClick={handleSubmit(onSubmit)}
						disabled={loading}
					>
						{loading ? <Spinner className="mr-2" /> : null}
						{loading ? 'Registering...' : 'Register'}
					</Button>
					<div className="text-sm text-center text-muted-foreground">
						Already have an account?{' '}
						<a
							href="/auth/login"
							className="text-primary hover:underline"
						>
							Login here
						</a>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
