"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import cataloguePics from '@/public/images/index.js';
import React, { useState, useEffect } from 'react';

const categories = Object.entries(cataloguePics).map(([category, images]) => ({ category, images }));
const PAGE_SIZE = 9;

export default function Gallery() {
	const [pageSize, setPageSize] = useState(PAGE_SIZE);
	// Start with first image for SSR consistency
	const [randomIndexes, setRandomIndexes] = useState(() =>
		categories.map(() => 0)
	);

	// On mount (client only), randomize the indexes
	useEffect(() => {
		setRandomIndexes(categories.map(cat => Math.floor(Math.random() * cat.images.length)));
	}, []);

	// Only show up to pageSize categories
	const pagedCategories = categories.slice(0, pageSize);

	// Update random image index for visible categories every 2 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setRandomIndexes(prev => {
				const updated = [...prev];
				pagedCategories.forEach((cat, i) => {
					updated[i] = Math.floor(Math.random() * cat.images.length);
				});
				return updated;
			});
		}, 2000);
		return () => clearInterval(interval);
	}, [pageSize, pagedCategories]);

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
						return (
							<div
								key={cat.category}
								className={`relative group overflow-hidden rounded-xl shadow-lg h-72 animate__animated animate__fadeIn animate__delay-${i}s`}
							>
								<Image
									src={cat.images[imgIdx]}
									alt={cat.category}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
								/>
								{/* <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-opacity"></div> */}
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
