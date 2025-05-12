"use client";
import React, { useRef, useState } from 'react';

const VIDEO_URL = "/Video/shuats.mp4";

const VideoFrame = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const handleMicClick = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <div className="flex flex-col items-center my-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-black-700 drop-shadow-lg tracking-tight">Let&apos;s have a tour of our campus</h2>
      <div className="w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden bg-background relative">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          autoPlay
          muted={muted}
          loop
          playsInline
          className="w-full h-full min-h-[320px] md:min-h-[480px] bg-background object-cover"
        />
        <button
          onClick={handleMicClick}
          className="absolute bottom-4 right-4 z-20 bg-white/80 dark:bg-black/60 rounded-full p-3 shadow-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition"
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.75V12a3 3 0 10-6 0v.75m9 .75a6.003 6.003 0 01-11.996-.75M12 18v3m0 0h3m-3 0H9" />
              <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v3m0 0h3m-3 0H9m6-6.75V12a3 3 0 10-6 0v.75m9 .75a6.003 6.003 0 01-11.996-.75" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoFrame; 