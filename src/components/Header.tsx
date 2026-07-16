import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Header.css';
import StoreDownloadLink from './StoreDownloadLink';

const NAV_ITEMS = [
  { href: '/', label: 'Главная', id: 'home', sectionId: null as string | null },
  { href: '/#features', label: 'О приложении', id: 'about', sectionId: 'features' },
  { href: '/#how-it-works', label: 'Как работает', id: 'how', sectionId: 'how-it-works' },
  { href: '/#faq', label: 'FAQ', id: 'faq', sectionId: 'faq' },
  { href: '/#support', label: 'Тикет', id: 'support', sectionId: 'support' },
  { href: '/#download', label: 'Скачать', id: 'download', sectionId: 'download' },
  { href: '/premium', label: 'Подписка', id: 'premium', sectionId: null },
];

const SECTION_SPY = [
  { id: 'about', sectionId: 'features' },
  { id: 'how', sectionId: 'how-it-works' },
  { id: 'faq', sectionId: 'faq' },
  { id: 'support', sectionId: 'support' },
  { id: 'download', sectionId: 'download' },
] as const;

function isLightRoute(pathname: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  return (
    p === '/premium' ||
    p.startsWith('/premium/') ||
    p === '/privacy' ||
    p === '/privacy-policy' ||
    p === '/privacy-en' ||
    p === '/user-agreement' ||
    p === '/agreement'
  );
}

interface HeaderProps {
  showOnMobile?: boolean;
}

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');
  const [light, setLight] = useState(() =>
    typeof window !== 'undefined' ? isLightRoute(window.location.pathname) : false,
  );
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: (typeof NAV_ITEMS)[number]) => {
      setActiveId(item.id);
      closeMenu();

      if (item.id === 'premium') return;

      const onLanding = (window.location.pathname.replace(/\/$/, '') || '/') === '/';
      if (item.sectionId && onLanding) {
        e.preventDefault();
        if (item.sectionId) {
          window.history.replaceState(null, '', `/#${item.sectionId}`);
          scrollToSection(item.sectionId);
        }
        return;
      }

      if (item.id === 'home' && onLanding) {
        e.preventDefault();
        window.history.replaceState(null, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [closeMenu, scrollToSection],
  );

  useEffect(() => {
    setLight(isLightRoute(window.location.pathname));
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const t = event.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (menuButtonRef.current?.contains(t)) return;
      closeMenu();
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    if (path === '/premium' || path.startsWith('/premium/')) {
      setActiveId('premium');
      return;
    }
    if (path !== '/') return;

    const onScroll = () => {
      const offset = window.scrollY + 120;
      let current: string = 'home';
      for (const item of SECTION_SPY) {
        const el = document.getElementById(item.sectionId);
        if (!el) continue;
        if (el.offsetTop <= offset) current = item.id;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`ios-header${light ? ' ios-header--light' : ''}`}>
      <div className="ios-header-pill">
        <a href="/" className="ios-header-brand" aria-label="RUNA Finance">
          <img
            src="/logo-mark.png"
            alt="RUNA Finance"
            width={36}
            height={36}
            className="ios-header-logo"
            draggable={false}
          />
        </a>

        <nav className="ios-header-nav" aria-label="Основная навигация">
          {NAV_ITEMS.filter((i) => i.id !== 'download').map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`ios-nav-link${activeId === item.id ? ' ios-nav-link--active' : ''}`}
              onClick={(e) => handleNavClick(e, item)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <StoreDownloadLink className="ios-header-cta">Скачать</StoreDownloadLink>

        <button
          ref={menuButtonRef}
          type="button"
          className={`ios-header-burger${isMenuOpen ? ' ios-header-burger--open' : ''}`}
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-expanded={isMenuOpen}
          aria-controls="ios-mobile-menu"
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          <span />
          <span />
        </button>
      </div>

      {isMenuOpen && (
        <div className="ios-mobile-overlay" onClick={closeMenu} aria-hidden="true" />
      )}

      <nav
        id="ios-mobile-menu"
        ref={menuRef}
        className={`ios-mobile-menu${isMenuOpen ? ' ios-mobile-menu--open' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`ios-mobile-link${activeId === item.id ? ' ios-mobile-link--active' : ''}`}
            onClick={(e) => handleNavClick(e, item)}
          >
            {item.label}
          </a>
        ))}
        <StoreDownloadLink className="ios-mobile-cta" onClick={closeMenu}>
          Скачать
        </StoreDownloadLink>
      </nav>
    </header>
  );
};

export default Header;
