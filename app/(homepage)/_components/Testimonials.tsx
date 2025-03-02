'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function Testimonials() {
	const testimonials = [
		{
			name: 'Sarah Johnson',
			role: 'Computer Science, Final Year',
			avatar: '/placeholder.svg?height=40&width=40',
			content:
				"The facilities and faculty support have been exceptional. I've had access to cutting-edge technology and great mentorship opportunities.",
			rating: 5,
		},
		{
			name: 'Michael Chen',
			role: 'Mechanical Engineering, Third Year',
			avatar: '/placeholder.svg?height=40&width=40',
			content:
				'The practical learning approach and modern laboratories have prepared me well for my future career in engineering.',
			rating: 5,
		},
		{
			name: 'Priya Patel',
			role: 'Electronics, Graduate',
			avatar: '/placeholder.svg?height=40&width=40',
			content:
				'The campus environment and facilities have provided the perfect backdrop for both academic and personal growth.',
			rating: 5,
		},
	];

	const [currentIndex, setCurrentIndex] = useState(0);

	const nextTestimonial = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
	};

	const prevTestimonial = () => {
		setCurrentIndex(
			(prevIndex) =>
				(prevIndex - 1 + testimonials.length) % testimonials.length
		);
	};

	return (
		<section id="testimonials" className="py-20 bg-neutral-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeInUp">
						Student Testimonials
					</h2>
					<p className="text-lg text-neutral-600 animate__animated animate__fadeInUp animate__delay-1s">
						Hear what our students have to say about their
						experience
					</p>
				</div>

				<div className="relative">
					<Card className="max-w-3xl mx-auto">
						<CardContent className="p-8">
							<div className="flex items-center mb-4">
								<Avatar className="w-12 h-12">
									<AvatarImage
										src={testimonials[currentIndex].avatar}
										alt={testimonials[currentIndex].name}
									/>
									<AvatarFallback>
										{testimonials[currentIndex].name.charAt(
											0
										)}
									</AvatarFallback>
								</Avatar>
								<div className="ml-4">
									<h4 className="text-lg font-semibold">
										{testimonials[currentIndex].name}
									</h4>
									<p className="text-neutral-600">
										{testimonials[currentIndex].role}
									</p>
								</div>
							</div>
							<div className="mb-4">
								<div className="flex text-yellow-400">
									{[
										...Array(
											testimonials[currentIndex].rating
										),
									].map((_, i) => (
										<Star
											key={i}
											className="w-5 h-5 fill-current"
										/>
									))}
								</div>
							</div>
							<p className="text-neutral-600">
								&ldquo;{testimonials[currentIndex].content}
								&rdquo;
							</p>
						</CardContent>
					</Card>

					<Button
						variant="outline"
						size="icon"
						className="absolute top-1/2 left-4 transform -translate-y-1/2"
						onClick={prevTestimonial}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>

					<Button
						variant="outline"
						size="icon"
						className="absolute top-1/2 right-4 transform -translate-y-1/2"
						onClick={nextTestimonial}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</section>
	);
}
