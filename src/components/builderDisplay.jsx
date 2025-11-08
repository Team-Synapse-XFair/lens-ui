'use client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function BuilderDisplay({ builder, session, handleCommentSubmit }) {
    console.log('Builder data:', builder);
    return (
        <div className="m-4 md:m-8 text-center bg-accent/20 rounded">
			<div className="p-4 md:p-8">
				<h1 className="text-2xl font-bold">{builder.name}</h1>
				<span className="text-sm font-mono text-muted-foreground mb-4">
					({builder._id})
				</span>
				<p className="text-lg">{builder.description}</p>
			</div>
			<div className="p-4 md:p-8 border-t border-accent/40">
				<h2 className="text-xl font-semibold mb-4">Builder Details</h2>
				<pre className="text-left bg-secondary/50 p-4 rounded overflow-x-auto">
                    <div className='flex flex-col items-start gap-2'>
                        <div className='w-full flex flex-col items-start'>
                            <span className='text-xl'>Location: {builder.hq_location.display_name}</span>
                            <br />
                            <span className='text-xl'>Date: {new Date(builder.created_at).toLocaleString()}</span>
                            <br />
                            <span className='text-xl'>Established Year: {new Date(builder.estd).getFullYear() || 'N/A'}</span>
                        </div>
                    </div>
					<br />
                    <div className='w-full flex flex-col items-start gap-2'>
                        <div className='w-full flex flex-col items-start'>
                            <h2 className="text-xl mb-2">Contact Information: </h2>
                            <div className='ml-8'>
                                <p><strong>Email:</strong> {builder.contact.email || 'N/A'}</p>
                                <p><strong>Phone:</strong> {builder.contact.phone || 'N/A'}</p>
                                <p><strong>Website:</strong> {builder.contact.website ? (
                                    <a href={builder.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                        {builder.contact.website}
                                    </a>
                                ) : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex items-start gap-2 my-2'>
                        <div className='flex-1'>
                            <div className="mt-4 flex flex-col items-center">
                                <h2 className="text-xl font-semibold mb-2">Map Location</h2>
                                <div className="max-w-2/4 w-full h-96 bg-gray-200 rounded-lg border overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                                            builder.hq_location.lat + ',' + builder.hq_location.lon
                                        )}&output=embed`}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Accountability Report Section */}
                    <div className='w-full flex flex-col items-start gap-2 my-2'>
                        <div className='w-full flex flex-col items-start'>
                            <h2 className="text-xl mb-2">Accountability Reports:</h2>
                            {builder.reports && builder.reports.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {builder.reports.map((report) => (
                                        <li key={report._id} className="mb-2">
                                            <a
                                                href={`/report/${report._id}`}
                                                className="text-blue-500 underline"
                                            >
                                                {report.title || `Report ID: ${report._id}`}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No reports available.</p>
                            )}
                        </div>
                    </div>
				</pre>
                {/* Comment Section */}
                <div className="mt-8 text-left">
                    <h2 className="text-xl font-semibold mb-4">Comments</h2>
                    {builder.comments && builder.comments.length > 0 ? (
                        <ul className="space-y-4">
                            {builder.comments.map((comment) => (
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