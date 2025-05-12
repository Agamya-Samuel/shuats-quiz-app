import { Mail, Phone, Map } from 'lucide-react';

export default function DeanAndHODInfo() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dean Info */}
          <div className="bg-white/0 rounded-2xl p-8 flex flex-col items-start shadow-md border border-green-100">
            <div className="flex items-center mb-2">
              <Map className="w-8 h-8 text-green-600 mr-2" />
              <h3 className="text-2xl font-bold text-green-700">Prof. (Dr.) Ashok Tripathi</h3>
            </div>
            <div className="font-semibold text-green-600 mb-2 text-lg">Dean of Department of Computer Science & Information Technology</div>
            <div className="text-green-700 mb-2 text-sm">
              SHUATS, Naini, Prayagraj (Formerly Allahabad) -211007<br />U.P. (INDIA)
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-2 text-green-700 text-base">
              <Phone className="w-5 h-5 inline-block mr-1" /> +91-532-2684394
              <span className="ml-2">Fax: +91-532-2684394</span>
            </div>
            <div className="flex items-center gap-2 text-green-700 text-base">
              <Mail className="w-5 h-5 inline-block mr-1" /> deanviaet@shuats.edu.in
            </div>
          </div>
          {/* HOD Info (Placeholder) */}
          <div className="bg-white/0 rounded-2xl p-8 flex flex-col items-start shadow-md border border-green-100">
            <div className="flex items-center mb-2">
              <Map className="w-8 h-8 text-green-600 mr-2" />
              <h3 className="text-2xl font-bold text-green-700">Dr. Wilson Jeberson</h3>
            </div>
            <div className="font-semibold text-green-600 mb-2 text-lg">Head of Department of Computer Science & Information Technology</div>
            <div className="text-green-700 mb-2 text-sm">
              SHUATS, Naini, Prayagraj (Formerly Allahabad) -211007<br />U.P. (INDIA)
            </div>
            <div className="flex items-center gap-4 mb-2 text-green-700 text-base">
              <Phone className="w-5 h-5 inline-block mr-1" /> +919452248375
            </div>
            <div className="flex items-center gap-2 text-green-700 text-base">
              <Mail className="w-5 h-5 inline-block mr-1" /> jeberson_w@shuats.edu.in
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 