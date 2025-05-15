'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Save, RefreshCw, FileText, Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

export function VerificationSettings() {
	const [settings, setSettings] = useState({
		requiredDocuments: {
			aadhar: true,
			photo: true,
			tenthMarksheet: true,
			twelfthMarksheet: true,
		},
		fileTypes: {
			aadhar: ['pdf', 'jpg', 'png'],
			photo: ['jpg', 'png'],
			tenthMarksheet: ['pdf'],
			twelfthMarksheet: ['pdf'],
		},
		maxFileSize: 5, // in MB
		autoApproval: false,
		notifyUser: true,
		notifyAdmin: true,
		resubmissionPeriod: 7, // in days
		customRejectionMessages: {
			aadhar: 'Your Aadhar card is not clearly visible or does not meet our requirements. Please upload a clearer copy.',
			photo: 'Your photo does not meet our requirements. Please upload a passport-sized photo with a clear background.',
			tenthMarksheet:
				'Your 10th marksheet is not clearly visible or incomplete. Please upload a complete and clear copy.',
			twelfthMarksheet:
				'Your 12th marksheet is not clearly visible or incomplete. Please upload a complete and clear copy.',
		},
	});

	const updateRequiredDocument = (document: string, value: boolean) => {
		setSettings({
			...settings,
			requiredDocuments: {
				...settings.requiredDocuments,
				[document]: value,
			},
		});
	};

	const updateSetting = (
		key: keyof typeof settings,
		value: boolean | number | object
	) => {
		setSettings({
			...settings,
			[key]: value,
		});
	};

	const updateCustomMessage = (document: string, value: string) => {
		setSettings({
			...settings,
			customRejectionMessages: {
				...settings.customRejectionMessages,
				[document]: value,
			},
		});
	};

	const saveSettings = () => {
		toast({
			title: 'Settings Saved',
			description: 'Document verification settings have been updated.',
			variant: 'success',
		});
	};

	const resetSettings = () => {
		// Reset to default settings
		setSettings({
			requiredDocuments: {
				aadhar: true,
				photo: true,
				tenthMarksheet: true,
				twelfthMarksheet: true,
			},
			fileTypes: {
				aadhar: ['pdf', 'jpg', 'png'],
				photo: ['jpg', 'png'],
				tenthMarksheet: ['pdf'],
				twelfthMarksheet: ['pdf'],
			},
			maxFileSize: 5,
			autoApproval: false,
			notifyUser: true,
			notifyAdmin: true,
			resubmissionPeriod: 7,
			customRejectionMessages: {
				aadhar: 'Your Aadhar card is not clearly visible or does not meet our requirements. Please upload a clearer copy.',
				photo: 'Your photo does not meet our requirements. Please upload a passport-sized photo with a clear background.',
				tenthMarksheet:
					'Your 10th marksheet is not clearly visible or incomplete. Please upload a complete and clear copy.',
				twelfthMarksheet:
					'Your 12th marksheet is not clearly visible or incomplete. Please upload a complete and clear copy.',
			},
		});

		toast({
			title: 'Settings Reset',
			description:
				'Document verification settings have been reset to defaults.',
			variant: 'default',
		});
	};

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<h3 className="text-lg font-medium">Required Documents</h3>
				<p className="text-sm text-muted-foreground">
					Configure which documents are required for user verification
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex items-center space-x-2">
						<Checkbox
							id="aadhar-required"
							checked={settings.requiredDocuments.aadhar}
							onCheckedChange={(checked) =>
								updateRequiredDocument(
									'aadhar',
									checked as boolean
								)
							}
						/>
						<Label htmlFor="aadhar-required">Aadhar Card</Label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="photo-required"
							checked={settings.requiredDocuments.photo}
							onCheckedChange={(checked) =>
								updateRequiredDocument(
									'photo',
									checked as boolean
								)
							}
						/>
						<Label htmlFor="photo-required">Photo</Label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="tenth-required"
							checked={settings.requiredDocuments.tenthMarksheet}
							onCheckedChange={(checked) =>
								updateRequiredDocument(
									'tenthMarksheet',
									checked as boolean
								)
							}
						/>
						<Label htmlFor="tenth-required">10th Marksheet</Label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="twelfth-required"
							checked={
								settings.requiredDocuments.twelfthMarksheet
							}
							onCheckedChange={(checked) =>
								updateRequiredDocument(
									'twelfthMarksheet',
									checked as boolean
								)
							}
						/>
						<Label htmlFor="twelfth-required">12th Marksheet</Label>
					</div>
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				<h3 className="text-lg font-medium">File Settings</h3>
				<p className="text-sm text-muted-foreground">
					Configure file type and size restrictions for document
					uploads
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<Label htmlFor="max-file-size">
							Maximum File Size (MB)
						</Label>
						<div className="flex items-center gap-2">
							<Input
								id="max-file-size"
								type="number"
								min="1"
								max="20"
								value={settings.maxFileSize}
								onChange={(e) =>
									updateSetting(
										'maxFileSize',
										Number(e.target.value)
									)
								}
								className="w-24"
							/>
							<span className="text-sm text-muted-foreground">
								MB
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Allowed File Types</Label>
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<FileText className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">Aadhar Card:</span>
								<span className="text-sm text-muted-foreground">
									PDF, JPG, PNG
								</span>
							</div>
							<div className="flex items-center gap-2">
								<FileText className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">Photo:</span>
								<span className="text-sm text-muted-foreground">
									JPG, PNG
								</span>
							</div>
							<div className="flex items-center gap-2">
								<FileText className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">Marksheets:</span>
								<span className="text-sm text-muted-foreground">
									PDF
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				<h3 className="text-lg font-medium">Verification Process</h3>
				<p className="text-sm text-muted-foreground">
					Configure how document verification is processed
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="auto-approval">
									Auto-Approval
								</Label>
								<p className="text-xs text-muted-foreground">
									Automatically approve documents without
									manual review
								</p>
							</div>
							<Switch
								id="auto-approval"
								checked={settings.autoApproval}
								onCheckedChange={(checked) =>
									updateSetting('autoApproval', checked)
								}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="resubmission-period">
								Resubmission Period (days)
							</Label>
							<Input
								id="resubmission-period"
								type="number"
								min="1"
								max="30"
								value={settings.resubmissionPeriod}
								onChange={(e) =>
									updateSetting(
										'resubmissionPeriod',
										Number(e.target.value)
									)
								}
								className="w-full"
							/>
							<p className="text-xs text-muted-foreground">
								Number of days users have to resubmit rejected
								documents
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="notify-user">
									Notify Users
								</Label>
								<p className="text-xs text-muted-foreground">
									Send email notifications to users about
									document status
								</p>
							</div>
							<Switch
								id="notify-user"
								checked={settings.notifyUser}
								onCheckedChange={(checked) =>
									updateSetting('notifyUser', checked)
								}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="notify-admin">
									Notify Administrators
								</Label>
								<p className="text-xs text-muted-foreground">
									Send email notifications to admins about new
									document submissions
								</p>
							</div>
							<Switch
								id="notify-admin"
								checked={settings.notifyAdmin}
								onCheckedChange={(checked) =>
									updateSetting('notifyAdmin', checked)
								}
							/>
						</div>
					</div>
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				<h3 className="text-lg font-medium">Rejection Messages</h3>
				<p className="text-sm text-muted-foreground">
					Customize messages sent to users when documents are rejected
				</p>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="aadhar-message">
							Aadhar Card Rejection Message
						</Label>
						<Textarea
							id="aadhar-message"
							value={settings.customRejectionMessages.aadhar}
							onChange={(e) =>
								updateCustomMessage('aadhar', e.target.value)
							}
							rows={2}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="photo-message">
							Photo Rejection Message
						</Label>
						<Textarea
							id="photo-message"
							value={settings.customRejectionMessages.photo}
							onChange={(e) =>
								updateCustomMessage('photo', e.target.value)
							}
							rows={2}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="tenth-message">
							10th Marksheet Rejection Message
						</Label>
						<Textarea
							id="tenth-message"
							value={
								settings.customRejectionMessages.tenthMarksheet
							}
							onChange={(e) =>
								updateCustomMessage(
									'tenthMarksheet',
									e.target.value
								)
							}
							rows={2}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="twelfth-message">
							12th Marksheet Rejection Message
						</Label>
						<Textarea
							id="twelfth-message"
							value={
								settings.customRejectionMessages
									.twelfthMarksheet
							}
							onChange={(e) =>
								updateCustomMessage(
									'twelfthMarksheet',
									e.target.value
								)
							}
							rows={2}
						/>
					</div>
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				<h3 className="text-lg font-medium">Email Templates</h3>
				<p className="text-sm text-muted-foreground">
					Configure email templates for document verification
					notifications
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors">
						<div className="flex items-center gap-2 mb-2">
							<Mail className="h-4 w-4 text-primary" />
							<h4 className="font-medium">Document Approved</h4>
						</div>
						<p className="text-sm text-muted-foreground">
							Email sent when a document is approved
						</p>
					</div>

					<div className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors">
						<div className="flex items-center gap-2 mb-2">
							<Mail className="h-4 w-4 text-primary" />
							<h4 className="font-medium">Document Rejected</h4>
						</div>
						<p className="text-sm text-muted-foreground">
							Email sent when a document is rejected
						</p>
					</div>

					<div className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors">
						<div className="flex items-center gap-2 mb-2">
							<Mail className="h-4 w-4 text-primary" />
							<h4 className="font-medium">
								Verification Complete
							</h4>
						</div>
						<p className="text-sm text-muted-foreground">
							Email sent when all documents are verified
						</p>
					</div>
				</div>
			</div>

			<div className="flex justify-between pt-4">
				<Button
					variant="outline"
					onClick={resetSettings}
					className="flex items-center gap-2"
				>
					<RefreshCw className="h-4 w-4" />
					Reset to Defaults
				</Button>
				<Button
					onClick={saveSettings}
					className="flex items-center gap-2"
				>
					<Save className="h-4 w-4" />
					Save Settings
				</Button>
			</div>
		</div>
	);
}
