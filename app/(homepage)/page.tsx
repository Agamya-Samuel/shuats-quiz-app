// app/(homepage)/page.tsx

import Navbar from '@/app/(homepage)/_components/Navbar';
import Facilities from '@/app/(homepage)/_components/Facilities';
import Academics from '@/app/(homepage)/_components/Academics';
import CampusLife from '@/app/(homepage)/_components/CampusLife';
import Infrastructure from '@/app/(homepage)/_components/Infrastructure';
import Gallery from '@/app/(homepage)/_components/Gallery';
import Contact from '@/app/(homepage)/_components/Contact';
import Footer from '@/app/(homepage)/_components/Footer';
import TakeQuiz from '@/app/(homepage)/_components/TakeQuiz';

export default function Home() {
	return (
		<div className="antialiased text-gray-800 min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<TakeQuiz />
				{/* Additional Sections */}
				<Facilities />
				<Academics />
				<CampusLife />
				<Infrastructure />
				<Gallery />
				<Contact />
			</main>
			<Footer />
		</div>
	);
}
