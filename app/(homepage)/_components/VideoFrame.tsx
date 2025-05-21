'use client';

import React, { useEffect, useRef, useState } from 'react';

import { campusTourVideos } from '@/public/images/index.js';

// Add type for props
interface VideoFrameProps {
  aspectClass?: string;
}

const getAspectClass = (src: string) => {
  // webm, ct-1, and ct-2 are portrait, others are landscape
  if (src.includes('webm') || src.includes('ct-1') || src.includes('ct-2')) {
    return 'aspect-[2/3]';
  }
  return 'aspect-[16/9]';
};

const VideoFrame = ({ aspectClass }: VideoFrameProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [showUnmute, setShowUnmute] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Updated video order
  const videos = [
    'https://cdn-shuatsquiz.agamya.dev/video/webm/shuats-reel.webm',
    'https://cdn-shuatsquiz.agamya.dev/video/shuats_tour_2.mp4',
    'https://cdn-shuatsquiz.agamya.dev/video/reel/ct-1.mp4',
    'https://cdn-shuatsquiz.agamya.dev/video/reel/ct-2.mp4',
    'https://cdn-shuatsquiz.agamya.dev/video/reel/ct-3.mp4',
  ];
  const src = videos[currentVideoIndex];
  const dynamicAspectClass = aspectClass || getAspectClass(src);

  useEffect(() => {
    if (videoRef.current && muted) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [muted, currentVideoIndex]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleVideoEnded = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
  };

  const handleFrameClick = async () => {
    if (!isFullscreen && containerRef.current) {
      await containerRef.current.requestFullscreen();
    }
  };

  const handleContainerClick = async (e: React.MouseEvent) => {
    if (!isFullscreen && containerRef.current) {
      await containerRef.current.requestFullscreen();
    } else {
      handlePlayPauseOrUnmute();
    }
  };

  const handleContainerDoubleClick = async (e: React.MouseEvent) => {
    if (!isFullscreen && containerRef.current) {
      await containerRef.current.requestFullscreen();
    }
  };

  const handleMicClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
    setShowUnmute(videoRef.current.muted);
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

  const handleVideoPlay = () => setPlaying(true);
  const handleVideoPause = () => setPlaying(false);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className={`relative w-full ${dynamicAspectClass} rounded-3xl overflow-hidden bg-white shadow-lg`}
        onClick={handleContainerClick}
        style={{ cursor: isFullscreen ? 'default' : 'pointer' }}>
        <div
          className="relative w-full h-full"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted={muted}
            loop={false}
            playsInline
            preload="auto"
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          />
          {/* Unmute button */}
          {showUnmute && muted && (
            <button
              onClick={handleUnmuteClick}
              className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-white/95 px-4 py-2 rounded-xl shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#2563eb"
                className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9v6h4l5 5V4l-5 5H9z"
                />
              </svg>
              <span className="text-blue-700 font-medium text-base">
                Unmute
              </span>
            </button>
          )}
          {/* Play/Pause overlay */}
          <div
            className={`absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300
              ${!playing || hovered ? 'opacity-100' : 'opacity-0'}`}>
            {playing && hovered ? (
              <div className="bg-white/90 rounded-full p-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#2563eb"
                  className="w-8 h-8">
                  <rect
                    x="6"
                    y="4"
                    width="4"
                    height="16"
                    rx="1"
                  />
                  <rect
                    x="14"
                    y="4"
                    width="4"
                    height="16"
                    rx="1"
                  />
                </svg>
              </div>
            ) : (
              <div className="bg-white/90 rounded-full p-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#2563eb"
                  className="w-8 h-8">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </div>
          {/* Mute/Unmute button */}
          <button
            onClick={handleMicClick}
            className="absolute bottom-4 right-4 z-40 bg-white/90 rounded-full p-2 shadow-lg"
            aria-label={muted ? 'Unmute video' : 'Mute video'}>
            {muted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#2563eb"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9v6h4l5 5V4l-5 5H9z"
                />
                <line
                  x1="19"
                  y1="5"
                  x2="5"
                  y2="19"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#2563eb"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9v6h4l5 5V4l-5 5H9z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoFrame;
