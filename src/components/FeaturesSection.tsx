import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import './FeaturesSection.css';

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="14" width="4" height="10" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="12" y="8" width="4" height="16" rx="1" fill="currentColor" />
        <rect x="20" y="12" width="4" height="12" rx="1" fill="currentColor" opacity="0.85" />
      </svg>
    ),
    title: 'Умная аналитика',
    desc: 'Доходы, расходы и баланс в наглядных графиках — всегда под рукой.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M6 24C6 19 9 16 14 16C19 16 22 19 22 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'AI-консультант',
    desc: 'Персональные советы и помощь с учётом финансов от искусственного интеллекта.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="5" y="8" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M5 13H23" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    title: 'Кредиты и вклады',
    desc: 'Кредиты, вклады и важные платежи — всё в одном месте с напоминаниями.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="2" />
        <circle cx="14" cy="14" r="4" fill="currentColor" opacity="0.6" />
      </svg>
    ),
    title: 'Цели и планы',
    desc: 'Ставьте финансовые цели и отслеживайте прогресс каждый день.',
  },
];

type WidgetConfig = {
  id: string;
  side: 'left' | 'right';
  top: string;
  parallax: number;
  delay: number;
  label: string;
  value?: string;
  visual: ReactNode;
  lockTop?: boolean;
};

