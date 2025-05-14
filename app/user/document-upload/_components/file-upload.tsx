'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/loading-spinner';
import {
	Upload,
	FileText,
	CheckCircle,
	AlertCircle,
	X,
	RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { uploadDocument } from '@/actions/upload';

interface FileUploadProps {
	documentType: string;
	title: string;
	description: string;
	acceptedFileTypes: string;
	maxFileSizeMB: number;
	status: {
		uploaded: boolean;
		verified: boolean;
		rejected: boolean;
		rejectionReason: string;
		fileUrl?: string;
	};
	onUploadSuccess: (status: { uploaded: boolean; fileUrl?: string }) => void;
}

export function FileUpload({
	documentType,
	title,
	description,
	acceptedFileTypes,
	maxFileSizeMB,
	status,
	onUploadSuccess,
}: FileUploadProps) {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];

			// Check file type
			const fileType = selectedFile.type;
			const validTypes = acceptedFileTypes
				.split(', ')
				.map((type) => type.replace('.', ''));
			const isValidType = validTypes.some((type) =>
				fileType.includes(type.toLowerCase())
			);

			if (!isValidType) {
				toast({
					title: 'Invalid file type',
					description: `Please upload a file in ${acceptedFileTypes} format`,
					variant: 'destructive',
				});
				return;
			}

			// Check file size
			if (selectedFile.size > maxFileSizeMB * 1024 * 1024) {
				toast({
					title: 'File too large',
					description: `File size should be less than ${maxFileSizeMB}MB`,
					variant: 'destructive',
				});
				return;
			}

			setFile(selectedFile);

			// Create preview for images
			if (fileType.includes('image')) {
				const reader = new FileReader();
				reader.onload = () => {
					setPreviewUrl(reader.result as string);
				};
				reader.readAsDataURL(selectedFile);
			} else {
				// For PDFs, just show an icon
				setPreviewUrl(null);
			}
		}
	};

	const handleUpload = async () => {
		if (!file) return;

		setUploading(true);
		setUploadProgress(0);

		// Show upload progress
		const interval = setInterval(() => {
			setUploadProgress((prev) => {
				if (prev >= 95) {
					clearInterval(interval);
					return 95;
				}
				return prev + 5;
			});
		}, 100);

		try {
			// Create FormData to send to server action
			const formData = new FormData();
			formData.append('file', file);
			formData.append('documentType', documentType);

			// Upload to S3 using server action
			const result = await uploadDocument(formData);

			// Complete the progress bar
			setUploadProgress(100);

			if (result.success) {
				setTimeout(() => {
					toast({
						title: 'Upload successful',
						description: `Your ${title} has been uploaded successfully`,
						variant: 'success',
					});

					onUploadSuccess({
						uploaded: true,
						fileUrl: result.fileUrl,
					});
					setUploading(false);
				}, 500);
			} else {
				throw new Error(result.error || 'Upload failed');
			}
		} catch (error) {
			console.error('Upload error:', error);
			toast({
				title: 'Upload failed',
				description:
					'There was an error uploading your document. Please try again.',
				variant: 'destructive',
			});
			setUploading(false);
		} finally {
			clearInterval(interval);
		}
	};

	const handleRemoveFile = () => {
		setFile(null);
		setPreviewUrl(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const renderUploadState = () => {
		if (status?.verified) {
			return (
				<div className="flex flex-col items-center justify-center p-6 text-center">
					<div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
						<CheckCircle className="h-6 w-6" />
					</div>
					<h3 className="font-medium text-green-800">
						Verification Complete
					</h3>
					<p className="text-sm text-green-600 mt-1">
						This document has been verified
					</p>
					<div className="flex flex-col sm:flex-row gap-2 mt-4 w-full justify-center">
						<Button
							variant="outline"
							onClick={() => {
								if (fileInputRef.current) {
									fileInputRef.current.click();
								}
							}}
						>
							<RefreshCw className="mr-2 h-4 w-4" />
							Replace Document
						</Button>
						{status.fileUrl && (
							<Button
								variant="secondary"
								onClick={() =>
									window.open(status.fileUrl, '_blank')
								}
							>
								<FileText className="mr-2 h-4 w-4" />
								View Document
							</Button>
						)}
					</div>
				</div>
			);
		}

		if (status?.rejected) {
			return (
				<div className="flex flex-col items-center justify-center p-6 text-center">
					<div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
						<AlertCircle className="h-6 w-6" />
					</div>
					<h3 className="font-medium text-red-800">
						Verification Failed
					</h3>
					<p className="text-sm text-red-600 mt-1">
						{status.rejectionReason ||
							'Please upload a new document'}
					</p>
					<div className="flex flex-col sm:flex-row gap-2 mt-4 w-full justify-center">
						<Button
							variant="outline"
							onClick={() => {
								if (fileInputRef.current) {
									fileInputRef.current.click();
								}
							}}
						>
							<RefreshCw className="mr-2 h-4 w-4" />
							Upload New Document
						</Button>
						{status.fileUrl && (
							<Button
								variant="secondary"
								onClick={() =>
									window.open(status.fileUrl, '_blank')
								}
							>
								<FileText className="mr-2 h-4 w-4" />
								View Document
							</Button>
						)}
					</div>
				</div>
			);
		}

		if (status?.uploaded) {
			return (
				<div className="flex flex-col items-center justify-center p-6 text-center">
					<div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
						<FileText className="h-6 w-6" />
					</div>
					<h3 className="font-medium text-amber-800">
						Verification in Progress
					</h3>
					<p className="text-sm text-amber-600 mt-1">
						Your document is being reviewed
					</p>
					<div className="flex flex-col sm:flex-row gap-2 mt-4 w-full justify-center">
						<Button
							variant="outline"
							onClick={() => {
								if (fileInputRef.current) {
									fileInputRef.current.click();
								}
							}}
						>
							<RefreshCw className="mr-2 h-4 w-4" />
							Replace Document
						</Button>
						<Button
							variant="secondary"
							onClick={() =>
								window.open(status.fileUrl, '_blank')
							}
						>
							<FileText className="mr-2 h-4 w-4" />
							View Document
						</Button>
					</div>
				</div>
			);
		}

		if (file) {
			return (
				<div className="p-4">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-teal-600" />
							<span className="font-medium text-sm truncate max-w-[200px]">
								{file.name}
							</span>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleRemoveFile}
							className="h-8 w-8 p-0"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					{previewUrl && (
						<div className="mb-4 relative aspect-video bg-muted rounded-md overflow-hidden">
							<Image
								src={previewUrl || '/placeholder.svg'}
								alt="Document preview"
								className="object-contain w-full h-full"
								width={400}
								height={250}
							/>
						</div>
					)}

					{!previewUrl && (
						<div className="mb-4 flex items-center justify-center aspect-video bg-muted rounded-md">
							<FileText className="h-12 w-12 text-muted-foreground" />
						</div>
					)}

					<div className="text-xs text-muted-foreground mb-4">
						<div className="flex justify-between">
							<span>
								File size:{' '}
								{(file.size / (1024 * 1024)).toFixed(2)} MB
							</span>
							<span>Max: {maxFileSizeMB} MB</span>
						</div>
					</div>

					<Button
						onClick={handleUpload}
						disabled={uploading}
						className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
					>
						{uploading ? (
							<>
								<LoadingSpinner />
								<span className="ml-2">Uploading...</span>
							</>
						) : (
							<>
								<Upload className="mr-2 h-4 w-4" />
								Upload Document
							</>
						)}
					</Button>

					{uploading && (
						<div className="mt-4">
							<div className="flex justify-between text-xs mb-1">
								<span>Uploading...</span>
								<span>{uploadProgress}%</span>
							</div>
							<Progress value={uploadProgress} className="h-2" />
						</div>
					)}
				</div>
			);
		}

		return (
			<div
				className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg cursor-pointer hover:border-teal-500/50 transition-colors"
				onClick={() => {
					if (fileInputRef.current) {
						fileInputRef.current.click();
					}
				}}
			>
				<div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mb-4">
					<Upload className="h-6 w-6" />
				</div>
				<h3 className="font-medium text-center">
					Click to upload {title}
				</h3>
				<p className="text-sm text-muted-foreground text-center mt-1">
					{acceptedFileTypes} (Max: {maxFileSizeMB}MB)
				</p>
			</div>
		);
	};

	return (
		<Card className="overflow-hidden">
			<CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FileText className="h-5 w-5 text-teal-600" />
						<CardTitle className="text-lg">{title}</CardTitle>
					</div>

					{status?.verified && (
						<Badge className="bg-green-500">Verified</Badge>
					)}

					{status?.rejected && (
						<Badge className="bg-red-500">Rejected</Badge>
					)}

					{status?.uploaded &&
						!status?.verified &&
						!status?.rejected && (
							<Badge className="bg-amber-500">Pending</Badge>
						)}

					{!status?.uploaded &&
						!status?.verified &&
						!status?.rejected && (
							<Badge variant="outline" className="bg-muted/20">
								Required
							</Badge>
						)}
				</div>
				<CardDescription>{description}</CardDescription>
			</CardHeader>

			<CardContent className="p-0">
				<input
					type="file"
					ref={fileInputRef}
					accept={acceptedFileTypes}
					onChange={handleFileChange}
					className="hidden"
				/>

				{renderUploadState()}
			</CardContent>
		</Card>
	);
}
