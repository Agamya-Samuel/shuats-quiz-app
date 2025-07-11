import React from 'react';

const SyllabusListPage = () => {
  return (
    <section className="min-h-screen py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border-2 border-blue-100">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center drop-shadow">Quiz Syllabus</h1>
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-indigo-700 mb-2">1. General Knowledge</h2>
              
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-indigo-700 mb-2">2. Basic Computer Skills</h2>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-indigo-700 mb-2">3. Logical Reasoning</h2>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Quiz Format:</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>All questions will be Multiple Choice Questions (MCQs).</li>
                <li>Total number of questions: 90.</li>
                <li>Duration of the quiz: 60 minutes.</li>
                <li>There is no negative marking.</li>
              </ul>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Stay tuned for more updates and detailed topic breakdowns!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SyllabusListPage; 