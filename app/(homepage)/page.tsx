// // app/(homepage)/page.tsx
// import Academics from '@/app/(homepage)/_components/Academics';
// import CampusLife from '@/app/(homepage)/_components/CampusLife';
// import Contact from '@/app/(homepage)/_components/Contact';
// import Facilities from '@/app/(homepage)/_components/Facilities';
// import Footer from '@/app/(homepage)/_components/Footer';
// import Gallery from '@/app/(homepage)/_components/Gallery';
// import Hero from '@/app/(homepage)/_components/Hero';
// import Infrastructure from '@/app/(homepage)/_components/Infrastructure';
// import Navbar from '@/app/(homepage)/_components/Navbar';
// import TakeQuiz from '@/app/(homepage)/_components/TakeQuiz';

// export default function Home() {
//   return (
//     <div className="antialiased text-gray-800 min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-1">
//         <TakeQuiz />
//         <Facilities />
//         <Academics />
//         <CampusLife />
//         <Infrastructure />
//         <Gallery />
//         <Contact />
//       </main>
//       <Footer />
//     </div>
//   );
// }

import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to /user/login
  redirect('/user/login');
}
