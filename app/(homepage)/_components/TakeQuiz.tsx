import VideoFrame from './VideoFrame';
import Image from 'next/image';
import { Calendar, Trophy } from 'lucide-react';

const TakeQuiz = () => {
	return (
		<>
			{/* Main Heading */}
			<div className="w-full max-w-5xl mx-auto text-center mt-8 mb-2 px-2 pt-20">
				<h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-blue-800 drop-shadow-lg">
					SHUATS National Talent Search <span className="text-red-600">Quiz</span>
				</h1>
				<p className="text-lg md:text-xl text-gray-700 mb-4">Join us for an exciting opportunity to showcase your knowledge and win amazing prizes!</p>
			</div>

			{/* Main Content */}
			<section id="quiz" className="w-full bg-white rounded-3xl shadow-xl mt-[-3rem] mb-12 px-4 py-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-6">
				{/* Left: Video */}
				<div className="flex-1 w-full max-w-xs md:max-w-sm flex flex-col items-center">
					<div className="w-full">
						<VideoFrame />
					</div>
				</div>
				{/* Center: Quiz Details */}
				<div className="flex-1 w-full max-w-md flex flex-col items-center">
					<div className="flex items-center justify-center gap-2 text-lg font-semibold text-purple-600 mb-4">
						<Calendar className="h-5 w-5" />
						<span>Date: 5 June, 2025</span>
					</div>
					{/* Prizes */}
					<div className="w-full flex flex-col items-center">
						{/* 1st Prize */}
						<div className="bg-yellow-100 border border-yellow-200 rounded-xl px-6 py-6 mb-4 w-full flex flex-col items-center shadow-md">
							<Trophy className="h-10 w-10 text-yellow-500 mb-2" />
							<div className="font-bold text-2xl text-yellow-700 mb-1">1st Prize</div>
							<div className="text-3xl font-extrabold text-yellow-800 mb-1">₹10,000</div>
							<div className="text-yellow-700 font-medium">Grand Winner</div>
						</div>
						{/* 2nd & 3rd Prize Row */}
						<div className="flex flex-row gap-4 w-full">
							{/* 2nd Prize */}
							<div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 flex flex-col items-center shadow-md">
								<Trophy className="h-8 w-8 text-gray-500 mb-1" />
								<div className="font-bold text-lg text-gray-700 mb-1">2nd Prize</div>
								<div className="text-2xl font-bold text-gray-800 mb-1">₹5,000</div>
							</div>
							{/* 3rd Prize */}
							<div className="flex-1 bg-orange-50 border border-orange-200 rounded-xl px-4 py-4 flex flex-col items-center shadow-md">
								<Trophy className="h-8 w-8 text-orange-500 mb-1" />
								<div className="font-bold text-lg text-orange-700 mb-1">3rd Prize</div>
								<div className="text-2xl font-bold text-orange-800 mb-1">₹3,000</div>
							</div>
						</div>
					</div>
					{/* Buttons */}
					<div className="flex flex-col md:flex-row gap-3 w-full justify-center mt-6">
						<a href="/register" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 text-center transition">Register for Quiz 🏆 Now</a>
						<a href="/syllabus_list" className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 text-center transition">Check Syllabus</a>
					</div>
				</div>
				{/* Right: Poster */}
				<div className="flex-1 w-full max-w-xs md:max-w-sm flex flex-col items-center">
					<div className="w-full rounded-2xl overflow-hidden shadow-lg">
						<Image
							src="/images/csdept1.jpg"
							alt="Quiz Poster"
							width={400}
							height={300}
							className="object-cover w-full h-56 md:h-72"
							priority
						/>
					</div>
					<div className="text-center text-purple-700 font-bold mt-2">Quiz Poster</div>
				</div>
			</section>
		</>
	);
};

export default TakeQuiz;
