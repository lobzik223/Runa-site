import React, { useRef, useEffect } from 'react';
import './HeroSection.css';
// Импорт видео файла
import videoSrc from '../mov/intro1.mp4';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Функция для запуска видео
    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        // Если автоплей заблокирован, ждем взаимодействия пользователя
        console.warn('Автоплей заблокирован браузером, требуется взаимодействие пользователя');
        
        const handleUserInteraction = async () => {
          try {
            await video.play();
          } catch (err) {
            console.error('Не удалось запустить видео:', err);
          }
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('touchstart', handleUserInteraction);
        };
        
        document.addEventListener('click', handleUserInteraction, { once: true });
        document.addEventListener('touchstart', handleUserInteraction, { once: true });
      }
    };

    // Запускаем видео после загрузки метаданных
    const handleCanPlay = () => {
      playVideo();
    };

    video.addEventListener('canplay', handleCanPlay);
    
    // Пытаемся запустить сразу
    if (video.readyState >= 3) {
      playVideo();
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
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
          disablePictureInPicture
          disableRemotePlayback
          onError={(e) => {
            console.error('Ошибка загрузки видео:', e);
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={videoSrc} type="video/quicktime" />
          Ваш браузер не поддерживает видео.
        </video>
        <div className="hero-video-overlay"></div>
      </div>
    </section>
  );
};

export default HeroSection;
