'use client';

import { Calendar, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from '@/contexts/cookie-context';

import VideoFrame from './VideoFrame';

const TYPING_TEXT = 'SHUATS National Talent Search Quiz';
const TYPING_SPEED = 60; // ms per character

const TypingHeading = () => {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(TYPING_TEXT.slice(0, i + 1));
      i++;
      if (i === TYPING_TEXT.length) {
        clearInterval(interval);
        setShowCursor(false);
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, []);

  // Render 'SHUATS' in green if present in displayed
  let headingNode;
  if (displayed.startsWith('SHUATS')) {
    headingNode = (
      <>
        <span className="text-green-900 font-extrabold">
          {displayed.slice(0, 6)}
        </span>
        {displayed.slice(6)}
      </>
    );
  } else {
    headingNode = displayed;
  }

  return (
    <h1 className="text-3xl md:text-5xl font-extrabold text-blue-900 drop-shadow-lg tracking-tight mb-5">
      {headingNode}
      {showCursor && <span className="animate-pulse text-pink-600">|</span>}
    </h1>
  );
};

// Countdown Calendar Card styled like the event timeline
const CountdownCalendarCard = () => {
  const eventDate = new Date('2025-07-12T10:30:00');
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();
      const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      setDaysLeft(days);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 md:w-32 bg-white rounded-2xl shadow-lg flex flex-col items-center">
        {/* Pink gradient top with tabs */}
        <div className="w-full h-4 rounded-t-2xl bg-gradient-to-r from-pink-400 to-pink-300 flex items-end justify-between px-2 relative">
          {/* Tabs */}
          <div className="w-3 h-3 bg-white rounded-b-full absolute left-0 -bottom-1 shadow" />
          <div className="w-3 h-3 bg-white rounded-b-full absolute right-0 -bottom-1 shadow" />
        </div>
        <div className="flex flex-col items-center py-3">
          <span className="text-xs font-semibold text-gray-500 tracking-widest mb-1">JULY</span>
          <span className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">12</span>
        </div>
      </div>
      <div className="text-center text-sm md:text-base text-gray-600 font-medium mt-2">
        {daysLeft !== null && (daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : 'Event is live!')}
      </div>
    </div>
  );
};

// Timeline Calendar Card for Quiz Timeline
const TimelineCalendarCard = ({ month, day, label }: { month: string; day: string; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-36 md:w-44 bg-white rounded-2xl shadow-lg flex flex-col items-center">
      {/* Pink gradient top with scalloped edge */}
      <div className="w-full h-5 rounded-t-2xl bg-gradient-to-r from-pink-400 to-pink-300 flex items-end justify-between px-0 relative overflow-visible">
        {/* Scalloped edge: 5 circles */}
        <div className="absolute left-0 top-full w-full flex justify-between px-4" style={{ transform: 'translateY(-50%)' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-5 h-5 bg-white rounded-full shadow" />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center py-5">
        <span className="text-sm font-semibold text-gray-500 tracking-widest mb-1">{month}</span>
        <span className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-1">{day}</span>
      </div>
    </div>
    <div className="text-center text-lg md:text-xl text-gray-800 font-medium mt-4">
      {label}
    </div>
  </div>
);

// Add this component above TakeQuiz
const CountdownTimer = () => {
  const eventDate = new Date('2025-07-12T00:00:00');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isOver, setIsOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useCookies();

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsOver(true);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
      setIsOver(false);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000); // update every second
    return () => clearInterval(timer);
  }, []);

  const handleRegister = () => {
    if (loading) return;
    setLoading(true);
    router.push('/register');
  };

  return (
    <div className="w-full flex justify-center mt-8 mb-8 px-2">
      {/* Gradient border wrapper */}
      <div className="bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 p-[2px] rounded-full w-full max-w-xl shadow-lg">
        <div className="flex items-center bg-white rounded-full shadow-md w-full p-1 md:p-2">
          <div className="flex items-center px-2 md:px-6 py-2 md:py-4 gap-2 md:gap-6 text-center flex-1 overflow-x-auto">
            <div className="flex flex-col items-center min-w-[40px]">
              <span className="text-lg md:text-2xl font-extrabold text-gray-900">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[10px] md:text-xs font-semibold text-gray-500 tracking-widest mt-1">DAYS</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-300">|</span>
            <div className="flex flex-col items-center min-w-[40px]">
              <span className="text-lg md:text-2xl font-extrabold text-gray-900">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[10px] md:text-xs font-semibold text-gray-500 tracking-widest mt-1">HRS</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-300">|</span>
            <div className="flex flex-col items-center min-w-[40px]">
              <span className="text-lg md:text-2xl font-extrabold text-gray-900">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] md:text-xs font-semibold text-gray-500 tracking-widest mt-1">MINS</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-300">|</span>
            <div className="flex flex-col items-center min-w-[40px]">
              <span className="text-lg md:text-2xl font-extrabold text-gray-900">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] md:text-xs font-semibold text-gray-500 tracking-widest mt-1">SECS</span>
            </div>
          </div>
          <button
            className={`ml-2 md:ml-4 px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-base md:text-lg transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow whitespace-nowrap flex items-center justify-center`}
            style={{minWidth: 90}}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            ) : null}
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

