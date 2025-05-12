import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
	return (
		<footer id="footer" className="bg-neutral-900 text-gray-300">
			<div className="max-w-7xl mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8 items-start">
					{/* About Section */}
					<div className="text-left">
						<h3 className="text-2xl font-bold text-white mb-3">SHUATS</h3>
						<p className="text-gray-400 mb-3 text-base leading-snug">
							Empowering minds through quality education and world-class facilities.
						</p>
						<div className="flex space-x-4 mt-2">
							<a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-6 h-6" /></a>
							<a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-6 h-6" /></a>
							<a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-6 h-6" /></a>
							<a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-6 h-6" /></a>
						</div>
					</div>

					{/* Quick Links */}
					<div className="text-left">
						<h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
						<ul className="space-y-1 text-base">
							<li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
							<li><a href="#facilities" className="hover:text-white transition-colors">Facilities</a></li>
							<li><a href="#academics" className="hover:text-white transition-colors">Academics</a></li>
							<li><a href="#campuslife" className="hover:text-white transition-colors">Campus Life</a></li>
							<li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
						</ul>
					</div>

					{/* Facilities */}
					<div className="text-left">
						<h3 className="text-lg font-semibold text-white mb-3">Our Facilities</h3>
						<ul className="space-y-1 text-base">
							<li>Modern Library</li>
							<li>Research Labs</li>
							<li>Sports Complex</li>
							<li>Smart Classrooms</li>
							<li>Auditorium</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-neutral-800 mt-8 pt-6 text-center">
					<p className="text-gray-400">&copy; 2025 SHUATS. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
