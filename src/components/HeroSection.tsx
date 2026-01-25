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

    // Функция для проверки полной готовности видео
    const checkVideoReady = (): boolean => {
      // Проверяем readyState (>= 4 означает HAVE_ENOUGH_DATA)
      if (video.readyState < 4) {
        return false;
      }
      
      // Проверяем, что видео имеет метаданные
      if (!video.duration || video.duration === 0) {
        return false;
      }
      
      // Проверяем буферизацию - должно быть загружено минимум 95%
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        if (bufferedPercent < 95) {
          return false;
        }
      } else {
        // Если нет буфера, ждем еще
        return false;
      }
      
      return true;
    };

    // Функция для обработки полной готовности видео
    const handleVideoReady = () => {
      // Проверяем все условия готовности
      if (checkVideoReady() && !hasCalledCallback.current) {
        hasCalledCallback.current = true;
        // Небольшая задержка для гарантии полной готовности
        setTimeout(() => {
          onVideoLoaded();
          // Пытаемся запустить сразу
          attemptPlay();
        }, 100);
      }
    };

    // Обработчик для полной загрузки видео
    const handleCanPlayThrough = () => {
      handleVideoReady();
    };

    // Обработчик для проверки прогресса загрузки
    const handleProgress = () => {
      handleVideoReady();
    };
    
    // Обработчик для проверки загруженных данных
    const handleLoadedData = () => {
      handleVideoReady();
    };
    
    // Обработчик для проверки метаданных
    const handleLoadedMetadata = () => {
      // После загрузки метаданных начинаем проверять готовность
      if (video.readyState >= 4) {
        handleVideoReady();
      }
    };

    // Добавляем обработчики событий для полной загрузки
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // Предзагрузка видео
    video.load();

    // Периодическая проверка готовности (на случай, если события не сработали)
    const readyCheckInterval = setInterval(() => {
      if (!hasCalledCallback.current && checkVideoReady()) {
        handleVideoReady();
        clearInterval(readyCheckInterval);
      }
    }, 200);

    // Если видео уже полностью загружено, вызываем callback сразу
    if (checkVideoReady()) {
      handleVideoReady();
    }

    // Пытаемся запустить сразу, даже если метаданные еще не загружены
    setTimeout(() => {
      attemptPlay();
    }, 100);

    // Таймаут безопасности - показываем сайт максимум через 10 секунд (увеличен для полной загрузки)
    const timeoutId = setTimeout(() => {
      if (!hasCalledCallback.current) {
        console.warn('Видео загружается медленно, показываем сайт после таймаута безопасности');
        hasCalledCallback.current = true;
        onVideoLoaded();
        clearInterval(readyCheckInterval);
      }
    }, 10000);

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (isMobile) {
        video.removeEventListener('play', preventControlsShow);
        video.removeEventListener('pause', preventControlsShow);
        video.removeEventListener('click', preventControlsShow);
        video.removeEventListener('touchstart', preventControlsShow);
        video.removeEventListener('touchend', preventControlsShow);
      }
      clearTimeout(timeoutId);
      clearInterval(readyCheckInterval);
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

  // Контроль поведения видео при скролле на мобильных устройствах
  useEffect(() => {
    if (!isMobile) return;

    const videoContainer = videoRef.current?.parentElement;
    const video = videoRef.current;
    if (!videoContainer || !video) return;

    // Получаем начальную позицию при монтировании
    const initialTop = videoContainer.getBoundingClientRect().top;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      const currentTop = videoContainer.getBoundingClientRect().top;

      // Всегда предотвращаем увеличение видео
      video.style.transform = 'translateZ(0) scale(1)';
      video.style.scale = '1';
      videoContainer.style.transform = 'none';
      videoContainer.style.scale = '1';

      // При скролле вниз - фиксируем видео на месте, не позволяем увеличиваться
      if (scrollDelta > 0) {
        // Видео не должно увеличиваться или двигаться вниз ниже исходной позиции
        if (currentTop < initialTop) {
          videoContainer.style.top = '0';
          videoContainer.style.position = 'sticky';
        }
      }
      // При скролле вверх - позволяем видео подниматься естественно (sticky работает)
      // но не опускаться ниже исходной позиции и не увеличиваться
      else if (scrollDelta < 0) {
        // Видео может подниматься вверх (sticky позволяет это), но не ниже начальной позиции
        if (currentTop > initialTop) {
          videoContainer.style.top = '0';
        }
      }

      lastScrollY = currentScrollY;
    };

    // Используем passive для лучшей производительности
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

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
