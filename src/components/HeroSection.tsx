import React, { useRef, useEffect, forwardRef, useState } from 'react';
import './HeroSection.css';
import videoSrcPC from '../mov/intro1.mp4';
import videoSrcMobile from '../mov/mob.mp4';

interface HeroSectionProps {
  onVideoLoaded: () => void;
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(({ onVideoLoaded }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCalledCallback = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Определяем мобильную версию
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Сбрасываем флаг при смене размера экрана
      hasCalledCallback.current = false;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Сбрасываем флаг при смене источника (mobile/desktop)
    hasCalledCallback.current = false;

    // Базовые настройки видео (без "магии")
    video.muted = true;
    video.setAttribute('muted', '');
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.autoplay = true;
    video.loop = true;
    video.controls = false;
    video.removeAttribute('controls');
    
    // Добавляем класс для CSS скрытия кнопки
    video.classList.add('no-controls');
    video.setAttribute('data-no-controls', 'true');

    // Функция для принудительного скрытия кнопки Play через CSS
    const hidePlayButton = () => {
      if (!video) return;
      // Принудительно скрываем все элементы управления
      const style = document.createElement('style');
      style.id = 'hide-video-controls';
      style.textContent = `
        .hero-video::-webkit-media-controls,
        .hero-video::-webkit-media-controls-enclosure,
        .hero-video::-webkit-media-controls-panel,
        .hero-video::-webkit-media-controls-play-button,
        .hero-video::-webkit-media-controls-start-playback-button,
        .hero-video::-webkit-media-controls-overlay-play-button,
        .hero-video::-webkit-media-controls-overlay-enclosure {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
          clip: rect(0, 0, 0, 0) !important;
          clip-path: inset(100%) !important;
        }
      `;
      if (!document.getElementById('hide-video-controls')) {
        document.head.appendChild(style);
      }
    };

    const attemptPlay = () => {
      try {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise
            .then(() => {
              // Видео запустилось - скрываем кнопку
              hidePlayButton();
            })
            .catch(() => {
              // ignore - autoplay может быть заблокирован
            });
        }
      } catch {
        // ignore
      }
      // Всегда пытаемся скрыть кнопку
      hidePlayButton();
    };

    const markLoadedOnce = () => {
      if (!hasCalledCallback.current) {
        hasCalledCallback.current = true;
        onVideoLoaded();
      }
    };

    const onLoadedData = () => {
      markLoadedOnce();
      attemptPlay();
      hidePlayButton();
    };

    const onCanPlay = () => {
      // Пробуем запустить видео - это скроет кнопку Play на iOS
      attemptPlay();
      hidePlayButton();
    };

    const onPlaying = () => {
      // Видео играет - точно скрываем кнопку
      hidePlayButton();
    };

    const onPlay = () => {
      // Видео начало играть - скрываем кнопку
      hidePlayButton();
    };

    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('play', onPlay);

    // Сразу скрываем кнопку
    hidePlayButton();

    // Пробуем стартануть сразу после монтирования
    attemptPlay();
    
    // Много попыток с интервалами для гарантии запуска и скрытия кнопки Play
    const timeouts = [
      setTimeout(attemptPlay, 10),
      setTimeout(attemptPlay, 30),
      setTimeout(attemptPlay, 50),
      setTimeout(attemptPlay, 100),
      setTimeout(attemptPlay, 150),
      setTimeout(attemptPlay, 200),
      setTimeout(attemptPlay, 300),
      setTimeout(attemptPlay, 500),
      setTimeout(attemptPlay, 800),
      setTimeout(attemptPlay, 1000),
    ];

    // MutationObserver для отслеживания появления кнопки Play
    const observer = new MutationObserver(() => {
      hidePlayButton();
      attemptPlay();
    });

    observer.observe(video, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['controls', 'class'],
    });

    // Если autoplay заблокирован — попытка на первом жесте пользователя
    const onFirstGesture = () => {
      attemptPlay();
      hidePlayButton();
    };
    window.addEventListener('touchstart', onFirstGesture, { passive: true, once: true });
    window.addEventListener('scroll', onFirstGesture, { passive: true, once: true });
    window.addEventListener('click', onFirstGesture, { passive: true, once: true });

    // Периодическая проверка и скрытие кнопки
    const intervalId = setInterval(() => {
      hidePlayButton();
      if (video.paused) {
        attemptPlay();
      }
    }, 100);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(intervalId);
      observer.disconnect();
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('play', onPlay);
      window.removeEventListener('touchstart', onFirstGesture as EventListener);
      window.removeEventListener('scroll', onFirstGesture as EventListener);
      window.removeEventListener('click', onFirstGesture as EventListener);
      const styleEl = document.getElementById('hide-video-controls');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, [onVideoLoaded, isMobile]);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };


  return (
    <section className="hero-section" ref={ref as React.Ref<HTMLElement>}>
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
          key={isMobile ? 'mobile' : 'desktop'}
        >
          <source src={isMobile ? videoSrcMobile : videoSrcPC} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        <div className="hero-video-overlay"></div>
        <div className="hero-gradient-transition"></div>
      </div>
      {isMobile && (
        <div 
          className="scroll-hint" 
          onClick={handleScrollDown}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleScrollDown();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Прокрутить вниз"
        >
          <div className="scroll-hint-text">Прокрутите вниз</div>
          <div className="scroll-hint-icons">
            <svg 
              className="scroll-icon" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                d="M7 10L12 15L17 10" 
                stroke="rgba(255, 255, 255, 0.9)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
