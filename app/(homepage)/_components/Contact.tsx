import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

export default function Contact() {
	return (
		<section id="contact" className="py-20 bg-neutral-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-white mb-4 animate__animated animate__fadeInUp">
						Contact Us
					</h2>
					<p className="text-lg text-gray-300 animate__animated animate__fadeInUp animate__delay-1s">
						Get in touch with us for any inquiries
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Contact Form */}
					<Card className="animate__animated animate__fadeInLeft">
						<CardHeader>
							<CardTitle>Send us a message</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="space-y-6">
								<div>
									<Input
										type="text"
										placeholder="Full Name"
										required
									/>
								</div>
								<div>
									<Input
										type="email"
										placeholder="Email Address"
										required
									/>
								</div>
								<div>
									<Input
										type="tel"
										placeholder="Phone Number"
									/>
								</div>
								<div>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Subject" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="general">
												General Inquiry
											</SelectItem>
											<SelectItem value="admissions">
												Admissions
											</SelectItem>
											<SelectItem value="facilities">
												Facilities
											</SelectItem>
											<SelectItem value="academic">
												Academic Programs
											</SelectItem>
											<SelectItem value="other">
												Other
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Textarea
										placeholder="Your Message"
										rows={4}
										required
									/>
								</div>
								<Button type="submit" className="w-full">
									Send Message
								</Button>
							</form>
						</CardContent>
					</Card>

					{/* Contact Information */}
					<div className="space-y-8 animate__animated animate__fadeInRight">
						<Card className="bg-neutral-800 text-white">
							<CardHeader>
								<CardTitle>Get in Touch</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="flex items-start space-x-4">
									<MapPin className="w-6 h-6 text-blue-400" />
									<div>
										<h4 className="text-lg font-semibold">
											Address
										</h4>
										<p className="text-gray-300">
											CR9W+2WV, Residential Quarters- AAIDU,
											Rewa Road, Naini, Mahewa East, Prayagraj,
											Uttar Pradesh 211007
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-4">
									<Mail className="w-6 h-6 text-blue-400" />
									<div>
										<h4 className="text-lg font-semibold">
											Email
										</h4>
										<p className="text-gray-300">
											shuats@gmail.com
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-4">
									<Phone className="w-6 h-6 text-blue-400" />
									<div>
										<h4 className="text-lg font-semibold">
											Phone
										</h4>
										<p className="text-gray-300">
											+1 (234) 567-8900
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card className="bg-neutral-800 text-white">
							<CardHeader>
								<CardTitle>Operating Hours</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center space-x-2">
									<Clock className="w-5 h-5 text-blue-400" />
									<p>Monday - Friday: 9:00 AM - 5:30 PM</p>
								</div>
								<div className="flex items-center space-x-2">
									<Clock className="w-5 h-5 text-blue-400" />
									<p>Saturday: Closed</p>
								</div>
								<div className="flex items-center space-x-2">
									<Clock className="w-5 h-5 text-blue-400" />
									<p>Sunday: Closed</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
}
