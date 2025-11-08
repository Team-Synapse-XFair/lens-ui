'use client';

import { useEffect, useState } from 'react';

export default function LoadingWrapper({ children }) {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setLoaded(true), 50);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div
			className={`transition-opacity duration-300 ${
				loaded ? 'opacity-100' : 'opacity-0'
			}` } style={{ minHeight: 'calc(100vh - var(--header-height))' }}
		>
			{children}
		</div>
	);
}
