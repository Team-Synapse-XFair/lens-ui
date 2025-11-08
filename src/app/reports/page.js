import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from '@/components/ui/item';
import {
    Carousel,
    CarouselItem,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';

export default async function ReportsPage() {
	const session = await getServerSession(authOptions);

	const response = await axios.get(`${process.env.LENS_API_URL}/getreports`, {
		headers: { 'Content-Type': 'application/json' },
	});

	if (!response || response.status !== 200) {
		return (
			<div className="p-4 md:p-8 text-center">
				<h1 className="text-2xl font-bold mb-4">Reports</h1>
				<p className="text-lg">Failed to load reports.</p>
			</div>
		);
	}

	const reports = response.data.reports.reverse();

	// Fetch all images for each report (in parallel)
	const reportsWithImages = await Promise.all(
		reports.map(async (report) => {
			try {
				const imageResponse = await axios.get(
					`${process.env.LENS_API_URL}/getreportimages/${report['id']}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${session?.accessToken}`,
						},
					}
				);
				const imageUrls =
					imageResponse.data?.images?.map((img) => img.id) ||
					[];
				console.log(
					`Fetched images for report ${report.id}:`,
					imageUrls
				);
				return { ...report, images: imageUrls };
			} catch (err) {
				console.error(`Failed to fetch images for ${report.id}`, err);
				return { ...report, images: [] };
			}
		})
	);

	return (
		<div className="p-4 md:p-8 text-center">
			<h1 className="text-2xl font-bold mb-4">Reports</h1>
			<div className="mb-6 flex justify-center">
				<div className="space-y-4">
					{reportsWithImages.map((report) => (
						<Item
							key={report.id}
							className="border rounded-lg p-4 border-none bg-secondary/50"
						>
							<ItemContent className="flex flex-col items-start gap">
								<div className="flex justify-between w-full items-center mb-2 gap-4">
									<div className="flex flex-col items-start">
										<ItemTitle className="text-md font-bold">
											<Link className='hover:underline hover:cursor-pointer' href={`report/${report.id}`}>{report.title}{' '}</Link>
											<span className="text-sm font-mono text-muted-foreground">
												({report.id})
											</span>
										</ItemTitle>
										<ItemDescription>
											{report.description}
										</ItemDescription>
									</div>
									<span
										className={`px-2 py-1 rounded text-sm font-medium ${
											report.severity === 'low'
												? 'bg-green-100 text-green-800'
												: report.severity === 'medium'
												? 'bg-yellow-100 text-yellow-800'
												: report.severity === 'high'
												? 'bg-red-100 text-red-800'
												: 'bg-gray-100 text-gray-800'
										}`}
									>
										{report.severity
											.charAt(0)
											.toUpperCase() +
											report.severity.slice(1)}
									</span>
								</div>
                                <Carousel className="w-full max-w-md mt-2">
                                    <CarouselContent className="flex gap-4">
                                        {report.images.map((url, index) => (
                                            <CarouselItem
                                                key={index}
                                                className="basis-full"
                                            >
                                            <img
                                                src={`http://localhost:5000/api/v1/file/${url}`}
                                                alt={`Uploaded ${index}`}
                                                className="w-full h-48 object-cover rounded-lg border"
                                                width={400}
                                                height={192}
                                            />
                                            </CarouselItem>
                                        ))}
                                            </CarouselContent>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </Carousel>
							</ItemContent>
						</Item>
					))}
				</div>
			</div>
		</div>
	);
}
