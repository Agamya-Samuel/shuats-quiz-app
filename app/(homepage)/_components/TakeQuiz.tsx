import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TakeQuiz = () => {
	return (
		<section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
			<div className="container mx-auto px-4">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Ready to Test Your Knowledge?
					</h2>
					<p className="text-lg text-gray-700 mb-8">
						Challenge yourself with our interactive quizzes designed
						to help you learn and grow. Our quizzes cover a wide
						range of topics and difficulty levels.
					</p>

					<div className="space-y-6">
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h3 className="text-xl font-semibold text-gray-800 mb-3">
								Benefits of Taking Our Quizzes
							</h3>
							<ul className="text-left space-y-2 mb-4">
								<li className="flex items-start">
									<span className="text-indigo-600 mr-2">
										✓
									</span>
									<span>
										Assess your knowledge in various
										subjects
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-indigo-600 mr-2">
										✓
									</span>
									<span>
										Track your progress and identify areas
										for improvement
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-indigo-600 mr-2">
										✓
									</span>
									<span>
										Prepare for exams and assessments
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-indigo-600 mr-2">
										✓
									</span>
									<span>
										Compete with peers and see where you
										stand
									</span>
								</li>
							</ul>
						</div>

						<Link
							href="/quiz"
							className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300"
						>
							Take a Quiz Now
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TakeQuiz;
