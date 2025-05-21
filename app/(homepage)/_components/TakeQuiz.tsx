'use client';

import { Calendar, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
  QuizPoster,
  campusTourVideo,
  campusTourVideo1,
} from '../../../public/images/index.js';
import VideoFrame from './VideoFrame';

const prizes = [
  {
    place: '2nd Prize',
    amount: '₹5,000',
    color: 'from-gray-200 to-gray-400',
    icon: <Trophy className="h-7 w-7 text-gray-500" />,
  },
  {
    place: '1st Prize',
    amount: '₹10,000',
    color: 'from-yellow-300 to-yellow-500',
    icon: <Trophy className="h-7 w-7 text-yellow-600" />,
    highlight: 'Grand Winner',
  },
  {
    place: '3rd Prize',
    amount: '₹3,000',
    color: 'from-orange-200 to-orange-400',
    icon: <Trophy className="h-7 w-7 text-orange-500" />,
  },
];

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
    <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-blue-900 drop-shadow-lg tracking-tight font-bold min-h-[2.5em]">
      {headingNode}
      {showCursor && <span className="animate-pulse text-pink-600">|</span>}
    </h1>
  );
};

const TakeQuiz = () => {
  const videoList = [campusTourVideo, campusTourVideo1];
  const [videoSrc] = useState(
    () => videoList[Math.floor(Math.random() * videoList.length)],
  );

  const isPortrait = videoSrc === campusTourVideo1;
  const aspectClass = isPortrait ? 'aspect-[2/3]' : 'aspect-[16/9]';

  return (
    <>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 w-full h-[120vh] bg-gradient-to-tr from-blue-400 via-fuchsia-200 to-pink-300 animate-gradient-x" />
      {/* Main Heading */}
      <div className="w-full max-w-5xl mx-auto text-center mt-8 mb-2 px-2 pt-20">
        <TypingHeading />
        <p className="text-lg md:text-xl text-gray-800 mb-4 font-medium">
          Join us for an exciting opportunity to showcase your knowledge and win
          amazing prizes !
        </p>
      </div>

      {/* Card Deck Section */}
      <section
        id="quiz"
        className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-8 px-2 py-10">
        {/* Video Card */}
        <div className="flex-1 min-w-[290px] max-w-sm aspect-[2/3] flex flex-col justify-center items-center bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-200 transition-transform hover:scale-105 hover:shadow-[0_8px_40px_rgba(80,80,255,0.15)] duration-200 p-1">
          <div className="w-full p-3 flex-1 flex items-center justify-center h-full">
            <VideoFrame
              src={videoSrc}
              aspectClass={aspectClass}
            />
          </div>
        </div>
        {/* Prizes Card */}
        <div className="flex-1 min-w-[290px] max-w-sm aspect-[2/3] flex flex-col items-center bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-purple-200 px-4 pt-0 pb-8 transition-transform hover:scale-105 hover:shadow-[0_8px_40px_rgba(150,80,255,0.15)] duration-200 p-1">
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 text-xl font-bold text-purple-700 mb-3 mt-6">
              <Calendar className="h-5 w-5" />
              <span>Date: 8 July, 2025</span>
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
            </div>
          </div>
          {/* Buttons inside the card, below the prizes */}
          <div className="flex flex-col md:flex-row gap-3 w-full justify-center mt-4 mb-0">
            <a
              href="/register"
              className="px-5 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ring-offset-2 ring-offset-white glow-btn w-full md:flex-1">
              Register for Quiz 🏆 Now
            </a>
            <a
              href="/syllabus_list"
              className="px-5 py-3 bg-pink-600 text-white font-bold rounded-lg shadow hover:bg-pink-700 hover:shadow-lg hover:scale-[1.02] text-center flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 ring-offset-2 ring-offset-white glow-btn w-full md:flex-1">
              Check Syllabus
            </a>
          </div>
        </div>
        {/* Poster Card */}
        <div className="flex-1 min-w-[290px] max-w-sm aspect-[2/3] flex flex-col justify-center items-center bg-white/60 backdrop-blur-lg rounded-3xl border border-pink-200 transition-transform hover:scale-105 duration-200 p-1">
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={QuizPoster}
              alt="Quiz Poster"
              width={400}
              height={600}
              className="object-contain w-full h-full rounded-xl"
              priority
            />
          </div>
        </div>
      </section>
      <style
        jsx
        global>{`
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease-in-out infinite;
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
