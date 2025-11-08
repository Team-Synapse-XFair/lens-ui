'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ReportFormHeader from '@/components/report/formHeader';
import {
	CardDescription,
	CardContent,
	CardFooter,
	Card,
	CardHeader,
} from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

import LocationPickerDialogue from './../locationPickerDialogue';
import SmallMap from '././smallMap';

const reportSchema = z.object({
	title: z.string().min(5, 'Title must be at least 5 characters long'),
	description: z.string(),
	severity: z.enum(['low', 'medium', 'high'], 'Severity is required'),
});

const severityOptions = [
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'high', label: 'High' },
];

export default function ReportForm() {
	const router = useRouter();
	const [serverError, setServerError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [images, setImages] = useState([]);
	const [imageIDs, setImageIDs] = useState([]);
	const [location, setLocation] = useState(null);
	const [editLocationOpen, setEditLocationOpen] = useState(false);

	const handleFileChange = async (e) => {
		const files = Array.from(e.target.files);
		setUploading(true);

		const uploadedImages = [];
		for (const file of files) {
			const formData = new FormData();
			formData.append('file', file);

			try {
				const response = await axios.post(
					'/api/reports/upload-image',
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				);
				const { data } = response;
				if (data.success) {
					uploadedImages.push(data.fileUrl);
					setImageIDs((prev) =>
						prev.includes(data.fileId)
							? prev
							: [...prev, data.fileId]
					);
				} else {
					setServerError(data.message || 'Image upload failed.');
				}
			} catch (error) {
				setServerError('An error occurred during image upload.');
				console.log('Image upload error:', error);
			}
		}
		console.log('All uploaded images:', uploadedImages);
		setImages(uploadedImages);
		console.log('Uploaded images:', uploadedImages);
		setUploading(false);
	};

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(reportSchema),
	});

	const onSubmit = async (data) => {
		setLoading(true);
		setServerError(null);

		const reportData = {
			title: data.title,
			description: data.description,
			severity: data.severity,
			images: imageIDs,
			location: location,
		};

		const response = await axios.post('/api/reports/submit', reportData, {
			headers: { 'Content-Type': 'application/json' },
		});

		const respData = response.data;

		if (!respData.success) {
			setServerError(
				respData.message ||
					'An error occurred while submitting the report.'
			);
		}

		setLoading(false);

		router.push('/reports/thank-you?reportId=' + respData.reportId);
	};

	return (
		<div className="flex items-center justify-center bg-background">
			<Card className="w-full p-6 pt-1 pb-0 mb-5 bg-background border-none shadow-none gap-2 md:gap-4">
				<ReportFormHeader />
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full space-y-6"
				>
					<CardContent className="grid gap-5">
						{serverError && (
							<div className="text-sm text-destructive bg-sidebar-primary/10 p-2 rounded">
								<AlertCircle
									className="inline mr-1.5 mb-[0.75]"
									size={16}
								/>
								{serverError}
							</div>
						)}
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-2 space-y-4">
								<div className="grid gap-2">
									<Label htmlFor="title">Title</Label>
									<Input
										id="title"
										{...register('title')}
										placeholder="Report Title"
									/>
									{errors.title && (
										<p className="text-sidebar-primary text-sm">
											{errors.title.message}
										</p>
									)}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="description">
										Description
									</Label>
									<Textarea
										id="description"
										{...register('description')}
										placeholder="Detailed description of the issue"
										rows={4}
									/>
									{errors.description && (
										<p className="text-sidebar-primary text-sm">
											{errors.description.message}
										</p>
									)}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="images">
										Upload Images
									</Label>
									<Input
										id="images"
										type="file"
										accept="image/*"
										multiple
										onChange={(e) => handleFileChange(e)}
										className="text-muted-foreground hover:cursor-pointer"
									/>
									{uploading && (
										<p className="text-sm text-muted-foreground">
											Uploading images...
										</p>
									)}
									{images.length > 0 && (
										<Carousel className="w-full max-w-md mt-2">
											<CarouselContent>
												{images.map((url, index) => (
													<CarouselItem
														key={index}
														className="basis-full"
													>
														<img
															src={url}
															alt={`Uploaded ${index}`}
															className="w-full h-48 object-cover rounded-lg border"
														/>
													</CarouselItem>
												))}
											</CarouselContent>
											<CarouselPrevious />
											<CarouselNext />
										</Carousel>
									)}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="severity">Severity</Label>
									<Controller
										control={control}
										name="severity"
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger
													id="severity"
													className="w-full"
												>
													<SelectValue placeholder="Select severity" />
												</SelectTrigger>
												<SelectContent>
													{severityOptions.map(
														(option) => (
															<SelectItem
																key={
																	option.value
																}
																value={
																	option.value
																}
															>
																{option.label}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
										)}
									/>
									{errors.severity && (
										<p className="text-sidebar-primary text-sm">
											{errors.severity.message}
										</p>
									)}
								</div>
							</div>
							<div className="flex-2 space-y-4">
								<div className="grid gap-2 w-full">
									<Label htmlFor="location">Location</Label>
									<LocationPickerDialogue
										onSelect={(location) =>
											setLocation(location)
										}
										openState={editLocationOpen}
									/>
								</div>
								{
									<div className="grid gap-2 w-full">
										<Label>Selected Location</Label>
										<div className="aspect-square w-full border rounded-lg overflow-hidden">
											<SmallMap
												latitude={
													location
														? location.lat
														: 23.73947
												}
												longitude={
													location
														? location.lon
														: 79.46724
												}
												markerText={
													location
														? location.display_name
														: ''
												}
												zoom={4}
											/>
										</div>
										<p className="text-sm">
											{location
												? location.display_name
												: ''}
										</p>
										<Button
											variant="link"
											className="p-0 text-sm self-start"
											onClick={() => {
												setLocation(null);
												setEditLocationOpen(true);
											}}
										>
											Edit Location
										</Button>
									</div>
								}
							</div>
						</div>
					</CardContent>
				</form>
				<CardFooter className="pt-3">
					<Button
						onClick={handleSubmit(onSubmit)}
						disabled={loading}
						className="w-full"
					>
						{loading ? <Spinner className="mr-2" /> : null}
						{loading ? 'Submitting...' : 'Submit Report'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
