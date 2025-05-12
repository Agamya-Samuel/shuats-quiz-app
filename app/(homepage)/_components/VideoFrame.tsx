"use client";
import React, { useRef, useState, useEffect } from 'react';
import { campusTourVideo } from '@/public/images/index.js';

const VideoFrame = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true); // Muted by default for reliable autoplay
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [showUnmute, setShowUnmute] = useState(true);

  // Hybrid approach: unmute on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        setMuted(false);
        setShowUnmute(false);
        videoRef.current.play();
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    // Try to play the video on mount if muted
    if (videoRef.current && muted) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay may be blocked by browser
        });
      }
    }
  }, [muted]);

  const handleMicClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent play/pause toggle
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
    if (!videoRef.current.muted) setShowUnmute(false);
    else setShowUnmute(true);
  };

  const handleUnmuteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    setMuted(false);
    setShowUnmute(false);
    videoRef.current.play();
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
      <div className="relative w-full max-w-4xl aspect-[16/9] group cursor-pointer p-2 md:p-4">
        {/* Subtle professional border and shadow */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none z-10 border-2 border-blue-200 dark:border-blue-700 shadow-md" />
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden bg-background z-20"
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
            preload="auto"
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            className="w-full h-full min-h-[180px] md:min-h-[320px] md:min-h-[480px] bg-background object-cover select-none pointer-events-auto rounded-xl"
          />
          {/* Unmute notify button top left */}
          {showUnmute && muted && (
            <button
              onClick={handleUnmuteClick}
              className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-white/95 dark:bg-black/80 px-4 py-2 rounded-xl shadow border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 transition"
              style={{backdropFilter: 'blur(2px)'}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2563eb" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
              </svg>
              <span className="text-blue-700 dark:text-blue-200 font-medium text-base">Unmute</span>
            </button>
          )}
          {/* Centered play/pause icon overlay */}
          <div
            className={`absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300
              ${!playing || hovered ? 'opacity-100 pointer-events-none' : 'opacity-0 pointer-events-none'}`}
          >
            {playing && hovered ? (
              // Pause icon (Heroicon, professional)
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-14 h-14 bg-white/90 rounded-full shadow border border-blue-200 flex items-center justify-center">
                <rect x="9" y="8" width="4" height="16" rx="1.5" fill="#2563eb" />
                <rect x="19" y="8" width="4" height="16" rx="1.5" fill="#2563eb" />
              </svg>
            ) : (
              // Play icon (Heroicon, professional)
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-16 h-16 bg-white/90 rounded-full shadow border border-blue-200 flex items-center justify-center">
                <polygon points="12,8 24,16 12,24" fill="#2563eb" />
              </svg>
            )}
          </div>
          {/* Speaker button bottom right */}
          <button
            onClick={handleMicClick}
            className="absolute bottom-4 right-4 z-40 bg-white/90 dark:bg-black/60 rounded-full p-2 shadow border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? (
              // Speaker off icon (Heroicon, professional)
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2563eb" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
                <line x1="19" y1="5" x2="5" y2="19" stroke="#2563eb" strokeWidth="2" />
              </svg>
            ) : (
              // Speaker on icon (Heroicon, professional)
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2563eb" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoFrame; 