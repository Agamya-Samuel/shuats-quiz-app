import Link from 'next/link';
import { ArrowRight, Trophy, Calendar } from 'lucide-react';

const TakeQuiz = () => {
	return (
		<section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
			<div className="container mx-auto px-4">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						SHUATS National Talent Search Exam (SNTSE)
					</h2>
					<h2 className="text-1xl md:text-xl font-bold text-gray-900 mb-4">
						by Department of Computer Science & Information Technology (DCS & IT)
					</h2>
					<p className="text-lg text-gray-700 mb-8">
						Join us for an exciting opportunity to showcase your
						knowledge and win amazing prizes!
					</p>

					{/* Event Date */}
					<div className="mb-8 flex items-center justify-center gap-2 text-xl font-semibold text-indigo-700 flex-col">
						<div className="flex items-center justify-center gap-2">
							<Calendar className="h-6 w-6" />
							<span>Date: 8 July, 2025</span>
						</div>
						<span>Time: 10:30 AM</span>
					</div>

					{/* Prize Section */}
					<div className="flex flex-col gap-6 mb-8">
						{/* 1st Prize */}
						<div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-xl shadow-lg border-2 border-yellow-200 transform hover:scale-105 transition-transform">
							<Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
							<h3 className="text-3xl font-bold text-yellow-700 mb-3">
								1st Prize
							</h3>
							<p className="text-4xl font-bold text-yellow-800 mb-2">
								₹10,000
							</p>
							<p className="text-lg text-yellow-700">Grand Winner</p>
						</div>

						{/* 2nd and 3rd Prizes */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* 2nd Prize */}
							<div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg border-2 border-gray-200 transform hover:scale-105 transition-transform">
								<Trophy className="h-12 w-12 text-gray-500 mx-auto mb-4" />
								<h3 className="text-2xl font-bold text-gray-700 mb-2">
									2nd Prize
								</h3>
								<p className="text-3xl font-bold text-gray-800">
									₹5,000
								</p>
							</div>

							{/* 3rd Prize */}
							<div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg border-2 border-orange-200 transform hover:scale-105 transition-transform">
								<Trophy className="h-12 w-12 text-orange-500 mx-auto mb-4" />
								<h3 className="text-2xl font-bold text-amber-700 mb-2">
									3rd Prize
								</h3>
								<p className="text-3xl font-bold text-amber-800">
									₹3,000
								</p>
							</div>
						</div>
					</div>

					{/* Additional Prizes */}
					{/* <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 p-8 rounded-xl shadow-lg border-2 border-purple-200 mb-8">
						<div className="flex items-center justify-center gap-3 mb-6">
							<Users className="h-8 w-8 text-purple-600" />
							<h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
								Additional Prizes
							</h3>
						</div>
						<div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-inner">
							<p className="text-xl font-semibold text-gray-800">
								Rank 4 to 50:{' '}
								<span className="text-purple-600 font-bold">
									₹1,000
								</span>{' '}
								each
							</p>
							<p className="text-sm text-gray-600 mt-2">
								Don&apos;t miss out on this amazing opportunity to
								win!
							</p>
						</div>
					</div> */}

					<Link
						href="/register"
						className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-lg"
					>
						Register for Quiz 🏆 Now
						<ArrowRight className="ml-2 h-5 w-5" />
					</Link>
					<br />
					<br />
					<Link
						href="/syllabus_list"
						className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300 text-lg"
					>
						Check Syllabus
						<ArrowRight className="ml-2 h-5 w-5" />
					</Link>
				</div>
			</div>
		</section>
	);
};

export default TakeQuiz;