const WIDGETS: WidgetConfig[] = [
  {
    id: 'analytics',
    side: 'left',
    top: '17%',
    parallax: 0.04,
    delay: 0,
    lockTop: true,
    label: 'Аналитика',
    value: '+24%',
    visual: (
      <svg viewBox="0 0 120 56" fill="none" aria-hidden="true" className="runa-widget-svg">
        <rect x="8" y="32" width="14" height="18" rx="3" fill="#495aee" opacity="0.45" />
        <rect x="30" y="18" width="14" height="32" rx="3" fill="#495aee" opacity="0.7" />
        <rect x="52" y="26" width="14" height="24" rx="3" fill="#92a9ec" />
        <rect x="74" y="10" width="14" height="40" rx="3" fill="#3cbb75" opacity="0.75" />
        <rect x="96" y="22" width="14" height="28" rx="3" fill="#495aee" opacity="0.55" />
      </svg>
    ),
  },
  {
    id: 'wallet',
    side: 'left',
    top: '38%',
    parallax: 0.1,
    delay: 0.1,
    label: 'Кошелёк',
    value: '128 450 ₽',
    visual: (
      <svg viewBox="0 0 120 56" fill="none" aria-hidden="true" className="runa-widget-svg">
        <rect x="10" y="14" width="100" height="32" rx="8" stroke="#495aee" strokeWidth="2.5" opacity="0.5" />
        <circle cx="88" cy="30" r="8" fill="#495aee" opacity="0.35" />
        <rect x="18" y="22" width="48" height="5" rx="2" fill="#92a9ec" opacity="0.6" />
        <rect x="18" y="32" width="32" height="4" rx="2" fill="#495aee" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: 'expenses',
    side: 'left',
    top: '66%',
    parallax: -0.15,
    delay: 0.18,
    label: 'Расходы',
    value: '−28 150',
    visual: (
      <svg viewBox="0 0 120 56" fill="none" aria-hidden="true" className="runa-widget-svg">
        <circle cx="40" cy="28" r="22" stroke="#e8edf2" strokeWidth="8" />
        <circle cx="40" cy="28" r="22" stroke="#495aee" strokeWidth="8" strokeDasharray="90 138" strokeLinecap="round" transform="rotate(-90 40 28)" />
        <rect x="72" y="18" width="36" height="5" rx="2" fill="#495aee" opacity="0.35" />
        <rect x="72" y="28" width="28" height="5" rx="2" fill="#92a9ec" opacity="0.5" />
        <rect x="72" y="38" width="20" height="5" rx="2" fill="#3cbb75" opacity="0.45" />
      </svg>
    ),
  },
  {
    id: 'card',
    side: 'right',
    top: '18%',
    parallax: 0.04,
    delay: 0.06,
    lockTop: true,
    label: 'Карта',
    value: '•••• 4821',
    visual: (
      <svg viewBox="0 0 120 56" fill="none" aria-hidden="true" className="runa-widget-svg">
        <rect x="8" y="8" width="104" height="40" rx="8" fill="url(#cardGrad)" />
        <rect x="8" y="18" width="104" height="8" fill="rgba(255,255,255,0.25)" />
        <rect x="16" y="32" width="40" height="5" rx="2" fill="rgba(255,255,255,0.7)" />
        <circle cx="96" cy="34" r="7" fill="rgba(255,255,255,0.35)" />
        <defs>
          <linearGradient id="cardGrad" x1="8" y1="8" x2="112" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#92a9ec" />
            <stop offset="1" stopColor="#1f0280" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'growth',
    side: 'right',
    top: '36%',
    parallax: -0.11,
    delay: 0.14,
    label: 'Рост',
    value: '+12%',
    visual: (
      <svg viewBox="0 0 120 56" fill="none" aria-hidden="true" className="runa-widget-svg">
        <path d="M8 42 L32 30 L52 34 L72 18 L112 10" stroke="#495aee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="112" cy="10" r="5" fill="#3cbb75" />
        <line x1="8" y1="48" x2="112" y2="48" stroke="#495aee" strokeWidth="1" opacity="0.15" />
        <line x1="8" y1="36" x2="112" y2="36" stroke="#495aee" strokeWidth="1" opacity="0.1" />
      </svg>
    ),
  },
  {
    id: 'ai',
    side: 'right',
    top: '64%',
    parallax: 0.14,
    delay: 0.22,
    label: 'AI-анализ',
    value: 'Совет дня',
    visual: (
      <svg viewBox="0 0 120 56" fill="none" aria-hidden="true" className="runa-widget-svg">
        <rect x="10" y="10" width="100" height="36" rx="12" fill="rgba(73,90,238,0.08)" stroke="#495aee" strokeWidth="1.5" opacity="0.6" />
        <circle cx="28" cy="28" r="10" fill="#495aee" opacity="0.2" />
        <path d="M24 28h8M28 24v8" stroke="#495aee" strokeWidth="2" strokeLinecap="round" />
        <rect x="44" y="22" width="52" height="4" rx="2" fill="#495aee" opacity="0.35" />
        <rect x="44" y="30" width="38" height="4" rx="2" fill="#92a9ec" opacity="0.45" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const widgetRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.classList.add('is-visible');
      },
      { threshold: 0.05, rootMargin: '80px 0px -20px 0px' },
    );
    observer.observe(section);

    const updateParallax = () => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const sectionScroll = Math.max(0, -rect.top);

      WIDGETS.forEach((w, i) => {
        const el = widgetRefs.current[i];
        if (!el) return;

        let parallaxY = sectionScroll * w.parallax;
        if (w.lockTop) {
          parallaxY = Math.max(0, parallaxY);
          const visible = rect.top <= 96;
          el.style.setProperty('--widget-visible', visible ? '1' : '0');
        } else {
          el.style.setProperty('--widget-visible', '1');
        }

        el.style.setProperty('--parallax-y', `${parallaxY}px`);
      });
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
    };
  }, []);

  return (
    <section className="runa-section" id="features" ref={sectionRef}>
      <div className="runa-section-bg" aria-hidden="true">
        <div className="runa-section-wave runa-section-wave--top" />
        <div className="runa-blob runa-blob--left" />
        <div className="runa-blob runa-blob--right" />

        <div className="runa-widgets-layer">
          {WIDGETS.map((w, i) => (
            <div
              key={w.id}
              ref={(el) => { widgetRefs.current[i] = el; }}
              className={`runa-widget runa-widget--${w.side}${w.lockTop ? ' runa-widget--lock-top' : ''}`}
              style={{
                '--widget-delay': `${w.delay}s`,
                '--widget-top': w.top,
              } as CSSProperties}
            >
              <div className="runa-widget-body">
                <div className="runa-widget-visual">{w.visual}</div>
                <div className="runa-widget-meta">
                  <span className="runa-widget-label">{w.label}</span>
                  {w.value && <span className="runa-widget-value">{w.value}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="runa-section-inner">
        <p className="runa-eyebrow">О приложении</p>
        <h2 className="runa-section-title">
          Финансы под контролем —<br />просто и красиво
        </h2>
        <p className="runa-section-desc">
          RUNA объединяет учёт, аналитику, инвестиции и AI в одном приложении с продуманным интерфейсом.
        </p>

        <div className="runa-glass-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="runa-glass-card">
              <div className="runa-glass-card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
