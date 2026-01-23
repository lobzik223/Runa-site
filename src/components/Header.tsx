import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import logoImage from './images/runalogo.png';

interface HeaderProps {
  showOnMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showOnMobile = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className={`header ${!showOnMobile ? 'header-hidden-mobile' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <img src={logoImage} alt="RUNA Finance" className="logo-image" />
        </div>
        
        <nav className="header-nav">
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Главная</a>
          <a href="#about-runa" className="nav-link">Что такое RUNA</a>
          <a href="#problems" className="nav-link">Проблемы и потери</a>
          <a href="#why-runa" className="nav-link">Почему RUNA</a>
          <a href="#pricing" className="nav-link">Попробовать бесплатно</a>
        </nav>
        
        <button className="header-download-btn">Скачать</button>
        
        {/* Гамбургер-меню для мобильной версии */}
        <button 
          className="header-menu-btn"
          onClick={toggleMenu}
          aria-label="Открыть меню"
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
          <a href="#home" className="mobile-nav-link" onClick={closeMenu}>Главная</a>
          <a href="#about-runa" className="mobile-nav-link" onClick={closeMenu}>Что такое RUNA</a>
          <a href="#problems" className="mobile-nav-link" onClick={closeMenu}>Проблемы и потери</a>
          <a href="#why-runa" className="mobile-nav-link" onClick={closeMenu}>Почему RUNA</a>
          <a href="#pricing" className="mobile-nav-link" onClick={closeMenu}>Попробовать бесплатно</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
