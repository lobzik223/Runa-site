import React, { forwardRef } from 'react';
import './HeroSection.css';
import RunaLogo from './RunaLogo';
import RunaFinanceText from './RunaFinanceText';
import { AppleIcon } from './StoreIcons';
import { APP_STORE_URL, PLAY_STORE_URL } from '../utils/storeLinks';

const HeroSection = forwardRef<HTMLElement>((_, ref) => (
  <section className="hero-bg" ref={ref as React.Ref<HTMLElement>} id="about">
    <div className="hero-bg-layer" aria-hidden="true">
      <img src="/hero-bg.png" alt="" className="hero-bg-img" draggable={false} />
    </div>

    <div className="hero-bg-content">
      <div className="hero-logo-stage">
        <div className="hero-logo-glow" aria-hidden="true" />
        <div className="hero-brand">
          <RunaLogo width={240} height={59} variant="light" className="hero-logo" />
          <RunaFinanceText width={418} height={59} className="hero-brand-finance" />
        </div>
      </div>

      <p className="hero-tagline">Ваша уверенность в деньгах</p>

      <div className="hero-actions">
        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="hero-store-btn hero-store-btn--apple">
          <AppleIcon className="hero-store-icon" />
          <span className="hero-store-text">
            <span className="hero-store-label">Загрузить в</span>
            <span className="hero-store-name">App Store</span>
          </span>
        </a>
        <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="hero-store-btn hero-store-btn--google">
          <img
            src="/google-play-icon.png"
            alt=""
            className="hero-store-icon hero-store-icon--play"
            width={26}
            height={26}
            draggable={false}
            aria-hidden="true"
          />
          <span className="hero-store-text">
            <span className="hero-store-label">Доступно в</span>
            <span className="hero-store-name">Google Play</span>
          </span>
        </a>
      </div>
    </div>

    <button type="button" className="hero-scroll" onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} aria-label="Прокрутить вниз">
      <span className="hero-scroll-ring">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="hero-scroll-text">Подробнее</span>
    </button>
  </section>
));

HeroSection.displayName = 'HeroSection';

export default HeroSection;
