import Navbar from "@/app/_components/Navbar"
import Hero from "@/app/_components/Hero"
import Facilities from "@/app/_components/Facilities"
import Academics from "@/app/_components/Academics"
import CampusLife from "@/app/_components/CampusLife"
import Infrastructure from "@/app/_components/Infrastructure"
import Gallery from "@/app/_components/Gallery"
import Testimonials from "@/app/_components/Testimonials"
import Contact from "@/app/_components/Contact"
import Footer from "@/app/_components/Footer"

export default function Home() {
  return (
    <div className="antialiased text-gray-800 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Facilities />
        <Academics />
        <CampusLife />
        <Infrastructure />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

