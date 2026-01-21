import React, { useRef, useEffect } from 'react';
import './HeroSection.css';
// Импорт видео файла
import videoSrc from '../mov/intro1.mp4';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // ПРИНУДИТЕЛЬНОЕ отключение контролов для мобильных устройств
    const isMobile = /iPhone|iPad|iPod|Android|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let intervalId: NodeJS.Timeout | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const events: string[] = [];
    
    if (isMobile) {
      // Полностью отключаем контролы
      video.controls = false;
      video.removeAttribute('controls');
      video.setAttribute('controls', 'false');
      video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
      video.setAttribute('disablePictureInPicture', 'true');
      video.setAttribute('x-webkit-airplay', 'deny');
      
      // Скрываем через глобальные стили
      let style = document.getElementById('hide-video-controls-mobile');
      if (!style) {
        style = document.createElement('style');
        style.id = 'hide-video-controls-mobile';
        style.textContent = `
          .hero-video::-webkit-media-controls { display: none !important; opacity: 0 !important; visibility: hidden !important; }
          .hero-video::-webkit-media-controls-enclosure { display: none !important; opacity: 0 !important; visibility: hidden !important; }
          .hero-video::-webkit-media-controls-panel { display: none !important; opacity: 0 !important; visibility: hidden !important; }
          .hero-video::-webkit-media-controls-play-button { display: none !important; opacity: 0 !important; visibility: hidden !important; width: 0 !important; height: 0 !important; }
          .hero-video::-webkit-media-controls-start-playback-button { display: none !important; opacity: 0 !important; visibility: hidden !important; width: 0 !important; height: 0 !important; }
          .hero-video::-webkit-media-controls-timeline { display: none !important; }
          .hero-video::-webkit-media-controls-current-time-display { display: none !important; }
          .hero-video::-webkit-media-controls-time-remaining-display { display: none !important; }
          .hero-video::-webkit-media-controls-mute-button { display: none !important; }
          .hero-video::-webkit-media-controls-volume-slider { display: none !important; }
          .hero-video::-webkit-media-controls-fullscreen-button { display: none !important; }
          .hero-video button { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }
        `;
        document.head.appendChild(style);
      }
      
      // Скрываем через DOM - ищем и скрываем все кнопки
      const hideControlsInDOM = () => {
        const allChildren = video.querySelectorAll('*');
        allChildren.forEach((el: any) => {
          const tagName = el.tagName?.toLowerCase();
          if (tagName === 'button' || 
              tagName === 'div' && (el.classList?.contains('controls') || el.classList?.contains('media-controls')) ||
              el.getAttribute('role') === 'button') {
            (el as HTMLElement).style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
          }
        });
      };
      
      // Скрываем сразу и постоянно
      hideControlsInDOM();
      intervalId = setInterval(hideControlsInDOM, 100);
      
      // Скрываем при любых событиях
      const eventList = ['play', 'pause', 'loadeddata', 'canplay', 'click', 'touchstart', 'touchend', 'loadstart'];
      eventList.forEach(event => {
        video.addEventListener(event, hideControlsInDOM, { passive: true });
        events.push(event);
      });
      
      // Также скрываем при изменении размера
      resizeObserver = new ResizeObserver(() => {
        hideControlsInDOM();
      });
      resizeObserver.observe(video);
    }

    // Функция для запуска видео
    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        // Если автоплей заблокирован, ждем взаимодействия пользователя
        const handleUserInteraction = async () => {
          try {
            await video.play();
          } catch (err) {
            // Игнорируем ошибки
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
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (isMobile) {
        events.forEach(event => {
          video.removeEventListener(event, () => {});
        });
      }
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
          controlsList="nodownload nofullscreen noremoteplayback"
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
