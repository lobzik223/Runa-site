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
    
    // Определяем iOS один раз для всего useEffect
    const isIOS = typeof window !== 'undefined' && 
      (/iPhone|iPod|iPad/.test(navigator.userAgent) || 
       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    
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
      // Дополнительно для iPhone - принудительно убираем controls
      video.removeAttribute('controls');
      video.setAttribute('controls', 'false');
    };
    
    // Определяем iPhone для дополнительных правил (используем isIOS)
    const isIPhone = isIOS;
    
    if (isMobile) {
      video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
      video.setAttribute('disablePictureInPicture', 'true');
      
      // КРИТИЧНО для iOS: полностью убираем атрибут controls (не просто false)
      video.removeAttribute('controls');
      video.controls = false;
      // Дополнительно для iOS Safari
      if (isIPhone) {
        // Принудительно удаляем controls через несколько способов
        Object.defineProperty(video, 'controls', {
          get: () => false,
          set: () => {},
          configurable: true
        });
      }
      
      // Агрессивное скрытие элементов управления через CSS классы
      video.classList.add('no-controls');
      video.setAttribute('data-no-controls', 'true');
      video.setAttribute('x5-video-player-type', 'h5');
      video.setAttribute('x5-video-player-fullscreen', 'false');
      video.setAttribute('x5-video-orientation', 'portraint');
      
      // Функция для агрессивного скрытия всех элементов управления
      const hideAllControls = () => {
        preventControlsShow();
        
        // Скрываем через DOM - ищем все возможные элементы управления
        const selectors = [
          '*[class*="media-controls"]',
          '*[class*="play-button"]',
          '*[class*="webkit-media"]',
          '*[id*="media-controls"]',
          '*[id*="play-button"]',
          'video::-webkit-media-controls',
          'video::-webkit-media-controls-enclosure',
          'video::-webkit-media-controls-panel'
        ];
        
        selectors.forEach(selector => {
          try {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              if (htmlEl && htmlEl.style) {
                htmlEl.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important; clip: rect(0,0,0,0) !important; clip-path: inset(100%) !important; transform: scale(0) !important;';
              }
            });
          } catch (e) {
            // Игнорируем ошибки селекторов
          }
        });
        
        // Скрываем все дочерние элементы видео
        const allChildren = video.querySelectorAll('*');
        allChildren.forEach((el: Element) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl && htmlEl.style) {
            htmlEl.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
          }
        });
        
        // Динамически добавляем максимально агрессивные стили для iOS
        if (!document.head.querySelector('style[data-video-controls-hide-ios]')) {
          const style = document.createElement('style');
          style.setAttribute('data-video-controls-hide-ios', 'true');
          style.textContent = `
            video.hero-video::-webkit-media-controls,
            video.hero-video::-webkit-media-controls-enclosure,
            video.hero-video::-webkit-media-controls-panel,
            video.hero-video::-webkit-media-controls-play-button,
            video.hero-video::-webkit-media-controls-start-playback-button,
            video.hero-video::-webkit-media-controls-overlay-play-button,
            video.hero-video::-webkit-media-controls-timeline,
            video.hero-video::-webkit-media-controls-current-time-display,
            video.hero-video::-webkit-media-controls-time-remaining-display,
            video.hero-video::-webkit-media-controls-mute-button,
            video.hero-video::-webkit-media-controls-volume-slider,
            video.hero-video::-webkit-media-controls-fullscreen-button {
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
              transform: scale(0) !important;
              -webkit-appearance: none !important;
              appearance: none !important;
            }
            video.hero-video[controls],
            video.hero-video[controls="true"],
            video.hero-video[controls="false"] {
              pointer-events: none !important;
            }
            video.hero-video * {
              pointer-events: none !important;
            }
          `;
          document.head.appendChild(style);
        }
      };
      
      // MutationObserver для отслеживания появления элементов управления (критично для iOS)
      let mutationObserver: MutationObserver | null = null;
      if (isIPhone && typeof MutationObserver !== 'undefined') {
        mutationObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                  const htmlNode = node as HTMLElement;
                  const className = htmlNode.className || '';
                  const id = htmlNode.id || '';
                  if (className.includes('media-controls') || 
                      className.includes('play-button') || 
                      className.includes('webkit-media') ||
                      id.includes('media-controls') ||
                      id.includes('play-button')) {
                    htmlNode.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
                  }
                  // Проверяем дочерние элементы
                  const children = htmlNode.querySelectorAll('*');
                  children.forEach((child: Element) => {
                    const htmlChild = child as HTMLElement;
                    if (htmlChild && htmlChild.style) {
                      const childClass = htmlChild.className || '';
                      const childId = htmlChild.id || '';
                      if (childClass.includes('media-controls') || 
                          childClass.includes('play-button') || 
                          childId.includes('media-controls')) {
                        htmlChild.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
                      }
                    }
                  });
                }
              });
            }
          });
          hideAllControls();
        });
        
        // Наблюдаем за изменениями в видео и документе
        mutationObserver.observe(video, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['controls', 'class']
        });
        
        mutationObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
      
      // Предотвращаем показ элементов управления при любых событиях
      const handleControlHide = () => {
        preventControlsShow();
        hideAllControls();
      };
      
      const events = ['play', 'pause', 'click', 'touchstart', 'touchend', 'loadstart', 'loadedmetadata', 'canplay', 'playing', 'waiting', 'seeking', 'seeked', 'timeupdate', 'progress', 'loadeddata'];
      events.forEach(event => {
        video.addEventListener(event, handleControlHide, { passive: true });
      });
      
      // Сохраняем ссылку на обработчик для очистки
      (video as any)._controlHideHandler = handleControlHide;
      (video as any)._mutationObserver = mutationObserver;
      
      // Используем requestAnimationFrame для максимально частого обновления на iOS
      let rafId: number | null = null;
      const hideControlsRAF = () => {
        preventControlsShow();
        hideAllControls();
        if (isIPhone) {
          rafId = requestAnimationFrame(hideControlsRAF);
        }
      };
      
      if (isIPhone) {
        rafId = requestAnimationFrame(hideControlsRAF);
        (video as any)._rafId = rafId;
      } else {
        // Для других мобильных - обычный интервал
        hideControlsInterval = setInterval(() => {
          preventControlsShow();
          hideAllControls();
        }, 50);
      }
      
      // Немедленное скрытие при загрузке
      hideAllControls();
      
      // Дополнительная проверка через небольшую задержку для iOS
      if (isIPhone) {
        setTimeout(() => {
          hideAllControls();
        }, 100);
        setTimeout(() => {
          hideAllControls();
        }, 500);
        setTimeout(() => {
          hideAllControls();
        }, 1000);
      }
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
      // Для iOS используем максимально мягкие условия - практически сразу готовы
      if (isIOS) {
        // На iOS достаточно иметь readyState >= 1 (HAVE_METADATA) или даже просто наличие элемента
        // Не требуем duration или буферизацию вообще
        if (video.readyState >= 1) {
          return true;
        }
        // Даже если readyState = 0, считаем готовым на iOS через небольшую задержку
        return true;
      }
      
      // Для других устройств - более строгие требования
      if (video.readyState < 4) {
        return false;
      }
      
      // Проверяем, что видео имеет метаданные
      if (!video.duration || isNaN(video.duration) || video.duration === 0 || !isFinite(video.duration)) {
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
    
    // Для iOS также обрабатываем событие canplay (менее строгое, чем canplaythrough)
    const handleCanPlay = () => {
      if (isIOS && !hasCalledCallback.current) {
        // На iOS считаем видео готовым сразу при canplay
        setTimeout(() => {
          if (!hasCalledCallback.current) {
            hasCalledCallback.current = true;
            onVideoLoaded();
            attemptPlay();
          }
        }, 100);
      }
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
      // Для iOS - сразу скрываем LoadingView после загрузки метаданных
      if (isIOS && !hasCalledCallback.current) {
        setTimeout(() => {
          if (!hasCalledCallback.current) {
            hasCalledCallback.current = true;
            onVideoLoaded();
            attemptPlay();
          }
        }, 200);
      }
      // Для других устройств - readyState >= 4
      if (!isIOS && video.readyState >= 4) {
        handleVideoReady();
      }
    };

    // Добавляем обработчики событий для полной загрузки
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('canplay', handleCanPlay); // Для iOS
    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // Предзагрузка видео
    video.load();
    
    // Для iOS - немедленно скрываем LoadingView через небольшую задержку
    if (isIOS) {
      setTimeout(() => {
        if (!hasCalledCallback.current) {
          hasCalledCallback.current = true;
          onVideoLoaded();
          attemptPlay();
        }
      }, 300);
    }

    // Периодическая проверка готовности (на случай, если события не сработали)
    // Для iOS проверяем очень часто и максимально агрессивно
    const checkInterval = isIOS ? 50 : 200;
    const readyCheckInterval = setInterval(() => {
      if (!hasCalledCallback.current) {
        if (checkVideoReady()) {
          handleVideoReady();
          clearInterval(readyCheckInterval);
        } else if (isIOS) {
          // Для iOS - если прошло больше 500ms, скрываем LoadingView в любом случае
          const elapsed = Date.now() - (window.performance?.timing?.navigationStart || Date.now());
          if (elapsed > 500 || video.readyState >= 1) {
            hasCalledCallback.current = true;
            onVideoLoaded();
            attemptPlay();
            clearInterval(readyCheckInterval);
          }
        }
      }
    }, checkInterval);

    // Если видео уже полностью загружено, вызываем callback сразу
    if (checkVideoReady()) {
      handleVideoReady();
    }

    // Пытаемся запустить сразу, даже если метаданные еще не загружены
    setTimeout(() => {
      attemptPlay();
    }, 100);

    // Таймаут безопасности - для iOS очень короткий (1 секунда!), для других устройств - 10 секунд
    const safetyTimeout = isIOS ? 1000 : 10000;
    const timeoutId = setTimeout(() => {
      if (!hasCalledCallback.current) {
        console.warn('Видео загружается медленно, показываем сайт после таймаута безопасности');
        hasCalledCallback.current = true;
        onVideoLoaded();
        clearInterval(readyCheckInterval);
        // Пытаемся запустить видео даже после таймаута
        attemptPlay();
      }
    }, safetyTimeout);
    
    // Для iOS добавляем дополнительный очень ранний таймаут (500ms)
    let earlyTimeoutId: NodeJS.Timeout | null = null;
    if (isIOS) {
      earlyTimeoutId = setTimeout(() => {
        if (!hasCalledCallback.current) {
          console.log('iOS: Очень раннее скрытие загрузки');
          hasCalledCallback.current = true;
          onVideoLoaded();
          attemptPlay();
        }
      }, 500);
    }

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (isMobile) {
        // Удаляем все обработчики событий
        const handleControlHide = (video as any)._controlHideHandler;
        if (handleControlHide) {
          const events = ['play', 'pause', 'click', 'touchstart', 'touchend', 'loadstart', 'loadedmetadata', 'canplay', 'playing', 'waiting', 'seeking', 'seeked', 'timeupdate', 'progress', 'loadeddata'];
          events.forEach(event => {
            video.removeEventListener(event, handleControlHide);
          });
        }
        delete (video as any)._controlHideHandler;
        
        // Останавливаем requestAnimationFrame
        const rafId = (video as any)._rafId;
        if (rafId !== null && rafId !== undefined) {
          cancelAnimationFrame(rafId);
        }
        delete (video as any)._rafId;
        
        // Отключаем MutationObserver
        const mutationObserver = (video as any)._mutationObserver;
        if (mutationObserver) {
          mutationObserver.disconnect();
        }
        delete (video as any)._mutationObserver;
      }
      clearTimeout(timeoutId);
      if (earlyTimeoutId) {
        clearTimeout(earlyTimeoutId);
      }
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
