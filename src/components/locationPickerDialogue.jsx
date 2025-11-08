'use client';

import { useState, useEffect } from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function LocationPickerDialogue({ onSelect, openState }) {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(openState);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			async function fetchLocations() {
				if (!query.trim()) {
					setResults([]);
					return;
				}
				setLoading(true);
				const res = await fetch(
					`/api/nominatim?q=${encodeURIComponent(query)}`
				);
				const data = await res.json();
				setResults(data);
				setLoading(false);
			}
			fetchLocations();
		}, 250);

		return () => clearTimeout(delayDebounceFn);
	}, [query]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="secondary">Pick Location</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Pick a Location</DialogTitle>
					<DialogDescription>
						Search for a location and select it from the results.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex space-x-2">
						<Input
							type="text"
							autoFocus
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Enter location"
						/>
						{/* Inline Loading Spinner */}
						{loading && <Spinner className="w-6 h-6" />}
					</div>
					<div className="max-h-60 overflow-y-auto">
						{results.map((result) => (
							<div
								key={result.place_id}
								className="p-2 hover:bg-accent hover:cursor-pointer rounded"
								onClick={() => {
									const location = {
										lat: result.lat,
										lon: result.lon,
										display_name: result.display_name,
									};
									onSelect(location);
									setOpen(false);
								}}
							>
								{result.display_name}
							</div>
						))}
						{loading && <p>Loading...</p>}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
