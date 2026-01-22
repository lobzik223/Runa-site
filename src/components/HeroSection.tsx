import React, { useRef, useEffect } from 'react';
import './HeroSection.css';
import videoSrc from '../mov/intro1.mp4';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Принудительный запуск видео для мобильных
    const attemptPlay = () => {
      video.play().catch(() => {
        // Если автоплей заблокирован, пробуем запустить при клике в любом месте
        const playOnTouch = () => {
          video.play();
          document.removeEventListener('touchstart', playOnTouch);
        };
        document.addEventListener('touchstart', playOnTouch);
      });
    };

    attemptPlay();
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
          webkit-playsinline="true"
          preload="auto"
          muted={true}
        >
          <source src={videoSrc} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        <div className="hero-video-overlay"></div>
      </div>
    </section>
  );
};

export default HeroSection;
