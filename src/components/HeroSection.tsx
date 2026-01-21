import React, { useRef, useEffect } from 'react';
import './HeroSection.css';
import videoSrc from '../mov/intro1.mov';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Убеждаемся, что элементы управления скрыты
    video.controls = false;
    video.setAttribute('controls', 'false');

    // Функция для запуска видео
    const playVideo = () => {
      video.play().catch(() => {
        // Игнорируем ошибки автоплея
      });
    };

    // Обработчик загрузки видео
    const handleLoadedData = () => {
      playVideo();
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

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
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
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          onError={(e) => {
            console.error('Ошибка загрузки видео:', e);
          }}
        >
          <source src={videoSrc} type="video/quicktime" />
          <source src={videoSrc} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        <div className="hero-video-overlay"></div>
      </div>
    </section>
  );
};

export default HeroSection;
