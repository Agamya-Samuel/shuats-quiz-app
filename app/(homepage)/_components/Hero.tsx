import { Button } from '@/components/ui/button';
import Image from 'next/image';

import { csdept } from '@/public/images';

export default function Hero() {
	return (
		<section
			id="hero"
			className="min-h-[70vh] bg-neutral-900 relative overflow-hidden"
		>
			<div className="absolute inset-0">
				<Image
					src={csdept}
					alt="Background"
          quality={75}
					className="absolute inset-0 w-full h-full object-cover opacity-40"
				/>
				<div className="absolute inset-0"></div>
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
				<div className="flex flex-col items-center text-center">
					<h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate__animated animate__fadeInDown">
						Welcome to{' '}
						<span className="text-blue-500">Excellence</span> in
						Education
					</h1>

					<p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl animate__animated animate__fadeInUp animate__delay-1s">
						Shaping futures through quality education, modern
						facilities, and innovative learning experiences.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 animate__animated animate__fadeInUp animate__delay-2s">
						<Button variant="default" size="lg" asChild>
							<a href="#facilities">Explore Facilities</a>
						</Button>
						<Button variant="outline" size="lg" asChild>
							<a href="#contact">Contact Us</a>
						</Button>
					</div>
				</div>
			</div>

			<div className="absolute -right-40 top-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
			<div className="absolute -left-40 bottom-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"></div>
		</section>
	);
}