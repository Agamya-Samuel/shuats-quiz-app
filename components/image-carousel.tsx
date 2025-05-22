'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import cataloguePics from '../public/images';

interface ImageCarouselProps {
	category?: keyof typeof cataloguePics | Array<keyof typeof cataloguePics>;
	autoSlide?: boolean;
	autoSlideInterval?: number;
	className?: string;
}

/**
 * A reusable image carousel component that displays images from the SHUATS catalogue
 *
 * @param category - The category or categories of images to display from cataloguePics
 * @param autoSlide - Whether to automatically slide through images
 * @param autoSlideInterval - Interval in milliseconds for auto sliding
 * @param className - Additional CSS classes for the carousel container
 */
export default function ImageCarousel({
	category = 'cultural', // Default to cultural images
	autoSlide = true,
	autoSlideInterval = 5000,
	className = '',
}: ImageCarouselProps) {
	// Get images based on category
	const getImages = () => {
		if (Array.isArray(category)) {
			// If multiple categories are provided, combine their images
			return category.flatMap((cat) => cataloguePics[cat] || []);
		}
		// Single category
		return cataloguePics[category] || [];
	};

	const images = getImages();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);
	const [viewerImageIndex, setViewerImageIndex] = useState(0);

	// Handle navigation
	const goToPrevious = () => {
		setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const goToNext = () => {
		setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	// Open image viewer
	const openViewer = (index: number) => {
		setViewerImageIndex(index);
		setIsViewerOpen(true);
	};

	// Auto slide functionality
	useEffect(() => {
		if (!autoSlide) return;

		const slideInterval = setInterval(goToNext, autoSlideInterval);
		return () => clearInterval(slideInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoSlide, autoSlideInterval]);

	// If no images are available
	if (images.length === 0) {
		return (
			<div
				className={`w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
			>
				<p className="text-gray-500">No images available</p>
			</div>
		);
	}

	return (
		<>
			<div className={`relative overflow-hidden rounded-lg ${className}`}>
				{/* Main carousel */}
				<div className="relative h-64 md:h-80">
					{images.map((src, index) => (
						<div
							key={index}
							className={`absolute w-full h-full transition-opacity duration-500 ${
								index === currentIndex
									? 'opacity-100'
									: 'opacity-0 pointer-events-none'
							}`}
							onClick={() => openViewer(index)}
						>
							<Image
								src={src}
								alt={`SHUATS ${category} image ${index + 1}`}
								fill
								className="object-cover cursor-pointer hover:opacity-95"
								sizes="(max-width: 768px) 100vw, 50vw"
								priority={index === 0}
								quality={50}
							/>
						</div>
					))}
				</div>

				{/* Navigation buttons */}
				<button
					onClick={goToPrevious}
					className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
					aria-label="Previous image"
				>
					<ChevronLeft size={20} />
				</button>
				<button
					onClick={goToNext}
					className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
					aria-label="Next image"
				>
					<ChevronRight size={20} />
				</button>

				{/* Indicators */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
					{images.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`w-2 h-2 rounded-full ${
								index === currentIndex
									? 'bg-white'
									: 'bg-white/50'
							}`}
							aria-label={`Go to image ${index + 1}`}
						/>
					))}
				</div>
			</div>

			{/* Image Viewer Dialog */}
			<Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
				<DialogContent className="max-w-4xl p-0 bg-black/90 border-none">
					<DialogTitle className="sr-only">
						Image Viewer - SHUATS Campus Image
					</DialogTitle>
					<div className="relative h-[80vh] w-full">
						{/* Close button */}
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-2 top-2 z-50 text-white bg-black/50 hover:bg-black/70"
							onClick={() => setIsViewerOpen(false)}
						>
							<X size={24} />
						</Button>

						{/* Image */}
						<div className="relative h-full w-full">
							<Image
								src={images[viewerImageIndex]}
								alt={`SHUATS ${category} image ${
									viewerImageIndex + 1
								}`}
								fill
								className="object-contain"
								sizes="100vw"
								quality={10}
							/>
						</div>

						{/* Navigation buttons */}
						{images.length > 1 && (
							<>
								<Button
									variant="ghost"
									size="icon"
									className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full"
									onClick={() =>
										setViewerImageIndex((prev) =>
											prev === 0
												? images.length - 1
												: prev - 1
										)
									}
								>
									<ChevronLeft size={24} />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full"
									onClick={() =>
										setViewerImageIndex((prev) =>
											prev === images.length - 1
												? 0
												: prev + 1
										)
									}
								>
									<ChevronRight size={24} />
								</Button>
							</>
						)}

						{/* Image counter */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
							{viewerImageIndex + 1} / {images.length}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
