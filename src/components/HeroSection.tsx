import React, { useRef, useEffect } from 'react';
import './HeroSection.css';
import videoSrc from '../mov/intro1.mp4';

interface HeroSectionProps {
  onVideoLoaded: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onVideoLoaded }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCalledCallback = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Принудительный запуск видео для мобильных
    const attemptPlay = () => {
      video.play().catch(() => {
        // Если автоплей заблокирован, пробуем запустить при клике в любом месте
        const playOnTouch = () => {
          video.play();
          document.removeEventListener('touchstart', playOnTouch);
        };
        document.addEventListener('touchstart', playOnTouch);
      });
    };

    // Функция для обработки готовности видео
    const handleVideoReady = () => {
      if (!hasCalledCallback.current && video.readyState >= 3) {
        hasCalledCallback.current = true;
        onVideoLoaded();
        attemptPlay();
      }
    };

    // Отслеживание загрузки видео
    const handleCanPlay = () => {
      handleVideoReady();
    };

    const handleLoadedData = () => {
      handleVideoReady();
    };

    // События загрузки видео
    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    const handleProgress = () => {
      // Проверяем прогресс загрузки
      if (!hasCalledCallback.current && video.readyState >= 3 && video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (bufferedEnd >= duration * 0.5) { // Загружено минимум 50%
          handleVideoReady();
        }
      }
    };

    video.addEventListener('progress', handleProgress);

    // Предзагрузка видео
    video.load();

    // Если видео уже загружено
    if (video.readyState >= 4) { // HAVE_ENOUGH_DATA
      handleVideoReady();
    }

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('progress', handleProgress);
      hasCalledCallback.current = false;
    };
  }, [onVideoLoaded]);

  return (
    <section className="hero-section">
      <div className="hero-video-container">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={videoSrc} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        <div className="hero-video-overlay"></div>
        <div className="hero-gradient-transition"></div>
      </div>
    </section>
  );
};

export default HeroSection;
