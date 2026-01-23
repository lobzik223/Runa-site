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

    // Функция для обработки готовности видео (быстрая загрузка)
    const handleVideoReady = () => {
      if (!hasCalledCallback.current) {
        hasCalledCallback.current = true;
        onVideoLoaded();
        attemptPlay();
      }
    };

    // Быстрая загрузка - достаточно метаданных (readyState >= 1)
    const handleLoadedMetadata = () => {
      handleVideoReady();
    };

    // Если уже есть минимальные данные
    const handleLoadedData = () => {
      handleVideoReady();
    };

    // События загрузки видео (минимальные требования)
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    
    // Предзагрузка видео
    video.load();

    // Если видео уже имеет метаданные
    if (video.readyState >= 1) {
      handleVideoReady();
    }

    // Таймаут - показываем сайт максимум через 1.5 секунды
    const timeoutId = setTimeout(() => {
      if (!hasCalledCallback.current) {
        console.warn('Видео загружается медленно, показываем сайт');
        handleVideoReady();
      }
    }, 1500);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      clearTimeout(timeoutId);
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
