'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useCookies } from '@/contexts/cookie-context';
import { redirect } from 'next/navigation';
import { useRouter, useSearchParams } from 'next/navigation';
import GlobalLoading from '@/components/global-loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FileUpload } from './_components/file-upload';
import { DocumentStatus } from './_components/document-status';
import { DocumentUploadHeader } from './_components/document-upload-header';
import { DocumentUploadGuide } from './_components/document-upload-guide';
import { FileText, Upload } from 'lucide-react';
import { getUserDocuments } from '@/actions/upload';

interface Document {
	id: number;
	documentType: string;
	fileUrl: string;
	fileName: string;
	fileSize: string | null;
	verified: boolean | null;
	rejected: boolean | null;
	rejectionReason: string | null;
	createdAt: Date | null;
}

interface DocumentStatus {
	aadhar: {
		uploaded: boolean;
		verified: boolean;
		rejected: boolean;
		rejectionReason: string;
		fileUrl?: string;
	};
	marksheet10: {
		uploaded: boolean;
		verified: boolean;
		rejected: boolean;
		rejectionReason: string;
		fileUrl?: string;
	};
	marksheet12: {
		uploaded: boolean;
		verified: boolean;
		rejected: boolean;
		rejectionReason: string;
		fileUrl?: string;
	};
	photo: {
		uploaded: boolean;
		verified: boolean;
		rejected: boolean;
		rejectionReason: string;
		fileUrl?: string;
	};
}

