import { useEffect, useRef } from 'react';
import './DownloadCtaSection.css';
import './FeaturesSection.css';
import { AppleIcon } from './StoreIcons';

const APP_STORE_URL = 'https://apps.apple.com/ru/app/runa-finance/id6758866400';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.runafinance.app';

export default function DownloadCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.classList.add('is-visible');
      },
      { threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="runa-section download-cta" id="download" ref={sectionRef}>
      <div className="download-cta-card">
        <p className="runa-eyebrow">Скачать</p>
        <h2 className="runa-section-title">Начните управлять деньгами сегодня</h2>
        <p className="runa-section-desc">
          RUNA Finance — учёт, аналитика, инвестиции и AI в одном приложении.
        </p>
        <div className="download-cta-stores">
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="download-store-btn">
            <AppleIcon className="download-store-icon" />
            <span>
              <span className="download-store-label">Загрузить в</span>
              <span className="download-store-name">App Store</span>
            </span>
          </a>
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="download-store-btn">
            <img src="/google-play-icon.png" alt="" className="download-store-icon" width={24} height={24} draggable={false} />
            <span>
              <span className="download-store-label">Доступно в</span>
              <span className="download-store-name">Google Play</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
