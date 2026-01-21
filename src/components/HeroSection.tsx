import React from 'react';
import './HeroSection.css';

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
          <source src="/src/mov/sss.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        <div className="hero-video-overlay"></div>
      </div>
    </section>
  );
};

export default HeroSection;
