import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, School, FlaskRoundIcon as Flask, Wifi, LayoutGrid, BookOpen, FlaskConical } from 'lucide-react';

export default function Infrastructure() {
	const stats = [
		{
			title: 'Campus Area',
			value: '1020',
			unit: 'Acres',
			color: 'from-blue-400 to-blue-600',
			icon: LayoutGrid,
		},
		{
			title: 'Classrooms',
			value: '100+',
			unit: '',
			color: 'from-green-400 to-green-600',
			icon: BookOpen,
		},
		{
			title: 'Laboratories',
			value: '50+',
			unit: '',
			color: 'from-purple-400 to-purple-600',
			icon: FlaskConical,
		},
	];

	const features = [
		{
			title: 'Modern Architecture',
			description:
				'Contemporary building design with sustainable features',
			icon: Building2,
			color: 'bg-blue-100 text-blue-600',
		},
		{
			title: 'Power Backup',
			description:
				'24/7 uninterrupted power supply with green energy integration',
			icon: School,
			color: 'bg-green-100 text-green-600',
		},
		{
			title: 'Security Systems',
			description: 'Advanced surveillance and security protocols',
			icon: Flask,
			color: 'bg-purple-100 text-purple-600',
		},
		{
			title: 'Wi-Fi Campus',
			description:
				'High-speed internet connectivity throughout the campus',
			icon: Wifi,
			color: 'bg-red-100 text-red-600',
		},
	];

	return (
		<section id="infrastructure" className="py-20 bg-neutral-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-extrabold text-neutral-900 mb-4 animate__animated animate__fadeInUp">
						Campus Infrastructure
					</h2>
					<p className="text-lg font-semibold text-neutral-700 animate__animated animate__fadeInUp animate__delay-1s">
						Modern facilities designed to support your educational journey
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					{/* Infrastructure Stats */}
					<div className="space-y-8 animate__animated animate__fadeInLeft">
						{stats.map((stat, index) => (
							<Card
								key={index}
								className="transition duration-300 shadow-lg border-2 border-blue-100 bg-gradient-to-br hover:scale-[1.025] hover:shadow-2xl"
								style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
							>
								<CardContent className={`p-8 flex items-center gap-6`}> 
									<div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color} shadow-md`}>
										<stat.icon className="w-8 h-8 text-white" />
									</div>
									<div>
										<h3 className="text-2xl font-extrabold text-neutral-900 mb-1">{stat.title}</h3>
										<div className="flex items-end gap-2">
											<span className={`text-4xl md:text-5xl font-extrabold drop-shadow-sm ${
												index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : 'text-purple-600'
											}`}>{stat.value}</span>
											{stat.unit && <span className="text-lg font-bold text-neutral-700 mb-1">{stat.unit}</span>}
										</div>
										<p className="text-neutral-700 font-semibold mt-1">of green campus</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Features List */}
					<Card className="animate__animated animate__fadeInRight shadow-lg border-2 border-blue-100 bg-white/90">
						<CardHeader>
							<CardTitle className="text-2xl font-extrabold mb-6 text-neutral-900">
								Key Infrastructure Features
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{features.map((feature, index) => (
								<div
									key={index}
									className="flex items-start space-x-5"
								>
									<div
										className={`flex-shrink-0 w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center shadow`}
									>
										<feature.icon className="w-7 h-7" />
									</div>
									<div>
										<h4 className="text-lg font-bold text-neutral-900 mb-1">
											{feature.title}
										</h4>
										<p className="text-neutral-700 font-semibold">
											{feature.description}
										</p>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
