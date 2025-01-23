import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
	return (
		<footer id="footer" className="bg-neutral-900 text-gray-300">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* About Section */}
					<div className="animate__animated animate__fadeInUp">
						<h3 className="text-2xl font-bold text-white mb-4">
							SHUATS
						</h3>
						<p className="text-gray-400 mb-4">
							Empowering minds through quality education and
							world-class facilities.
						</p>
						<div className="flex space-x-4">
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<Facebook className="w-6 h-6" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<Twitter className="w-6 h-6" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<Linkedin className="w-6 h-6" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<Instagram className="w-6 h-6" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div className="animate__animated animate__fadeInUp animate__delay-1s">
						<h3 className="text-lg font-semibold text-white mb-4">
							Quick Links
						</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="#hero"
									className="hover:text-white transition-colors"
								>
									Home
								</a>
							</li>
							<li>
								<a
									href="#facilities"
									className="hover:text-white transition-colors"
								>
									Facilities
								</a>
							</li>
							<li>
								<a
									href="#academics"
									className="hover:text-white transition-colors"
								>
									Academics
								</a>
							</li>
							<li>
								<a
									href="#campuslife"
									className="hover:text-white transition-colors"
								>
									Campus Life
								</a>
							</li>
							<li>
								<a
									href="#contact"
									className="hover:text-white transition-colors"
								>
									Contact
								</a>
							</li>
						</ul>
					</div>

					{/* Facilities */}
					<div className="animate__animated animate__fadeInUp animate__delay-2s">
						<h3 className="text-lg font-semibold text-white mb-4">
							Our Facilities
						</h3>
						<ul className="space-y-2">
							<li>Modern Library</li>
							<li>Research Labs</li>
							<li>Sports Complex</li>
							<li>Smart Classrooms</li>
							<li>Auditorium</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div className="animate__animated animate__fadeInUp animate__delay-3s">
						<h3 className="text-lg font-semibold text-white mb-4">
							Newsletter
						</h3>
						<p className="text-gray-400 mb-4">
							Subscribe to our newsletter for updates
						</p>
						<form className="space-y-4">
							<Input
								type="email"
								placeholder="Your email address"
								className="bg-neutral-800 border-neutral-700 text-white"
							/>
							<Button type="submit" className="w-full">
								Subscribe
							</Button>
						</form>
					</div>
				</div>

				<div className="border-t border-neutral-800 mt-12 pt-8 text-center">
					<p className="text-gray-400">
						&copy; 2025 SHUATS. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
