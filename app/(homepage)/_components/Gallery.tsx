"use client";

import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { useState, useEffect } from "react";
import { adminImages } from "@/public/images/catalogue-pics/admin";
import { animalImages } from "@/public/images/catalogue-pics/animal";
// import { agriImages } from "@/public/images/catalogue-pics/agri";
// import { artImages } from "@/public/images/catalogue-pics/art";
// import { deptImages } from "@/public/images/catalogue-pics/dept";
import { biotechImages } from "@/public/images/catalogue-pics/biotech";
import { btechImages } from "@/public/images/catalogue-pics/btech";
// import { culturalImages } from "@/public/images/catalogue-pics/cultural";
// import { envImages } from "@/public/images/catalogue-pics/env";
// import { fac_sciImages } from "@/public/images/catalogue-pics/fac_sci";
// import { fieldImages } from "@/public/images/catalogue-pics/field";
// import { hostelImages } from "@/public/images/catalogue-pics/hostel";
// import { labImages } from "@/public/images/catalogue-pics/lab";
// import { libraryImages } from "@/public/images/catalogue-pics/librarys";
// import { navImages } from "@/public/images/catalogue-pics/nav";
// import { nccImages } from "@/public/images/catalogue-pics/ncc";
// import { sportsImages } from "@/public/images/catalogue-pics/sports";
// import { meshImages } from "@/public/images/catalogue-pics/mesh";
// import { masscomImages } from "@/public/images/catalogue-pics/masscom";

// Import other image arrays as needed

const imageSets = [
	adminImages,
	biotechImages,
	btechImages,
	animalImages,
	// agriImages,
	// artImages,
	// fac_sciImages,
	// fieldImages,
	// hostelImages,
	// labImages,
	// culturalImages,
	// envImages,
	// libraryImages,
	// navImages,
	// deptImages,
	// meshImages,
	// sportsImages,
	// nccImages,
	// masscomImages,
];

export default function Gallery() {
	const [currentImages, setCurrentImages] = useState(
		imageSets.map((images) => images[0])
	);

	const galleryItems = [
		{
			title: "Administration Block Catalogue",
			description: "All the important documents are stored here",
			color: "from-blue-600 to-purple-600",
		},
		{
			title: "Biotech Catalogue",
			description: "Advanced research facilities",
			color: "from-green-600 to-teal-600",
		},
		{
			title: "Department of Computer Science & Information Technology",
			description: "World-class sports facilities",
			color: "from-red-600 to-orange-600",
		},
		{
			title: "Animals Catalogue",
			description: "State-of-the-art learning spaces",
			color: "from-blue-600 to-purple-600",
		},
		// {
		// 	title: "Agri Images",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "Art Images",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "fac_sciImages",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "fieldImages",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "hostelImages",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "labImages",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "Cultural Catalogue",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "Env Images",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "Library Images",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "Mesh Images",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "Sports Images",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "NCC Images",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },
		// {
		// 	title: "Dept Images",
		// 	description: "State-of-the-art learning spaces",
		// 	color: "from-blue-600 to-purple-600",
		// },

		// Add more items as needed
	];

	useEffect(() => {
		const getRandomImage = (images: StaticImageData[]) => {
		  const randomIndex = Math.floor(Math.random() * images.length);
		  return images[randomIndex];
		};
	  
		const interval = setInterval(() => {
		  setCurrentImages(imageSets.map((imageSet) => getRandomImage(imageSet)));
		}, 1100);
	  
		return () => clearInterval(interval);
	}, []);

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
					{galleryItems.map((item, index) => (
						<div
							key={index}
							className={`relative group overflow-hidden rounded-xl shadow-lg h-72 animate__animated animate__fadeIn animate__delay-${index}s`}
						>
							<Image
								src={currentImages[index]}
								alt={item.title}
								width={800}
                				height={600}
								objectFit="cover"
								className="absolute inset-0 object-cover w-full h-full"
							/>
							<div
								className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-90 transition-all duration-300`}
							></div>
							<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                				<div className="text-center p-4">
                  					<h3 className="text-xl font-bold text-white mb-2">
										{item.title}
									</h3>
									<p className="text-white">{item.description}</p>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="text-center mt-12">
					<Button
						variant="default"
						size="lg"
						className="animate__animated animate__fadeInUp"
					>
						View More Photos
					</Button>
				</div>
			</div>
		</section>
	);
}
