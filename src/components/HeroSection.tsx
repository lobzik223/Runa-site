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
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edg/i.test(navigator.userAgent);
    
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
      
      // Дополнительные атрибуты для Safari и Chrome
      if (isSafari || isChrome) {
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        (video as any).webkitSupportsFullscreen = false;
        (video as any).webkitDisplayingFullscreen = false;
      }
      
      // Скрываем через глобальные стили - МАКСИМАЛЬНО АГРЕССИВНО ДЛЯ SAFARI И CHROME
      let style = document.getElementById('hide-video-controls-mobile');
      if (!style) {
        style = document.createElement('style');
        style.id = 'hide-video-controls-mobile';
        style.textContent = `
          .hero-video::-webkit-media-controls { display: none !important; opacity: 0 !important; visibility: hidden !important; width: 0 !important; height: 0 !important; }
          .hero-video::-webkit-media-controls-enclosure { display: none !important; opacity: 0 !important; visibility: hidden !important; width: 0 !important; height: 0 !important; }
          .hero-video::-webkit-media-controls-panel { display: none !important; opacity: 0 !important; visibility: hidden !important; width: 0 !important; height: 0 !important; }
          .hero-video::-webkit-media-controls-play-button { display: none !important; opacity: 0 !important; visibility: hidden !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important; clip-path: inset(100%) !important; }
          .hero-video::-webkit-media-controls-start-playback-button { display: none !important; opacity: 0 !important; visibility: hidden !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important; clip-path: inset(100%) !important; }
          .hero-video::-webkit-media-controls-timeline { display: none !important; width: 0 !important; height: 0 !important; }
          .hero-video::-webkit-media-controls-current-time-display { display: none !important; }
          .hero-video::-webkit-media-controls-time-remaining-display { display: none !important; }
          .hero-video::-webkit-media-controls-mute-button { display: none !important; }
          .hero-video::-webkit-media-controls-volume-slider { display: none !important; }
          .hero-video::-webkit-media-controls-fullscreen-button { display: none !important; }
          .hero-video button { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important; }
          .hero-video [role="button"] { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; }
        `;
        document.head.appendChild(style);
      }
      
      // Скрываем через DOM - ищем и скрываем все кнопки, ОСОБЕННО ДЛЯ SAFARI И CHROME
      const hideControlsInDOM = () => {
        // Скрываем все дочерние элементы
        const allChildren = video.querySelectorAll('*');
        allChildren.forEach((el: any) => {
          const tagName = el.tagName?.toLowerCase();
          if (tagName === 'button' || 
              tagName === 'div' && (el.classList?.contains('controls') || el.classList?.contains('media-controls')) ||
              el.getAttribute('role') === 'button' ||
              el.classList?.contains('play-button') ||
              el.classList?.contains('media-controls-play-button')) {
            (el as HTMLElement).style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important; clip-path: inset(100%) !important;';
          }
        });
        
        // Специальная обработка для Safari и Chrome - скрываем через shadow DOM
        if (isSafari || isChrome) {
          try {
            // Пытаемся получить shadow root
            const shadowRoot = (video as any).webkitShadowRoot || (video as any).shadowRoot;
            if (shadowRoot) {
              const shadowButtons = shadowRoot.querySelectorAll('button, [role="button"], div[class*="play"], div[class*="control"]');
              shadowButtons.forEach((btn: any) => {
                btn.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
              });
            }
          } catch (e) {
            // Игнорируем ошибки доступа к shadow DOM
          }
          
          // Дополнительно скрываем через CSS переменные
          video.style.setProperty('--webkit-media-controls', 'none', 'important');
          video.style.setProperty('pointer-events', 'none', 'important');
        }
      };
      
      // Скрываем сразу и постоянно - БОЛЕЕ ЧАСТО ДЛЯ SAFARI И CHROME
      hideControlsInDOM();
      const hideInterval = isSafari || isChrome ? 50 : 100;
      intervalId = setInterval(hideControlsInDOM, hideInterval);
      
      // Скрываем при любых событиях
      const eventList = ['play', 'pause', 'loadeddata', 'canplay', 'click', 'touchstart', 'touchend', 'loadstart', 'playing', 'waiting', 'seeking', 'seeked'];
      eventList.forEach(event => {
        video.addEventListener(event, hideControlsInDOM, { passive: true });
        events.push(event);
      });
      
      // Также скрываем при изменении размера
      resizeObserver = new ResizeObserver(() => {
        hideControlsInDOM();
      });
      resizeObserver.observe(video);
      
      // Дополнительная проверка для Safari и Chrome - скрываем при каждом кадре
      let animationFrameId: number | null = null;
      if (isSafari || isChrome) {
        const hideOnFrame = () => {
          hideControlsInDOM();
          animationFrameId = requestAnimationFrame(hideOnFrame);
        };
        animationFrameId = requestAnimationFrame(hideOnFrame);
      }
      
      // Сохраняем для cleanup
      const savedAnimationFrameId = animationFrameId;
      const savedHideControls = hideControlsInDOM;
      
      // Добавляем в cleanup массив
      if (isMobile) {
        (events as any).__hideControls = savedHideControls;
        (events as any).__animationFrameId = savedAnimationFrameId;
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
        const hideControls = (events as any).__hideControls;
        const animFrameId = (events as any).__animationFrameId;
        if (hideControls) {
          events.forEach((event: string) => {
            video.removeEventListener(event, hideControls);
          });
        }
        if (animFrameId !== null && animFrameId !== undefined) {
          cancelAnimationFrame(animFrameId);
        }
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
