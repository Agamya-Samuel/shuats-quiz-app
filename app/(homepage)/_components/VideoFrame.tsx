"use client";
import React, { useRef, useState } from 'react';
import { campusTourVideo } from '@/public/images/index.js';

const VideoFrame = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);

  const handleMicClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent play/pause toggle
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  // Keep playing state in sync with video events
  const handleVideoPlay = () => setPlaying(true);
  const handleVideoPause = () => setPlaying(false);

  return (
    <div className="flex flex-col items-center my-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-black-700 drop-shadow-lg tracking-tight">Let&apos;s have a tour of our campus</h2>
      <div
        className="w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden bg-background relative group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handlePlayPause}
      >
        <video
          ref={videoRef}
          src={campusTourVideo}
          autoPlay
          muted={muted}
          loop
          playsInline
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          className="w-full h-full min-h-[320px] md:min-h-[480px] bg-background object-cover select-none pointer-events-none"
        />
        {/* Centered play/pause icon overlay */}
        <div
          className={`absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300
            ${!playing || hovered ? 'opacity-100 pointer-events-none' : 'opacity-0 pointer-events-none'}`}
        >
          {playing && hovered ? (
            // Pause icon (Heroicon, glowing)
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-20 h-20 drop-shadow-[0_0_16px_rgba(59,130,246,0.7)]">
              <rect x="14" y="12" width="6" height="24" rx="2" fill="#2563eb" />
              <rect x="28" y="12" width="6" height="24" rx="2" fill="#2563eb" />
            </svg>
          ) : (
            // Play icon (Heroicon, glowing)
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-24 h-24 drop-shadow-[0_0_24px_rgba(59,130,246,0.7)]">
              <circle cx="24" cy="24" r="22" fill="white" stroke="#2563eb" strokeWidth="3" />
              <polygon points="20,16 36,24 20,32" fill="#2563eb" />
            </svg>
          )}
        </div>
        {/* Speaker button bottom right */}
        <button
          onClick={handleMicClick}
          className="absolute bottom-4 right-4 z-40 bg-white/80 dark:bg-black/60 rounded-full p-3 shadow-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition"
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? (
            // Speaker off icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            // Speaker on icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoFrame; 