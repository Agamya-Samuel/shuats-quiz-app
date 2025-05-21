'use client';

import React, { useEffect, useRef, useState } from 'react';

import { campusTourVideo } from '@/public/images/index.js';

// Add type for props
interface VideoFrameProps {
  src?: string;
  aspectClass?: string;
}

const VideoFrame = ({ src, aspectClass = "aspect-[2/3]" }: VideoFrameProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true); // Muted by default for reliable autoplay
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [showUnmute, setShowUnmute] = useState(true);

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

  const handlePlayPauseOrUnmute = () => {
    if (!videoRef.current) return;
    if (muted) {
      videoRef.current.muted = false;
      setMuted(false);
      setShowUnmute(false);
      videoRef.current.play();
      return;
    }
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
    <div className="w-full">
      <div className={`relative w-full ${aspectClass} rounded-3xl overflow-hidden bg-white shadow-lg`}>
        <div
          className="relative w-full h-full cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handlePlayPauseOrUnmute}>
          <video
            ref={videoRef}
            src={src || campusTourVideo}
            autoPlay
            muted={muted}
            loop
            playsInline
            preload="auto"
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            className="w-full h-full object-cover"
          />
          {/* Unmute button */}
          {showUnmute && muted && (
            <button
              onClick={handleUnmuteClick}
              className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-white/95 px-4 py-2 rounded-xl shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2563eb" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
              </svg>
              <span className="text-blue-700 font-medium text-base">Unmute</span>
            </button>
          )}
          {/* Play/Pause overlay */}
          <div
            className={`absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300
              ${!playing || hovered ? 'opacity-100' : 'opacity-0'}`}
          >
            {playing && hovered ? (
              <div className="bg-white/90 rounded-full p-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" className="w-8 h-8">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              </div>
            ) : (
              <div className="bg-white/90 rounded-full p-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" className="w-8 h-8">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </div>
          {/* Mute/Unmute button */}
          <button
            onClick={handleMicClick}
            className="absolute bottom-4 right-4 z-40 bg-white/90 rounded-full p-2 shadow-lg"
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2563eb" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
                <line x1="19" y1="5" x2="5" y2="19" stroke="#2563eb" strokeWidth="2" />
              </svg>
            ) : (
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