export default function DocumentUploadPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
		aadhar: {
			uploaded: false,
			verified: false,
			rejected: false,
			rejectionReason: '',
		},
		marksheet10: {
			uploaded: false,
			verified: false,
			rejected: false,
			rejectionReason: '',
		},
		marksheet12: {
			uploaded: false,
			verified: false,
			rejected: false,
			rejectionReason: '',
		},
		photo: {
			uploaded: false,
			verified: false,
			rejected: false,
			rejectionReason: '',
		},
	});
	const [, setDocuments] = useState<Document[]>([]);

	const defaultTab = 'upload';
	const searchParams = useSearchParams();
	const router = useRouter();
	const { user: currentUser } = useCookies();

	// Get active tab directly from URL params or use default
	const activeTab = searchParams.get('tab') || defaultTab;

	// Update URL when tab changes
	const handleTabChange = (tab: string) => {
		// Update URL without refreshing the page
		router.push(`/user/document-upload?tab=${tab}`, { scroll: false });
	};

	// Redirect if not a user
	useEffect(() => {
		if (currentUser?.role !== 'user') {
			toast({
				title: 'You are not authorized to access this page',
				description: 'Please log in as a user',
				variant: 'destructive',
			});
			redirect('/login');
		}
	}, [currentUser]);

	// Fetch document status
	useEffect(() => {
		const fetchDocuments = async () => {
			if (currentUser?.userId) {
				try {
					setIsLoading(true);
					const response = await getUserDocuments();

					if (response.success && response.documents) {
						setDocuments(response.documents);

						// Map documents to status objects
						const statusMap: Partial<DocumentStatus> = {};

						response.documents.forEach((doc: Document) => {
							let key: keyof DocumentStatus | null = null;

							// Map document types to our status keys
							if (
								doc.documentType
									.toLowerCase()
									.includes('aadhar')
							) {
								key = 'aadhar';
							} else if (
								doc.documentType
									.toLowerCase()
									.includes('10th') ||
								doc.documentType
									.toLowerCase()
									.includes('marksheet10')
							) {
								key = 'marksheet10';
							} else if (
								doc.documentType
									.toLowerCase()
									.includes('12th') ||
								doc.documentType
									.toLowerCase()
									.includes('marksheet12')
							) {
								key = 'marksheet12';
							} else if (
								doc.documentType
									.toLowerCase()
									.includes('photo') ||
								doc.documentType.toLowerCase() === 'profile_pic'
							) {
								key = 'photo';
							}

							if (key) {
								statusMap[key] = {
									uploaded: true,
									verified: !!doc.verified,
									rejected: !!doc.rejected,
									rejectionReason: doc.rejectionReason || '',
									fileUrl: doc.fileUrl,
								};
							}
						});

						// Update document status with retrieved values
						setDocumentStatus((prev) => ({
							...prev,
							...statusMap,
						}));
					} else {
						toast({
							title: 'Error',
							description:
								response.error || 'Failed to fetch documents',
							variant: 'destructive',
						});
					}
				} catch (error) {
					console.error('Error fetching documents:', error);
					toast({
						title: 'Error',
						description: 'Failed to fetch documents',
						variant: 'destructive',
					});
				} finally {
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		};

		fetchDocuments();
	}, [currentUser]);

	// Calculate verification progress
	const calculateProgress = () => {
		if (!documentStatus) return 0;

		const docs = Object.values(documentStatus);
		const totalDocuments = docs.length;
		const verifiedDocuments = docs.filter(
			(doc: { verified: boolean }) => doc.verified
		).length;
		const uploadedDocuments = docs.filter(
			(doc: { uploaded: boolean }) => doc.uploaded
		).length;

		// If no documents are uploaded yet, return 0
		if (uploadedDocuments === 0) return 0;

		return Math.round((verifiedDocuments / totalDocuments) * 100);
	};

	if (isLoading) {
		return (
			<div
				className="container mx-auto py-8 px-4 max-w-5xl"
				style={{ minHeight: 'calc(100vh - 150px)' }}
			>
				<GlobalLoading message="Loading document status..." />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-5xl">
			<DocumentUploadHeader progress={calculateProgress()} />

			<Separator className="my-6" />

			<Tabs
				defaultValue={defaultTab}
				value={activeTab}
				onValueChange={handleTabChange}
				className="w-full"
			>
				<TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
					<TabsTrigger
						value="upload"
						className="flex items-center gap-2"
					>
						<Upload className="h-4 w-4" />
						<span className="hidden sm:inline">
							Upload Documents
						</span>
						<span className="sm:hidden">Upload</span>
					</TabsTrigger>
					<TabsTrigger
						value="status"
						className="flex items-center gap-2"
					>
						<FileText className="h-4 w-4" />
						<span className="hidden sm:inline">
							Verification Status
						</span>
						<span className="sm:hidden">Status</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="upload">
					{/* <DocumentUploadGuide /> */}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
						<FileUpload
							documentType="Aadhar Card"
							title="Aadhar Card"
							description="Upload a clear scan or photo of your Aadhar card (front and back)"
							acceptedFileTypes=".jpg, .jpeg, .png, .pdf"
							maxFileSizeMB={5}
							status={documentStatus.aadhar}
							onUploadSuccess={(status) => {
								if (status.uploaded) {
									setDocumentStatus({
										...documentStatus,
										aadhar: {
											...documentStatus.aadhar,
											uploaded: true,
											verified: false,
											rejected: false,
											rejectionReason: '',
											fileUrl: status.fileUrl,
										},
									});

									// Refresh the documents list
									getUserDocuments().then((response) => {
										if (
											response.success &&
											response.documents
										) {
											setDocuments(response.documents);
										}
									});
								}
							}}
						/>

						<FileUpload
							documentType="10th Grade Marksheet"
							title="10th Grade Marksheet"
							description="Upload a clear scan or photo of your 10th grade marksheet"
							acceptedFileTypes=".jpg, .jpeg, .png, .pdf"
							maxFileSizeMB={5}
							status={documentStatus.marksheet10}
							onUploadSuccess={(status) => {
								if (status.uploaded) {
									setDocumentStatus({
										...documentStatus,
										marksheet10: {
											...documentStatus.marksheet10,
											uploaded: true,
											verified: false,
											rejected: false,
											rejectionReason: '',
											fileUrl: status.fileUrl,
										},
									});

									// Refresh the documents list
									getUserDocuments().then((response) => {
										if (
											response.success &&
											response.documents
										) {
											setDocuments(response.documents);
										}
									});
								}
							}}
						/>

						<FileUpload
							documentType="12th Grade Marksheet"
							title="12th Grade Marksheet"
							description="Upload a clear scan or photo of your 12th grade marksheet"
							acceptedFileTypes=".jpg, .jpeg, .png, .pdf"
							maxFileSizeMB={5}
							status={documentStatus.marksheet12}
							onUploadSuccess={(status) => {
								if (status.uploaded) {
									setDocumentStatus({
										...documentStatus,
										marksheet12: {
											...documentStatus.marksheet12,
											uploaded: true,
											verified: false,
											rejected: false,
											rejectionReason: '',
											fileUrl: status.fileUrl,
										},
									});

									// Refresh the documents list
									getUserDocuments().then((response) => {
										if (
											response.success &&
											response.documents
										) {
											setDocuments(response.documents);
										}
									});
								}
							}}
						/>

						<FileUpload
							documentType="Profile Photo"
							title="Recent Photograph"
							description="Upload a recent passport-sized photograph with white background"
							acceptedFileTypes=".jpg, .jpeg, .png"
							maxFileSizeMB={2}
							status={documentStatus.photo}
							onUploadSuccess={(status) => {
								if (status.uploaded) {
									// Update local document status immediately
									setDocumentStatus({
										...documentStatus,
										photo: {
											...documentStatus.photo,
											uploaded: true,
											verified: false,
											rejected: false,
											rejectionReason: '',
											// Add timestamp to prevent browser caching
											fileUrl: status.fileUrl
												? `${
														status.fileUrl
												  }?t=${new Date().getTime()}`
												: undefined,
										},
									});

									// Dispatch event for other components to refresh
									const event = new CustomEvent(
										'profile-photo-updated',
										{
											detail: { url: status.fileUrl },
										}
									);
									window.dispatchEvent(event);

									// Force a refresh of the documents right after upload
									setTimeout(() => {
										getUserDocuments().then((response) => {
											if (
												response.success &&
												response.documents
											) {
												setDocuments(
													response.documents
												);

												// Update document status based on fetched documents
												const updatedStatusMap: Partial<DocumentStatus> =
													{};

												response.documents.forEach(
													(doc: Document) => {
														if (
															doc.documentType ===
															'profile_pic'
														) {
															updatedStatusMap.photo =
																{
																	uploaded:
																		true,
																	verified:
																		!!doc.verified,
																	rejected:
																		!!doc.rejected,
																	rejectionReason:
																		doc.rejectionReason ||
																		'',
																	fileUrl: `${
																		doc.fileUrl
																	}?t=${new Date().getTime()}`,
																};
														}
													}
												);

												setDocumentStatus(
													(prevState) => ({
														...prevState,
														...updatedStatusMap,
													})
												);
											}
										});
									}, 500);
								}
							}}
						/>
					</div>

					<div className="mt-6">
						<DocumentUploadGuide />
					</div>
				</TabsContent>

				<TabsContent value="status">
					<DocumentStatus documentStatus={documentStatus} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
