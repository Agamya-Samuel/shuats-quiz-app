'use client';

// import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminForm } from './_components/admin-form';
import { AdminList } from './_components/admin-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SuperAdminPage() {
	return (
		<div className="container mx-auto py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">
					Admin Management
				</h1>
				<p className="text-muted-foreground">
					Create and manage administrators.
				</p>
			</div>

			<Tabs defaultValue="create" className="space-y-4">
				<TabsList>
					<TabsTrigger value="create">Create Admin</TabsTrigger>
					<TabsTrigger value="list">Admin List</TabsTrigger>
				</TabsList>

				<TabsContent value="create">
					<Card>
						<CardHeader>
							<CardTitle>Create New Admin</CardTitle>
						</CardHeader>
						<CardContent>
							<AdminForm />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="list">
					<Card>
						<CardHeader>
							<CardTitle>Admin List</CardTitle>
						</CardHeader>
						<CardContent>
							<AdminList />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
