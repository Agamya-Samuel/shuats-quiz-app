// app/(homepage)/page.tsx

import Navbar from '@/app/(homepage)/_components/Navbar';
import Hero from '@/app/(homepage)/_components/Hero';
import Facilities from '@/app/(homepage)/_components/Facilities';
import Academics from '@/app/(homepage)/_components/Academics';
import CampusLife from '@/app/(homepage)/_components/CampusLife';
import Infrastructure from '@/app/(homepage)/_components/Infrastructure';
import Gallery from '@/app/(homepage)/_components/Gallery';
import DeanAndHODInfo from '@/app/(homepage)/_components/DeanAndHODInfo';
import Contact from '@/app/(homepage)/_components/Contact';
import Footer from '@/app/(homepage)/_components/Footer';
import TakeQuiz from '@/app/(homepage)/_components/TakeQuiz';
import VideoFrame from '@/app/(homepage)/_components/VideoFrame';

export default function Home() {
	return (
		<div className="antialiased text-gray-800 min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<Hero />
				<TakeQuiz />
				<VideoFrame />
				<Facilities />
				<Academics />
				<CampusLife />
				<Infrastructure />
				<Gallery />
				<DeanAndHODInfo />
				<Contact />
			</main>
			<Footer />
		</div>
	);
}
