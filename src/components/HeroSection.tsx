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
    
    // Дополнительно для мобильных устройств - агрессивное скрытие элементов управления
    let hideControlsInterval: NodeJS.Timeout | null = null;
    const preventControlsShow = () => {
      if (video.controls) {
        video.controls = false;
      }
    };
    
    if (isMobile) {
      video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
      video.setAttribute('disablePictureInPicture', 'true');
      
      // Дополнительные атрибуты для полного скрытия элементов управления
      video.setAttribute('controls', 'false');
      video.controls = false;
      
      // Предотвращаем показ элементов управления при любых событиях
      video.addEventListener('play', preventControlsShow);
      video.addEventListener('pause', preventControlsShow);
      video.addEventListener('click', preventControlsShow);
      video.addEventListener('touchstart', preventControlsShow);
      video.addEventListener('touchend', preventControlsShow);
      
      // Периодически проверяем и скрываем элементы управления
      hideControlsInterval = setInterval(() => {
        preventControlsShow();
        // Скрываем все возможные элементы управления через DOM
        const controls = video.querySelectorAll('*');
        controls.forEach((el: Element) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl.style) {
            htmlEl.style.display = 'none';
            htmlEl.style.visibility = 'hidden';
            htmlEl.style.opacity = '0';
            htmlEl.style.pointerEvents = 'none';
          }
        });
      }, 100);
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

    // Функция для обработки полной готовности видео
    const handleVideoReady = () => {
      // Ждем полной загрузки видео (readyState >= 4 означает HAVE_ENOUGH_DATA)
      // Это гарантирует, что видео полностью загружено и готово к воспроизведению
      if (video.readyState >= 4 && !hasCalledCallback.current) {
        hasCalledCallback.current = true;
        onVideoLoaded();
        // Пытаемся запустить сразу
        attemptPlay();
      }
    };

    // Обработчик для полной загрузки видео
    const handleCanPlayThrough = () => {
      // Дополнительная проверка readyState для уверенности
      if (video.readyState >= 4) {
        handleVideoReady();
      }
    };

    // Обработчик для проверки прогресса загрузки
    const handleProgress = () => {
      // Проверяем, загружено ли достаточно данных (>= 95% или readyState >= 4)
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration > 0 && (bufferedEnd / duration >= 0.95 || video.readyState >= 4)) {
          handleVideoReady();
        }
      }
    };

    // Добавляем обработчики событий для полной загрузки
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadeddata', () => {
      // Проверяем readyState после загрузки данных
      if (video.readyState >= 4) {
        handleVideoReady();
      }
    });
    
    // Предзагрузка видео
    video.load();

    // Если видео уже полностью загружено, вызываем callback сразу
    if (video.readyState >= 4) {
      handleVideoReady();
    }

    // Пытаемся запустить сразу, даже если метаданные еще не загружены
    setTimeout(() => {
      attemptPlay();
    }, 100);

    // Таймаут безопасности - показываем сайт максимум через 5 секунд (увеличен для полной загрузки)
    const timeoutId = setTimeout(() => {
      if (!hasCalledCallback.current) {
        console.warn('Видео загружается медленно, показываем сайт после таймаута');
        hasCalledCallback.current = true;
        onVideoLoaded();
      }
    }, 5000);

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('progress', handleProgress);
      if (isMobile) {
        video.removeEventListener('play', preventControlsShow);
        video.removeEventListener('pause', preventControlsShow);
        video.removeEventListener('click', preventControlsShow);
        video.removeEventListener('touchstart', preventControlsShow);
        video.removeEventListener('touchend', preventControlsShow);
      }
      clearTimeout(timeoutId);
      if (hideControlsInterval) {
        clearInterval(hideControlsInterval);
      }
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
