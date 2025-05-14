const SyllabusDisplay = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Quiz Syllabus</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-indigo-700 mb-2">Section 1: General Knowledge</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Current Affairs (National and International)</li>
            <li>Indian History and Culture</li>
            <li>Basic Science</li>
            <li>Geography</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-indigo-700 mb-2">Section 2: Basic Computer Skills</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Fundamentals of Computer</li>
            <li>Microsoft Office Suite (Word, Excel, PowerPoint)</li>
            <li>Internet Basics</li>
            <li>Cyber Security Awareness</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-indigo-700 mb-2">Section 3: Logical Reasoning</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Analogies</li>
            <li>Number Series</li>
            <li>Coding and Decoding</li>
            <li>Problem Solving</li>
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Quiz Format:</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>All questions will be Multiple Choice Questions (MCQs).</li>
            <li>Total number of questions: 50.</li>
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
  );
};

export default SyllabusDisplay; 