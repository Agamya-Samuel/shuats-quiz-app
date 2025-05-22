import { Card, CardContent } from '@/components/ui/card';

export default function LoadingState() {
	return (
		<Card className="w-full flex items-center justify-center h-full">
			<CardContent className="p-6">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
				</div>
			</CardContent>
		</Card>
	);
}
