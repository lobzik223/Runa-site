import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import logoImage from './images/runalogo.png';

const APP_STORE_URL =
  'https://apps.apple.com/ru/app/runa-finance/id6758866400';
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.runafinance.app';

interface HeaderProps {
  showOnMobile?: boolean;
}

const AppleStoreIcon = () => (
  <svg
    className="store-badge-icon store-badge-icon--apple"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
    />
  </svg>
);

const GooglePlayIcon = () => (
  <svg
    className="store-badge-icon store-badge-icon--google"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ showOnMobile = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const downloadWrapRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const t = event.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (menuButtonRef.current?.contains(t)) return;
      closeMenu();
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        downloadWrapRef.current &&
        !downloadWrapRef.current.contains(event.target as Node)
      ) {
        setIsDownloadOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDownloadOpen(false);
      }
    };
    if (isDownloadOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDownloadOpen]);

  return (
    <header className={`header ${!showOnMobile ? 'header-hidden-mobile' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <img src={logoImage} alt="RUNA Finance" className="logo-image" />
        </div>
        
        <nav className="header-nav">
          <a href="/" className="nav-link">Главная</a>
          <a href="/#about-runa" className="nav-link">Что такое RUNA</a>
          <a href="/#problems" className="nav-link">Проблемы и потери</a>
          <a href="/#why-runa" className="nav-link">Почему RUNA</a>
          <a href="/premium" className="nav-link">Подписка</a>
        </nav>
        
        <div className="header-download-wrap" ref={downloadWrapRef}>
          <button
            type="button"
            className="header-download-btn"
            aria-expanded={isDownloadOpen}
            aria-haspopup="true"
            aria-controls="header-download-panel"
            onClick={() => setIsDownloadOpen((v) => !v)}
          >
            Скачать
          </button>
          {isDownloadOpen && (
            <div
              id="header-download-panel"
              className="header-download-dropdown"
              role="region"
              aria-label="Ссылки на магазины приложений"
            >
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="store-badge-link store-badge-link--apple"
                onClick={() => setIsDownloadOpen(false)}
              >
                <AppleStoreIcon />
                <span className="store-badge-text">
                  <span className="store-badge-kicker">Загрузите в</span>
                  <span className="store-badge-title">App Store</span>
                </span>
              </a>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="store-badge-link store-badge-link--google"
                onClick={() => setIsDownloadOpen(false)}
              >
                <GooglePlayIcon />
                <span className="store-badge-text">
                  <span className="store-badge-kicker">Доступно в</span>
                  <span className="store-badge-title">Google Play</span>
                </span>
              </a>
            </div>
          )}
        </div>

        {/* Гамбургер-меню для мобильной версии (на экране — только эта кнопка, без полосы шапки) */}
        <button 
          ref={menuButtonRef}
          type="button"
          className="header-menu-btn"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          <span className={`menu-line ${isMenuOpen ? 'menu-line-open' : ''}`}></span>
          <span className={`menu-line ${isMenuOpen ? 'menu-line-open' : ''}`}></span>
          <span className={`menu-line ${isMenuOpen ? 'menu-line-open' : ''}`}></span>
        </button>
        
        {/* Оверлей для закрытия меню */}
        {isMenuOpen && (
          <div 
            className="mobile-menu-overlay"
            onClick={closeMenu}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                closeMenu();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Закрыть меню"
          />
        )}
        
        {/* Выпадающее меню */}
        <nav 
          ref={menuRef}
          className={`mobile-menu ${isMenuOpen ? 'mobile-menu-open' : ''}`}
        >
          <div className="mobile-menu-brand">
            <img src={logoImage} alt="RUNA Finance" className="mobile-menu-logo" />
          </div>
          <a href="/" className="mobile-nav-link" onClick={closeMenu}>Главная</a>
          <a href="/#about-runa" className="mobile-nav-link" onClick={closeMenu}>Что такое RUNA</a>
          <a href="/#problems" className="mobile-nav-link" onClick={closeMenu}>Проблемы и потери</a>
          <a href="/#why-runa" className="mobile-nav-link" onClick={closeMenu}>Почему RUNA</a>
          <a href="/premium" className="mobile-nav-link" onClick={closeMenu}>Подписка</a>
          <div className="mobile-download-block">
            <p className="mobile-download-heading">Скачать приложение</p>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="store-badge-link store-badge-link--apple mobile-store-badge"
              onClick={closeMenu}
            >
              <AppleStoreIcon />
              <span className="store-badge-text">
                <span className="store-badge-kicker">Загрузите в</span>
                <span className="store-badge-title">App Store</span>
              </span>
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="store-badge-link store-badge-link--google mobile-store-badge"
              onClick={closeMenu}
            >
              <GooglePlayIcon />
              <span className="store-badge-text">
                <span className="store-badge-kicker">Доступно в</span>
                <span className="store-badge-title">Google Play</span>
              </span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
