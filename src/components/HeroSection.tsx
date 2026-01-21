import React from 'react';
import './HeroSection.css';
import videoSrc from '../mov/sss.mp4';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-video-container">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
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
