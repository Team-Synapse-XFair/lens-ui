'use client';

import { useSearchParams } from 'next/navigation';

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const reportId = searchParams.get('reportId');

    return (
        <div className="flex items-center justify-center bg-background px-4" style={{ height: "calc(100vh - var(--header-height))" }}>
            <div className="max-w-md sm:max-w-md lg:max-w-lg w-full bg-background p-6 rounded-lg border text-center">
                <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
                {!reportId && <p className="text-lg">Your report has been submitted successfully.</p>}
                {reportId && (<p className="text-lg">Your report has been submitted successfully. Your Report ID is <span className="font-mono font-bold text-primary">{reportId}</span>.</p>)}
            </div>
        </div>
    );
}