const TakeQuiz = () => {
  return (
    <>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 w-full h-[120vh] bg-gradient-to-tr from-blue-400 via-fuchsia-200 to-pink-300 animate-gradient-x" />
      {/* Main Heading */}
      <div className="w-full max-w-5xl mx-auto text-center mt-8 mb-2 px-2 pt-20">
        <TypingHeading />
        <p className="text-lg md:text-xl text-gray-800 font-medium">
          Join us for an exciting opportunity to showcase your knowledge and win
          amazing prizes!
        </p>
      </div>

      {/* Card Deck Section */}
      <section
        id="quiz"
        className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8 px-2 py-5">
        {/* Video Card */}
        <div className="flex-1 min-w-[290px] max-w-sm w-full md:w-auto flex flex-col justify-center items-center bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-200 transition-transform hover:scale-105 hover:shadow-[0_8px_40px_rgba(80,80,255,0.15)] duration-200 p-1 mx-auto">
          <div className="w-full p-3 flex flex-col gap-4 items-center">
            <div className="w-full">
              <VideoFrame filter="landscape" />
            </div>
            <div className="w-full">
              <VideoFrame filter="portrait" />
            </div>
          </div>
        </div>
        {/* Prizes Card */}
        <div className="w-full max-w-sm md:max-w-sm flex flex-col items-center bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-purple-200 px-2 sm:px-4 pt-0 pb-8 transition-transform hover:scale-105 hover:shadow-[0_8px_40px_rgba(150,80,255,0.15)] duration-200 p-1 overflow-x-auto mx-auto">
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 text-xl font-bold text-purple-700 mb-3 mt-6">
              <Calendar className="h-5 w-5" />
              <span>Date: 12 July, 2025</span>
            </div>
            {/* Prizes Layout: 1st Prize on top, 2nd & 3rd below */}
            <div className="w-full flex flex-col items-center">
              {/* 1st Prize */}
              <div className="bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-xl px-6 py-6 mb-4 w-full flex flex-col items-center shadow-2xl">
                <Trophy className="h-10 w-10 text-yellow-500 mb-2" />
                <div className="font-bold text-2xl text-black mb-1">
                  1st Prize
                </div>
                <div className="text-3xl font-extrabold text-black mb-1">
                  ₹10,000
                </div>
                <div className="text-black font-medium">Grand Winner</div>
              </div>
              {/* 2nd & 3rd Prize Row */}
              <div className="flex flex-row gap-4 w-full mb-4 flex-wrap md:flex-nowrap">
                {/* 2nd Prize */}
                <div className="flex-1 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-xl px-4 py-4 flex flex-col items-center shadow-2xl min-w-[120px]">
                  <Trophy className="h-8 w-8 text-gray-500 mb-1" />
                  <div className="font-bold text-lg text-black mb-1">
                    2nd Prize
                  </div>
                  <div className="text-2xl font-bold text-black mb-1">
                    ₹5,000
                  </div>
                </div>
                {/* 3rd Prize */}
                <div className="flex-1 bg-gradient-to-br from-amber-300 via-orange-400 to-orange-500 rounded-xl px-4 py-4 flex flex-col items-center shadow-2xl min-w-[120px] mt-4 md:mt-0">
                  <Trophy className="h-8 w-8 text-orange-500 mb-1" />
                  <div className="font-bold text-lg text-black mb-1">
                    3rd Prize
                  </div>
                  <div className="text-2xl font-bold text-black mb-1">
                    ₹3,000
                  </div>
                </div>
              </div>
              {/* Additional Prizes */}
              <div className="w-full mt-6 mb-4">
                <div className="font-bold text-black-700 text-base md:text-lg mb-2 text-center">
                  <span className="font-bold">Fee Concession Prizes</span>{' '}
                  <br />
                  <span className="text-sm md:text-base font-light">
                    (Fee Concession applicable only for aspirants of
                    B.Tech(CSE), BCA & B.Sc(Computer Science) Programmes)
                  </span>
                </div>
                <ul className="text-purple-900 text-sm md:text-base font-medium space-y-2 list-disc list-inside">
                  <li>
                    1st to 10th rank:{' '}
                    <span className="font-bold">50% Fee Concession</span>
                  </li>
                  <li>
                    11th to 50th rank:{' '}
                    <span className="font-bold">30% Fee Concession</span>
                  </li>
                  <li>
                    51st to 300th rank:{' '}
                    <span className="font-bold">25% Fee Concession</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Buttons inside the card, below the prizes */}
          <div className="flex flex-col gap-3 w-full justify-center mt-4 mb-0">
            <a
              href="/register"
              className="px-5 py-3 bg-[#2563eb] text-white font-bold rounded-lg shadow hover:bg-[#1d4ed8] hover:shadow-lg hover:scale-[1.02] text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] ring-offset-2 ring-offset-white w-full md:flex-1">
              Register
            </a>
            <a
              href="/syllabus_list"
              className="px-5 py-3 bg-pink-600 text-white font-bold rounded-lg shadow hover:bg-pink-700 hover:shadow-lg hover:scale-[1.02] text-center flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 ring-offset-2 ring-offset-white glow-btn w-full md:flex-1">
              Check Syllabus
            </a>
          </div>
        </div>
        {/* Poster Card */}
        <div className="flex-1 min-w-[290px] max-w-sm w-full md:w-auto flex flex-col justify-start items-center bg-white/60 backdrop-blur-lg rounded-3xl border border-pink-200 transition-transform hover:scale-105 duration-200 p-1 mx-auto mb-8 md:mb-0">
          <div className="w-full h-full flex flex-col justify-start items-center">
            {/*Important Notice Box (no poster image) */}
            <div className="w-full bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 mt-4 mb-4 shadow-md flex flex-col items-start px-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-red-600 text-xl md:text-2xl animate-pulse">🚨</span>
                <span className="font-extrabold text-lg md:text-xl text-pink-700 uppercase tracking-wide drop-shadow-sm">
                  Important Notice
                </span>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <div className="bg-gray-100 rounded-2xl shadow px-4 py-3 text-gray-900 font-semibold">
                  <b>Eligibility:</b> For students who passed Class 12 in 2025.
                </div>
                <div className="bg-gray-100 rounded-2xl shadow px-4 py-3 text-gray-900 font-semibold">
                  <b>Attention:</b> Participants can win Prize Money with Quiz Competition and those who wish to get Admission in B.Tech Computer Science, BCA & BSc Computer Science in SHUATS, Prayagraj also get fee concession as well.
                </div>
                <div className="bg-gray-100 rounded-2xl shadow px-4 py-3 text-gray-900 font-semibold">
                  <b>Free Registration</b>
                </div>
                <div className="bg-gray-100 rounded-2xl shadow px-4 py-3 text-gray-900 font-semibold">
                  <b>Contact:</b> 9935620054, 9335101824
                </div>
                <div className="bg-gray-100 rounded-2xl shadow px-4 py-3 text-gray-900 font-semibold">
                  <b>Quiz Time:</b> Quiz will be enable on day of Quiz
                </div>
                <div className="bg-gray-100 rounded-2xl shadow px-4 py-3 text-gray-900 font-semibold">
                  <b>Attention:</b> Original Documents will be required at the time of prize distribution
                </div>
                <div className="bg-gray-100 rounded-2xl shadow px-4 py-3 text-gray-900 font-semibold">
                  <b>Organized by:</b> Dept. of Computer Science & IT, SHUATS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Countdown Timer Section */}
      <CountdownTimer />
      {/* Quiz Timeline Section */}
      <section className="w-full max-w-3xl mx-auto mt-8 mb-12">
        <h2 className="text-4xl font-bold text-center mb-10">Quiz Timeline</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          <TimelineCalendarCard month="MAY" day="26" label="Enrollment Begins" />
          <TimelineCalendarCard month="JULY" day="12" label="Quiz is Live" />
          <TimelineCalendarCard month="JULY" day="15" label="See Result" />
        </div>
      </section>
      <style
        jsx
        global>{`
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease-in-out infinite;
        }
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .glow-btn:hover {
          box-shadow:
            0 0 16px 2px #a5b4fc,
            0 0 8px 2px #f472b6;
        }
      `}</style>
    </>
  );
};

export default TakeQuiz;
