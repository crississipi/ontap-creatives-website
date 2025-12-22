"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CgPlayBackwards,
  CgPlayButton,
  CgPlayForwards,
  CgPlayPause,
} from "react-icons/cg";
import {
  BsVolumeDownFill,
  BsVolumeMuteFill,
  BsVolumeUpFill,
} from "react-icons/bs";
import { HiExclamationCircle } from "react-icons/hi2";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return { ref, isInView };
}

const VideoTutorial = () => {
  const { ref: videoTutorialRef, isInView: videoTutorialVisible } = useInView();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [play, setPlay] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volumeRate, setVolumeRate] = useState(70);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [showForward, setShowForward] = useState(false);
  const [showBackward, setShowBackward] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Set initial volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volumeRate / 100;
    }
  }, [volumeRate]);

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
      setIsLoading(false);
    }
  };

  // Handle video error
  const handleVideoError = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const video = e.currentTarget;
    const error = video.error;

    // CRITICAL DEBUG INFO
    console.log("=== VIDEO ERROR DEBUG ===");
    console.log("1. Video src:", video.src);
    console.log("2. Current src:", video.currentSrc);
    console.log("3. Error code:", error?.code);
    console.log("4. Error message:", error?.message);
    console.log("5. Network state:", video.networkState);
    console.log("6. Ready state:", video.readyState);
    console.log("========================");

    setVideoError(true);
    setIsLoading(false);

    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          setErrorMessage("Video loading was aborted");
          break;
        case error.MEDIA_ERR_NETWORK:
          setErrorMessage("Network error - File might not exist");
          break;
        case error.MEDIA_ERR_DECODE:
          setErrorMessage("Video decoding error - File might be corrupted");
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          setErrorMessage(`File not found or unsupported: ${video.src}`);
          break;
        default:
          setErrorMessage("Unknown video error");
      }
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setVideoError(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (play) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((e) => {
          console.error("Play failed:", e);
          setVideoError(true);
          setErrorMessage("Failed to play video");
        });
      }
      setPlay(!play);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      if (dur) {
        setProgress((current / dur) * 100);
        setCurrentTime(formatTime(current));
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekValue = parseFloat(e.target.value);
    if (videoRef.current && videoRef.current.duration) {
      const newTime = (seekValue / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(seekValue);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolumeRate(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 5,
        videoRef.current.duration
      );
      setShowForward(true);
      setTimeout(() => setShowForward(false), 600);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        videoRef.current.currentTime - 5,
        0
      );
      setShowBackward(true);
      setTimeout(() => setShowBackward(false), 600);
    }
  };

  const getVolumeIcon = () => {
    if (volumeRate === 0) return <BsVolumeMuteFill className="w-5 h-5" />;
    if (volumeRate < 50) return <BsVolumeDownFill className="w-5 h-5" />;
    return <BsVolumeUpFill className="w-5 h-5" />;
  };

  return (
    <div
      ref={videoTutorialRef}
      className="min-h-screen w-full flex flex-col items-center justify-center gap-8 md:gap-12 px-5 py-12 md:p-20 relative"
    >
      <motion.h2
        className="w-full md:w-4/5 text-center text-3xl md:text-5xl lg:text-6xl z-20 text-white font-bold leading-tight drop-shadow-2xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{
          opacity: videoTutorialVisible ? 1 : 0,
          y: videoTutorialVisible ? 0 : -30,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Watch the Video Tutorial on How to Use{" "}
        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue to-violet">
          OnTap Business Card
        </span>
      </motion.h2>

      <motion.div
        className="w-full md:w-11/12 lg:w-4/5 xl:w-3/4 aspect-video bg-linear-to-br from-blue/20 via-violet/20 to-dark-blue/20 rounded-2xl md:rounded-3xl relative shadow-2xl overflow-hidden border border-blue/30 backdrop-blur-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: videoTutorialVisible ? 1 : 0.9,
          opacity: videoTutorialVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.2,
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          poster="/images/about-us-bg.png"
          loop
          playsInline
          preload="metadata"
          src="https://github.com/malipicocrisjuliusbsit-prog/sample-ontap-video/raw/main/ontap-card-video.mp4"
          className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleVideoError}
          onCanPlay={handleCanPlay}
          onEnded={() => setPlay(false)}
        >
          <source src="https://github.com/malipicocrisjuliusbsit-prog/sample-ontap-video/raw/main/ontap-card-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && !videoError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl md:rounded-3xl z-30"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-blue/30 border-t-blue rounded-full animate-spin" />
                <p className="text-white text-sm md:text-base">
                  Loading video...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Overlay */}
        <AnimatePresence>
          {videoError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-linear-to-br from-red-900/90 to-red-950/90 backdrop-blur-sm flex items-center justify-center rounded-2xl md:rounded-3xl z-30 p-8"
            >
              <div className="flex flex-col items-center gap-4 max-w-md text-center">
                <HiExclamationCircle className="w-20 h-20 text-red-300" />
                <h3 className="text-white text-xl md:text-2xl font-bold">
                  Video Error
                </h3>
                <p className="text-red-200 text-sm md:text-base">
                  {errorMessage ||
                    "Failed to load video. Please check the file path and format."}
                </p>
                <button
                  onClick={() => {
                    setVideoError(false);
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                  className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play/Pause Overlay */}
        <AnimatePresence>
          {(!play || showControls) && !isLoading && !videoError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center rounded-2xl md:rounded-3xl z-20"
              onClick={togglePlay}
            >
              <motion.button
                type="button"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/80 flex items-center justify-center bg-linear-to-br from-blue/30 to-violet/30 hover:from-blue/50 hover:to-violet/50 backdrop-blur-md text-white hover:scale-110 transition-all duration-300 shadow-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {play ? (
                  <CgPlayPause className="w-12 h-12 md:w-14 md:h-14" />
                ) : (
                  <CgPlayButton className="w-12 h-12 md:w-14 md:h-14 pl-1" />
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip Backward Zone & Indicator */}
        <div
          className="absolute left-0 top-0 w-1/4 h-full z-15 cursor-pointer"
          onDoubleClick={skipBackward}
        />
        <AnimatePresence>
          {showBackward && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-25 pointer-events-none"
            >
              <div className="flex items-center gap-3 bg-linear-to-r from-blue/90 to-violet/90 backdrop-blur-md px-5 py-3 rounded-full shadow-xl border border-white/30">
                <CgPlayBackwards className="w-6 h-6 md:w-8 md:h-8 text-white" />
                <span className="text-white font-semibold text-sm md:text-base">
                  -5s
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip Forward Zone & Indicator */}
        <div
          className="absolute right-0 top-0 w-1/4 h-full z-15 cursor-pointer"
          onDoubleClick={skipForward}
        />
        <AnimatePresence>
          {showForward && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-25 pointer-events-none"
            >
              <div className="flex items-center gap-3 bg-linear-to-r from-violet/90 to-blue/90 backdrop-blur-md px-5 py-3 rounded-full shadow-xl border border-white/30">
                <span className="text-white font-semibold text-sm md:text-base">
                  +5s
                </span>
                <CgPlayForwards className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Bar */}
        <AnimatePresence>
          {(showControls || !play) && !isLoading && !videoError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-linear-to-t from-black/90 via-black/70 to-transparent z-30"
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-linear-to-r [&::-webkit-slider-thumb]:from-blue [&::-webkit-slider-thumb]:to-violet [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                  style={{
                    background: `linear-gradient(to right, rgb(81, 153, 211) 0%, rgb(90, 92, 168) ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`,
                  }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between gap-4">
                {/* Left Controls */}
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="text-white hover:text-blue transition-colors duration-200"
                  >
                    {play ? (
                      <CgPlayPause className="w-7 h-7 md:w-8 md:h-8" />
                    ) : (
                      <CgPlayButton className="w-7 h-7 md:w-8 md:h-8" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={skipBackward}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    <CgPlayBackwards className="w-6 h-6 md:w-7 md:h-7" />
                  </button>

                  <button
                    type="button"
                    onClick={skipForward}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    <CgPlayForwards className="w-6 h-6 md:w-7 md:h-7" />
                  </button>

                  <div className="text-white text-xs md:text-sm font-medium ml-2">
                    {currentTime} / {duration}
                  </div>
                </div>

                {/* Right Controls */}
                <div className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {getVolumeIcon()}
                  </button>

                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full right-0 mb-3 bg-linear-to-br from-blue/90 to-violet/90 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-white/30"
                        onMouseLeave={() => setShowVolumeSlider(false)}
                      >
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volumeRate}
                          onChange={handleVolumeChange}
                          className="w-24 h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                          style={{
                            background: `linear-gradient(to right, white 0%, white ${volumeRate}%, rgba(255,255,255,0.3) ${volumeRate}%, rgba(255,255,255,0.3) 100%)`,
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VideoTutorial;
