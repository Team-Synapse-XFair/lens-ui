import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle
} from '@/components/ui/item';
import Image from 'next/image';

export default function ReportsPage() {
    // A list of all reports - for now, static
    const reports = [
        {
            id: 'RPT-001',
            title: 'Pothole on Main St.',
            description: 'A large pothole has formed on Main St. near the intersection with 1st Ave.',
            severity: 'high'
        },
    ];

    return (
        <div className="p-4 md:p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Reports</h1>
            <div className="mb-6 flex justify-center">
            <div className="space-y-4">
                {/* Items with image, title, description, severity badge */}
                {reports.map((report) => (  
                    <Item key={report.id} className="border rounded-lg p-4 border-none bg-secondary/50">
                        <ItemContent className="flex flex-col items-start gap">
                        <div className="flex justify-between w-full items-center mb-2 gap-4">
                        <div className="flex flex-col items-start">
                            <ItemTitle>{report.title} <span className="text-sm font-mono text-muted-foreground">({report.id})</span></ItemTitle>
                            <ItemDescription>{report.description}</ItemDescription>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                            report.severity === 'low' ? 'bg-green-100 text-green-800' :
                            report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            report.severity === 'high' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                        </span>
                        </div>
                            <Image src="/images/lol.png" alt="Report Image" width={400} height={200} className="mt-2 rounded-md mx-0 border-secondary border-2" />
                        </ItemContent>
                        {/* ItemActions inline with ItemContent */}
                    </Item>
                ))}
            </div>
            </div>
        </div>
    );
}