import React, { useRef, useEffect } from 'react';
import './HeroSection.css';
import videoSrc from '../mov/sss.mp4';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Функция для запуска видео
    const playVideo = () => {
      video.play().catch(() => {
        // Игнорируем ошибки автоплея
      });
    };

    // Обработчик взаимодействия пользователя
    const handleUserInteraction = () => {
      playVideo();
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    // Принудительный запуск видео
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Автоплей заблокирован, пробуем запустить после взаимодействия пользователя
        document.addEventListener('touchstart', handleUserInteraction, { once: true });
        document.addEventListener('click', handleUserInteraction, { once: true });
      });
    }

    // Убеждаемся, что видео всегда воспроизводится
    const handlePause = () => {
      playVideo();
    };
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('pause', handlePause);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

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
      </div>
    </section>
  );
};

export default HeroSection;
