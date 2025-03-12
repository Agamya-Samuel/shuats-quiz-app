'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { useAntiCheat } from '@/hooks/use-anti-cheat';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
	Maximize,
	ShieldAlert,
	Copy,
	MousePointer,
	AlertTriangle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * A test component to verify the anti-cheat functionality
 * This component allows toggling the anti-cheat measures on and off
 * and provides input fields to test copy/paste functionality, text selection,
 * and full-screen mode
 */
export default function AntiCheatTest() {
	const [isEnabled, setIsEnabled] = useState(false);
	const [inputValue, setInputValue] = useState('');

	// Enable anti-cheat measures based on the toggle state
	const { isAntiCheatEnabled, fullscreenPermissionDenied } =
		useAntiCheat(isEnabled);

	return (
		<Card className="w-full max-w-md mx-auto mt-8">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ShieldAlert className="h-5 w-5" />
					Anti-Cheat Test
				</CardTitle>
				<CardDescription>
					Test the anti-cheating measures implemented for the quiz
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{fullscreenPermissionDenied && (
					<Alert className="mb-4 bg-amber-50 border-amber-200">
						<AlertTriangle className="h-4 w-4 text-amber-500" />
						<AlertDescription className="text-amber-700">
							Full-screen mode was denied. This may be due to
							browser permissions or because the request wasn't
							triggered by a direct user action. The quiz will
							still work, but full-screen enforcement will be
							disabled.
						</AlertDescription>
					</Alert>
				)}

				<div className="flex items-center justify-between">
					<Label htmlFor="toggle-anti-cheat" className="font-medium">
						Anti-Cheat Measures
					</Label>
					<Button
						variant={isEnabled ? 'default' : 'outline'}
						onClick={() => setIsEnabled(!isEnabled)}
					>
						{isEnabled ? 'Enabled' : 'Disabled'}
					</Button>
				</div>

				<Separator />

				<div className="space-y-4">
					<h3 className="text-sm font-medium flex items-center gap-2">
						<Copy className="h-4 w-4" />
						Copy/Paste Prevention
					</h3>

					<div className="space-y-2">
						<Label htmlFor="test-input">Test Input Field</Label>
						<Input
							id="test-input"
							placeholder="Try to copy from or paste into this field"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="test-text">
							Test Text (Try to copy this)
						</Label>
						<div className="p-3 bg-gray-100 rounded-md">
							This is some sample text that you can try to copy
							when anti-cheat is enabled. The copy functionality
							should be blocked when anti-cheat is turned on.
						</div>
					</div>
				</div>

				<Separator />

				<div className="space-y-4">
					<h3 className="text-sm font-medium flex items-center gap-2">
						<MousePointer className="h-4 w-4" />
						Text Selection Prevention
					</h3>

					<div className="space-y-2">
						<Label htmlFor="test-selection">
							Test Selection (Try to select this text)
						</Label>
						<div className="p-3 bg-blue-50 rounded-md">
							This is some sample text that you can try to select
							when anti-cheat is enabled. Text selection should be
							blocked when anti-cheat is turned on.
						</div>
					</div>
				</div>

				<Separator />

				<div className="space-y-4">
					<h3 className="text-sm font-medium flex items-center gap-2">
						<Maximize className="h-4 w-4" />
						Full-Screen Mode
					</h3>

					<div className="space-y-2">
						<p className="text-sm text-gray-600">
							When anti-cheat is enabled, the page will enter
							full-screen mode. Try to exit full-screen mode using
							Escape key or browser controls.
						</p>

						{fullscreenPermissionDenied ? (
							<div className="p-3 bg-amber-50 rounded-md text-sm">
								<p className="font-medium">
									Full-screen permission denied
								</p>
								<p className="mt-1">
									Your browser has denied full-screen
									permission. This is common when:
								</p>
								<ul className="list-disc pl-5 mt-1 space-y-1">
									<li>
										The request wasn't triggered by a direct
										user action
									</li>
									<li>
										The browser has security settings that
										block automatic full-screen
									</li>
									<li>
										You've previously denied full-screen
										permission for this site
									</li>
								</ul>
							</div>
						) : (
							<div className="p-3 bg-green-50 rounded-md text-sm">
								<p>
									If you exit full-screen mode, the system
									will try to return you to full-screen
									automatically. After multiple exit attempts,
									it will show warnings instead.
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-500 border">
					{isEnabled
						? 'Anti-cheat is enabled. Copy, paste, text selection should be blocked, and full-screen mode should be enforced.'
						: 'Anti-cheat is disabled. All features should work normally.'}
				</div>
			</CardContent>
		</Card>
	);
}
