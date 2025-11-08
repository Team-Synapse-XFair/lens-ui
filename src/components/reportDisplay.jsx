'use client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ReportDisplay({ report, session, handleCommentSubmit, getImgSrc }) {
    return (
        <div className="m-4 md:m-8 text-center bg-accent/20 rounded">
			<div className="p-4 md:p-8">
				<h1 className="text-2xl font-bold">{report.title}</h1>
				<span className="text-sm font-mono text-muted-foreground mb-4">
					({report._id})
				</span>
				<p className="text-lg">{report.description}</p>
			</div>
			<div className="p-4 md:p-8 border-t border-accent/40">
				<h2 className="text-xl font-semibold mb-4">Report Details</h2>
				<pre className="text-left bg-secondary/50 p-4 rounded overflow-x-auto">
                    <div className='flex flex-col items-start gap-2'>
                        <div className='w-full flex flex-col items-center'>
                            <span className='text-xl'>Location:</span>
                            <span className='text-xl'>{report.location.display_name}</span>
                            <br />
                            <span className='text-xl'>Date: </span>
                            <span className='text-xl'>{new Date(report.created_at).toLocaleString()}</span>
                            <br />
                            <div className='flex flex-col items-center'><span className='text-xl'>Severity:</span>
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
                                {report.severity.charAt(0).toUpperCase() +
                                    report.severity.slice(1)}
                            </span></div>
                        </div>
                    </div>
					<br />
                    <div className='w-full flex items-start gap-2 my-2'>
                        <div className='flex-1 h-full'>
                            <div className="mt-4 flex flex-col items-center">
                                <h2 className="text-xl font-semibold mb-2">Images</h2>
                                {report.images && report.images.length > 0 ? (
                                    <Carousel className="w-full h-64 max-w-md mx-auto relative">
                                        <CarouselContent className="overflow-hidden h-64">
                                            {report.images.map((imgId) => (
                                                <CarouselItem
                                                    key={imgId}
                                                    className="basis-full"
                                                >
                                                    <img
                                                        src={`http://localhost:5000/api/v1/file/${imgId}`}
                                                        alt={`Report Image ${imgId}`}
                                                        className="w-full h-64 object-cover rounded-lg border"
                                                    />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
                                ) : (
                                    ' None'
                                )}
                            </div>
                        </div>
                        <div className='flex-1'>
                            <div className="mt-4 flex flex-col items-center">
                                <h2 className="text-xl font-semibold mb-2">Map Location</h2>
                                <div className="max-w-2/4 w-full h-64 bg-gray-200 rounded-lg border overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                                            report.location.lat + ',' + report.location.lon
                                        )}&output=embed`}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
				</pre>
                {/* Comment Section */}
                <div className="mt-8 text-left">
                    <h2 className="text-xl font-semibold mb-4">Comments</h2>
                    {report.comments && report.comments.length > 0 ? (
                        <ul className="space-y-4">
                            {report.comments.map((comment) => (
                                <li key={comment._id} className="bg-secondary/50 p-4 rounded-lg">
                                    <p className="mb-2">{comment.text}</p>
                                    <span className="text-sm text-muted-foreground">
                                        - {comment.author} on {new Date(comment.date).toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No comments yet.</p>
                    )}
                    <div className="mt-4">
                        <Textarea
                            className="w-full p-2 border rounded-lg mb-2 resize-none overflow-hidden"
                            rows="1"
                            placeholder="Add a comment..."
                        ></Textarea>
                        <Button className='bg-primary hover:cursor-pointer' onClick={() => alert('Comment submission not implemented yet.')}>
                            Submit Comment
                        </Button>
                    </div>
                </div>
			</div>
		</div>
    )
}