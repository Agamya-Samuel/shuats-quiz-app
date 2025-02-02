'use client';

import { getMaintainers } from '@/actions/maintainer';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface IMaintainer {
	username: string;
	password: string;
}

export function AdminList() {
	const [maintainers, setMaintainers] = useState<IMaintainer[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchMaintainers = async () => {
		setLoading(true);
		const { success, maintainers } = await getMaintainers();
		if (success) {
			setMaintainers(maintainers as IMaintainer[]);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchMaintainers();
	}, []);

	// Loading Component
	const LoadingState = () => (
		<Card className="w-full flex items-center justify-center h-full">
			<CardContent className="p-6">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
				</div>
			</CardContent>
		</Card>
	);

	if (loading) {
		return <LoadingState />;
	}

	return (
		<div className="container mx-auto">
			<div className="max-w-sm">
				<ul className="space-y-2">
					{maintainers.map((maintainer, index) => (
						<li
							key={index}
							className="text-lg font-medium bg-gray-100 p-2 rounded-md"
						>
							{index + 1}. {maintainer.username}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
