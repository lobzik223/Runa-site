import React, { useRef, useEffect } from 'react';
import './HeroSection.css';
import videoSrc from '../mov/intro1.mov';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // ПРИНУДИТЕЛЬНО отключаем все элементы управления
    video.controls = false;
    video.removeAttribute('controls');
    video.setAttribute('controls', 'false');
    video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
    video.setAttribute('disablePictureInPicture', 'true');
    
    // Скрываем элементы управления через стили
    video.style.setProperty('--webkit-media-controls', 'none');
    
    // Функция для скрытия элементов управления
    const hideControls = () => {
      const controls = video.querySelectorAll('*');
      controls.forEach((el: any) => {
        if (el.classList && (
          el.classList.contains('controls') ||
          el.classList.contains('media-controls') ||
          el.tagName === 'BUTTON'
        )) {
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).style.visibility = 'hidden';
          (el as HTMLElement).style.opacity = '0';
        }
      });
    };

    // Функция для запуска видео
    const playVideo = () => {
      video.play().catch(() => {
        // Игнорируем ошибки автоплея
      });
    };

    // Обработчик загрузки видео
    const handleLoadedData = () => {
      hideControls();
      playVideo();
    };

    // Обработчик взаимодействия пользователя
    const handleUserInteraction = () => {
      hideControls();
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
      hideControls();
      playVideo();
    };

    // Постоянно скрываем элементы управления
    const interval = setInterval(hideControls, 100);

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', hideControls);
    video.addEventListener('pause', handlePause);
    video.addEventListener('click', hideControls);

    return () => {
      clearInterval(interval);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', hideControls);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('click', hideControls);
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
