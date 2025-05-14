"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import cataloguePics from '@/public/images/index.js';
import React, { useState, useEffect, useRef } from 'react';

const categories = Object.entries(cataloguePics).map(([category, images]) => ({ category, images }));
const PAGE_SIZE = 9;
const FADE_DURATION = 1000; // ms (was 500)
const IMAGE_CHANGE_INTERVAL = 5000; // ms (was 2000)

export default function Gallery() {
	const [pageSize, setPageSize] = useState(PAGE_SIZE);
	// Start with first image for SSR consistency
	const [randomIndexes, setRandomIndexes] = useState(() =>
		categories.map(() => 0)
	);
	// Track previous image index for fade transition
	const [prevIndexes, setPrevIndexes] = useState<(number|null)[]>(
		categories.map(() => null)
	);
	const [fading, setFading] = useState(() =>
		categories.map(() => false)
	);
	const fadeTimeouts = useRef<(ReturnType<typeof setTimeout>|null)[]>([]);

	// On mount (client only), randomize the indexes
	useEffect(() => {
		setRandomIndexes(categories.map(cat => Math.floor(Math.random() * cat.images.length)));
	}, []);

	// Only show up to pageSize categories
	const pagedCategories = categories.slice(0, pageSize);

	// Update random image index for visible categories every IMAGE_CHANGE_INTERVAL ms
	useEffect(() => {
		const interval = setInterval(() => {
			setRandomIndexes(prev => {
				const updated = [...prev];
				const newPrevIndexes = [...prevIndexes];
				const newFading = [...fading];
				pagedCategories.forEach((cat, i) => {
					const newIdx = Math.floor(Math.random() * cat.images.length);
					if (newIdx !== prev[i]) {
						newPrevIndexes[i] = prev[i];
						updated[i] = newIdx;
						newFading[i] = true;
						// Clear any previous timeout
						if (fadeTimeouts.current[i]) clearTimeout(fadeTimeouts.current[i]!);
						fadeTimeouts.current[i] = setTimeout(() => {
							setPrevIndexes(p => {
								const arr = [...p];
								arr[i] = null;
								return arr;
							});
							setFading(f => {
								const arr = [...f];
								arr[i] = false;
								return arr;
							});
						}, FADE_DURATION);
					}
				});
				setPrevIndexes(newPrevIndexes);
				setFading(newFading);
				return updated;
			});
		}, IMAGE_CHANGE_INTERVAL);
		// Copy fadeTimeouts.current to a local variable for cleanup
		const fadeTimeoutsSnapshot = [...fadeTimeouts.current];
		return () => {
			if (interval) clearInterval(interval);
			fadeTimeoutsSnapshot.forEach(t => t && clearTimeout(t));
		};
	}, [pageSize, pagedCategories, prevIndexes, fading]);

	const handleViewMore = () => setPageSize(categories.length);
	const hasMore = pageSize < categories.length;

	return (
		<section id="gallery" className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeInUp">
						Campus Gallery
					</h2>
					<p className="text-lg text-neutral-600 animate__animated animate__fadeInUp animate__delay-1s">
						Take a visual tour of our state-of-the-art facilities
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{pagedCategories.map((cat, i) => {
						const imgIdx = randomIndexes[i] ?? 0;
						const prevIdx = prevIndexes[i];
						return (
							<div
								key={cat.category}
								className={`relative group overflow-hidden rounded-xl shadow-lg h-72 animate__animated animate__fadeIn animate__delay-${i}s`}
							>
								{/* Previous image for fade out */}
								{prevIdx !== null && (
									<Image
										key={cat.category + '-prev'}
										src={cat.images[prevIdx]}
										alt={cat.category}
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className="object-cover w-full h-full absolute inset-0 transition-opacity duration-1000 opacity-0 z-10"
										style={{ opacity: fading[i] ? 0 : 1 }}
									/>
								)}
								{/* Current image for fade in */}
								<Image
									key={cat.category + '-current'}
									src={cat.images[imgIdx]}
									alt={cat.category}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className={`object-cover w-full h-full transition-opacity duration-1000 ${fading[i] ? 'opacity-100' : 'opacity-100'} relative`}
								/>
								<div className="absolute bottom-0 left-0 right-0 p-4">
									<h3 className="text-lg font-bold text-white drop-shadow mb-1">{cat.category.replace(/_/g, ' ').toUpperCase()}</h3>
								</div>
							</div>
						);
					})}
				</div>

				{hasMore && (
					<div className="text-center mt-12">
						<Button
							variant="default"
							size="lg"
							className="animate__animated animate__fadeInUp"
							onClick={handleViewMore}
						>
							View More Photos
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
