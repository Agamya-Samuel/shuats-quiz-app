'use client';

import { getAdmins } from '@/actions/admin';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface IAdmin {
	id: number;
	username: string;
	password?: string; // Including password as optional since it might be returned from API but shouldn't be displayed
	createdAt?: Date;
	isActive?: boolean;
}

export function AdminList() {
	const [admins, setAdmins] = useState<IAdmin[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const fetchAdmins = async () => {
		setLoading(true);
		try {
			const { success, admins } = await getAdmins();
			if (success && Array.isArray(admins)) {
				setAdmins(admins as IAdmin[]);
			}
		} catch (error) {
			console.error('Error fetching admins:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAdmins();
	}, []);

	const filteredAdmins = admins.filter((admin) =>
		admin.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Loading Component
	const LoadingState = () => (
		<div className="space-y-4">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="flex items-center gap-4 p-4 border rounded-lg"
				>
					<Skeleton className="h-10 w-10 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-3 w-24" />
					</div>
				</div>
			))}
		</div>
	);

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search administrators..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={fetchAdmins}
					disabled={loading}
					className="w-full sm:w-auto"
				>
					<RefreshCw
						className={`h-4 w-4 mr-2 ${
							loading ? 'animate-spin' : ''
						}`}
					/>
					Refresh
				</Button>
			</div>

			{loading ? (
				<LoadingState />
			) : filteredAdmins.length === 0 ? (
				<div className="text-center py-8 border rounded-lg bg-muted/20">
					{searchQuery ? (
						<>
							<p className="text-lg font-medium">
								No matching administrators found
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								Try a different search term
							</p>
						</>
					) : (
						<>
							<p className="text-lg font-medium">
								No administrators found
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								Create an administrator to get started
							</p>
						</>
					)}
				</div>
			) : (
				<div className="grid gap-4">
					{filteredAdmins.map((admin, index) => (
						<div
							key={index}
							className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors"
						>
							<div className="flex items-center gap-4">
								<Avatar>
									<AvatarFallback className="bg-primary/10 text-primary">
										{admin.username
											.substring(0, 2)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-medium">
										{admin.username}
									</h3>
									<p className="text-sm text-muted-foreground">
										Administrator
									</p>
								</div>
							</div>
							<Badge variant="outline" className="bg-primary/10">
								Active
							</Badge>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
