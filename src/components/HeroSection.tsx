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
    
    // Полностью отключаем элементы управления
    video.controls = false;
    video.removeAttribute('controls');
    video.setAttribute('controls', 'false');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x-webkit-airplay', 'deny');
    
    // КРИТИЧНО: Убеждаемся, что видео всегда без звука для автозапуска
    video.muted = true;
    video.volume = 0;
    video.setAttribute('muted', 'true');
    
    // Дополнительно для мобильных устройств
    if (isMobile) {
      video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
      video.setAttribute('disablePictureInPicture', 'true');
    }
    
    // Сбрасываем флаг при смене видео
    hasCalledCallback.current = false;

    // Агрессивная функция запуска видео
    const attemptPlay = async () => {
      try {
        // Убеждаемся, что видео без звука
        video.muted = true;
        video.volume = 0;
        
        // Пытаемся запустить
        await video.play();
        
        // Если успешно запустилось, продолжаем воспроизведение при паузе
        video.addEventListener('pause', () => {
          if (document.visibilityState === 'visible' && !video.ended) {
            video.play().catch(() => {});
          }
        }, { once: false });
        
        return true;
      } catch (error) {
        // Если автоплей заблокирован, пробуем запустить при первом взаимодействии
        const playOnInteraction = async () => {
          try {
            video.muted = true;
            video.volume = 0;
            await video.play();
            // Удаляем обработчики после успешного запуска
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('touchend', playOnInteraction);
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('scroll', playOnInteraction);
          } catch (e) {
            // Игнорируем ошибки
          }
        };
        
        // Добавляем обработчики для первого взаимодействия
        document.addEventListener('touchstart', playOnInteraction, { once: true, passive: true });
        document.addEventListener('touchend', playOnInteraction, { once: true, passive: true });
        document.addEventListener('click', playOnInteraction, { once: true, passive: true });
        document.addEventListener('scroll', playOnInteraction, { once: true, passive: true });
        
        return false;
      }
    };

    // Функция для обработки готовности видео
    const handleVideoReady = () => {
      if (!hasCalledCallback.current) {
        hasCalledCallback.current = true;
        onVideoLoaded();
        // Пытаемся запустить сразу
        attemptPlay();
      }
    };

    // Множественные события для максимальной совместимости
    const handleLoadedMetadata = () => {
      handleVideoReady();
    };

    const handleLoadedData = () => {
      handleVideoReady();
    };

    const handleCanPlay = () => {
      handleVideoReady();
    };

    const handleCanPlayThrough = () => {
      handleVideoReady();
    };

    // Добавляем все обработчики событий
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    
    // Предзагрузка видео
    video.load();

    // Если видео уже имеет метаданные, запускаем сразу
    if (video.readyState >= 1) {
      handleVideoReady();
    }

    // Пытаемся запустить сразу, даже если метаданные еще не загружены
    setTimeout(() => {
      attemptPlay();
    }, 100);

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
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      clearTimeout(timeoutId);
      hasCalledCallback.current = false;
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
