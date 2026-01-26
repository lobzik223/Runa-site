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

    const attemptPlay = () => {
      try {
        video.play().catch(() => {
          // ignore - autoplay может быть заблокирован
        });
      } catch {
        // ignore
      }
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
    };

    const onCanPlay = () => {
      // Пробуем запустить видео - это скроет кнопку Play на iOS
      attemptPlay();
    };

    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('canplay', onCanPlay);

    // Пробуем стартануть сразу после монтирования
    attemptPlay();
    
    // Несколько попыток с интервалами для гарантии запуска и скрытия кнопки Play
    const timeout1 = setTimeout(attemptPlay, 50);
    const timeout2 = setTimeout(attemptPlay, 150);
    const timeout3 = setTimeout(attemptPlay, 300);
    const timeout4 = setTimeout(attemptPlay, 500);

    // Если autoplay заблокирован — попытка на первом жесте пользователя
    const onFirstGesture = () => attemptPlay();
    window.addEventListener('touchstart', onFirstGesture, { passive: true, once: true });
    window.addEventListener('scroll', onFirstGesture, { passive: true, once: true });
    window.addEventListener('click', onFirstGesture, { passive: true, once: true });

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('canplay', onCanPlay);
      window.removeEventListener('touchstart', onFirstGesture as EventListener);
      window.removeEventListener('scroll', onFirstGesture as EventListener);
      window.removeEventListener('click', onFirstGesture as EventListener);
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
