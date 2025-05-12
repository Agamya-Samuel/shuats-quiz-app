import { Mail, Phone, Map } from 'lucide-react';
import Image from 'next/image';

const profiles = [
  {
    name: 'Prof. (Dr.) Ashok Tripathi',
    title: 'Dean of Department of Computer Science & Information Technology',
    address: 'SHUATS, Naini, Prayagraj (Formerly Allahabad) -211007\nU.P. (INDIA)',
    phone: '+91-532-2684394',
    fax: 'Fax: +91-532-2684394',
    email: 'deanviaet@shuats.edu.in',
    img: '/images/dean.asp',
    color: 'green',
  },
  {
    name: 'Dr. Wilson Jeberson',
    title: 'Head of Department of Computer Science & Information Technology',
    address: 'SHUATS, Naini, Prayagraj (Formerly Allahabad) -211007\nU.P. (INDIA)',
    phone: '+919452248375',
    email: 'jeberson_w@shuats.edu.in',
    img: '/images/hod.asp',
    color: 'green',
  },
  {
    name: 'Er. Dileep Kumar',
    title: 'Assistant Professor (Sel. Grade)',
    address: 'SHUATS, Naini, Prayagraj (Formerly Allahabad) -211007\nU.P. (INDIA)',
    phone: '+919935620054',
    email: 'dileep.kumar@shuats.edu.in',
    img: '/images/csdept1.jpg',
    color: 'blue',
  },
  {
    name: 'Dr. N. K. Gupta',
    title: 'Assistant Professor (Sel. Grade)',
    address: 'SHUATS, Naini, Prayagraj (Formerly Allahabad) -211007\nU.P. (INDIA)',
    phone: '+919335101824',
    email: 'narendra.gupta@shuats.edu.in',
    img: '/images/nk_gupta.png',
    color: 'purple',
  },
];

export default function DeanAndHODInfo() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profiles.map((profile, idx) => (
            <div key={idx} className="bg-white/0 rounded-2xl p-8 flex flex-col items-center shadow-md border border-green-100">
              <div className="w-28 h-28 mb-6 rounded-xl overflow-hidden">
                <Image src={profile.img} alt={profile.name} width={112} height={112} className="object-cover w-full h-full" />
              </div>
              <div className="flex items-center mb-3">
                <Map className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-2xl font-extrabold text-green-700 text-center">{profile.name}</h3>
              </div>
              <div className="font-bold text-lg text-green-600 mb-4 text-center">{profile.title}</div>
              <div className="text-sm text-neutral-600 mb-6 text-center whitespace-pre-line">{profile.address}</div>
              <div className="w-full border-t border-green-100 my-4"></div>
              <div className="w-full bg-green-50/60 rounded-xl px-4 py-3 flex flex-col gap-2 items-center">
                {profile.phone && (
                  <div className="flex flex-wrap items-center gap-2 text-green-700 text-base justify-center">
                    <Phone className="w-5 h-5 inline-block mr-1" />
                    <span className="font-medium">{profile.phone}</span>
                    {profile.fax && <span className="ml-2 font-medium">{profile.fax}</span>}
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2 text-green-700 text-base justify-center">
                    <Mail className="w-5 h-5 inline-block mr-1" />
                    <span className="font-medium">{profile.email}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 