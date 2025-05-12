import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BookOpen, FlaskConical, Briefcase } from 'lucide-react';

export default function Academics() {
	const undergraduatePrograms = [
		'Bachelor of Computer Application',
		'B.Sc. Computer Science',
		'B.Tech. (Agricultural Engineering)',
		'B.Tech. Computer Science and Engineering',
		'B.Tech. (Food Technology)',
	];

	const postgraduatePrograms = [
		'Master of Computer Application',
		'M.Tech. Processing and Food Engineering',
		'M.Tech. Farm Machinery and Power Engineering',
		'M.Tech. Irrigation and Drainage Engineering',
		'M.Tech. Soil and Water Conservation Engineering',
		'M.Tech. Agricultural Water Management',
		'M.Tech. Energy Management',
		'M.Tech. Renewable Energy Engineering',
		'M.Tech. Water Resource Engineering',
		'M.Tech. Computer Science and Engineering (Data Science)',
		'M.Tech. Computer Science and Engineering',
		'M.Tech Food Process Engineering',
		'M.Tech. Food Processing Technology',
		'M.Tech. (Food Technology) Food Plant Operation Management',
		'M.Tech. Food Safety and Quality',
	];

	const academicFeatures = [
		{
			title: 'Expert Faculty',
			description:
				'Learn from industry experts and experienced professors with extensive research backgrounds.',
			icon: <BookOpen />,
			iconColor: 'purple',
		},
		{
			title: 'Research Opportunities',
			description:
				'Engage in cutting-edge research projects with industry collaboration opportunities.',
			icon: <FlaskConical />,
			iconColor: 'green',
		},
		{
			title: 'Industry Partners',
			description:
				'Strong industry connections ensuring relevant curriculum and placement opportunities.',
			icon: <Briefcase />,
			iconColor: 'blue',
		},
	];

	return (
		<section id="academics" className="py-20 bg-neutral-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeInUp">
						Academic Excellence
					</h2>
					<p className="text-lg text-neutral-600 animate__animated animate__fadeInUp animate__delay-1s">
						Discover our comprehensive range of academic programs
						and departments
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Programs List */}
					<Card className="animate__animated animate__fadeInLeft">
						<CardHeader>
							<CardTitle>Undergraduate Programs</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-4">
								{undergraduatePrograms.map((program, index) => (
									<li
										key={index}
										className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-300"
									>
										<CheckCircle className="w-6 h-6 text-blue-600" />
										<span className="text-neutral-700">
											{program}
										</span>
									</li>
								))}
							</ul>
						</CardContent>
						<CardHeader>
							<CardTitle>Postgraduate Programs</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-4">
								{postgraduatePrograms.map((program, index) => (
									<li
										key={index}
										className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-300"
									>
										<CheckCircle className="w-6 h-6 text-green-600" />
										<span className="text-neutral-700">
											{program}
										</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>

					{/* Academic Features */}
					<div className="space-y-8 animate__animated animate__fadeInRight">
						{academicFeatures.map((feature, index) => (
							<Card
								key={index}
								className="hover:shadow-xl transition duration-300"
							>
								<CardContent className="p-6">
									<div className="flex items-center mb-4">
										<div
											className={`bg-${feature.iconColor}-100 p-3 rounded-full`}
										>
											<div
												className={`text-${feature.iconColor}-600`}
											>
												{feature.icon}
											</div>
										</div>
										<h4 className="ml-4 text-xl font-semibold">
											{feature.title}
										</h4>
									</div>
									<p className="text-neutral-600">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
