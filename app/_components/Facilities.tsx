import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Facilities() {
  const facilities = [
    {
      title: "Modern Library",
      icon: "book-reader",
      description: "Extensive collection of books, digital resources, and quiet study spaces for focused learning.",
    },
    {
      title: "Research Labs",
      icon: "flask",
      description: "State-of-the-art laboratories equipped with modern instruments for practical learning.",
    },
    {
      title: "Sports Complex",
      icon: "running",
      description: "Multi-purpose sports facilities including indoor and outdoor courts for physical activities.",
    },
    {
      title: "Computing Center",
      icon: "desktop",
      description: "Advanced computing facilities with latest software and high-speed internet access.",
    },
    {
      title: "Auditorium",
      icon: "theater-masks",
      description: "Modern auditorium for conferences, seminars, and cultural events.",
    },
    {
      title: "Cafeteria",
      icon: "utensils",
      description: "Spacious dining area serving nutritious meals in a comfortable environment.",
    },
  ]

  return (
    <section id="facilities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeInUp">
            Our World-Class Facilities
          </h2>
          <p className="text-lg text-neutral-600 animate__animated animate__fadeInUp animate__delay-1s">
            Discover the state-of-the-art amenities that enhance your learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <Card
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 text-white mr-2">
                    <i className={`fas fa-${facility.icon}`}></i>
                  </span>
                  {facility.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">{facility.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

