import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import StoreDownloadLink from './StoreDownloadLink';
import './AppScreensSection.css';

type SideWidget = {
  id: string;
  side: 'left' | 'right';
  top: string;
  parallax: number;
  delay: number;
  label: string;
  desc: string;
  icon: ReactNode;
};

const SIDE_WIDGETS: SideWidget[] = [
  {
    id: 'analytics',
    side: 'left',
    top: '14%',
    parallax: -0.11,
    delay: 0,
    label: 'Аналитика',
    desc: 'Наглядные графики доходов и расходов по категориям — за месяц по каждому счёту.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="6" y="18" width="5" height="10" rx="1.5" fill="currentColor" opacity="0.45" />
        <rect x="13" y="12" width="5" height="16" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="20" y="8" width="5" height="20" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'ai',
    side: 'left',
    top: '54%',
    parallax: 0.09,
    delay: 0.1,
    label: 'Runa AI',
    desc: 'Финансовый помощник в чате: подскажет, как записать трату и сохранит операцию за вас.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="6" y="8" width="20" height="16" rx="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="16" r="2" fill="currentColor" />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
        <circle cx="20" cy="16" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'banking',
    side: 'right',
    top: '16%',
    parallax: 0.12,
    delay: 0.06,
    label: 'Банкинг',
    desc: 'Кредиты, вклады и напоминания — все важные сроки всегда на виду.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M6 14L16 8L26 14V24H6V14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <rect x="12" y="18" width="8" height="6" rx="1" fill="currentColor" opacity="0.35" />
      </svg>
    ),
  },
  {
    id: 'wallet',
    side: 'right',
    top: '58%',
    parallax: -0.1,
    delay: 0.14,
    label: 'Кошелёк',
    desc: 'Карты, наличные и общий баланс — всё собрано в одном экране.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="6" y="10" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="22" cy="17" r="2" fill="currentColor" />
        <path d="M6 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      </svg>
    ),
  },
];

type ScreenBlock = {
  id: string;
  badge: string;
  title: string;
  desc: string;
  bullets: string[];
  reverse: boolean;
  image?: string;
  imageAlt?: string;
  imageLayout?: 'phone' | 'showcase';
};

const SCREENS: ScreenBlock[] = [
  {
    id: 'main',
    badge: 'Главная',
    title: 'Доходы, расходы и кошелёк',
    image: '/screens-app-02.png',
    imageAlt: 'Runa Finance — доходы, расходы и кошелёк',
    imageLayout: 'showcase',
    desc: 'Всё, что нужно для ежедневного учёта финансов. Записывайте операции, следите за балансом и держите бюджет под контролем.',
    bullets: [
      'Категории для любых трат и поступлений',
      'Кошелёк с картами, наличными и историей операций',
      'Регулярные платежи и удобные фильтры',
    ],
    reverse: false,
  },
  {
    id: 'analytics',
    badge: 'Аналитика',
    title: 'Графики и категории',
    image: '/screens-app-03.png',
    imageAlt: 'Runa Finance — графики и категории',
    imageLayout: 'showcase',
    desc: 'Понятная картина ваших финансов. Смотрите, сколько тратите и на что — по категориям и счетам за месяц.',
    bullets: [
      'Наглядные графики доходов и расходов',
      'Разбивка по счетам и категориям',
      'Финансовые цели с отслеживанием прогресса',
    ],
    reverse: true,
  },
  {
    id: 'banking',
    badge: 'Банкинг',
    title: 'Кредиты и вклады',
    image: '/screens-app-banking.png',
    imageAlt: 'Runa Finance — кредиты и вклады',
    imageLayout: 'showcase',
    desc: 'Кредиты, вклады и важные сроки — в одном разделе. Планируйте платежи и следите за доходностью.',
    bullets: [
      'Кредиты с графиком и историей платежей',
      'Вклады с расчётом дохода',
      'Напоминания о предстоящих сроках',
    ],
    reverse: false,
  },
  {
    id: 'ai',
    badge: 'Runa AI',
    title: 'ИИ-финансовый помощник',
    image: '/screens-app-01.png',
    imageAlt: 'Runa Finance — ИИ-финансовый помощник',
    imageLayout: 'showcase',
    desc: 'Умный ассистент, который помогает с финансами. Напишите в чат, отправьте голос или фото — Runa AI подскажет и запишет операцию.',
    bullets: [
      'Персональные советы и история диалогов',
      'Распознавание чеков по фото',
      'Быстрая запись расходов и доходов',
    ],
    reverse: false,
  },
];

export default function AppScreensSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const blockRefs = useRef<(HTMLElement | null)[]>([]);
  const widgetRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.classList.add('is-visible');
      },
      { threshold: 0.05, rootMargin: '80px 0px -20px 0px' },
    );
    headerObserver.observe(section);

    const blockObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' },
    );

    blockRefs.current.forEach((el) => {
      if (el) blockObserver.observe(el);
    });

    const updateParallax = () => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const sectionScroll = Math.max(0, -rect.top);
      SIDE_WIDGETS.forEach((w, i) => {
        widgetRefs.current[i]?.style.setProperty('--parallax-y', `${sectionScroll * w.parallax}px`);
      });
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax, { passive: true });

    return () => {
      headerObserver.disconnect();
      blockObserver.disconnect();
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
    };
  }, []);

  return (
    <section className="screens-section" id="app-screens" ref={sectionRef}>
      <div className="screens-side-layer" aria-hidden="true">
        {SIDE_WIDGETS.map((w, i) => (
          <div
            key={w.id}
            ref={(el) => { widgetRefs.current[i] = el; }}
            className={`screens-side-widget screens-side-widget--${w.side}`}
            style={{ '--sw-top': w.top, '--sw-delay': `${w.delay}s` } as CSSProperties}
          >
            <div className="screens-side-widget-body">
              <div className="screens-side-icon">{w.icon}</div>
              <div className="screens-side-text">
                <span className="screens-side-label">{w.label}</span>
                <p className="screens-side-desc">{w.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="screens-inner">
        <p className="screens-eyebrow">Разделы приложения</p>
        <h2 className="screens-title">Как устроена Runa Finance</h2>
        <p className="screens-desc">
          Четыре ключевых раздела — от ежедневного учёта до банкинга и ИИ-помощника.
        </p>

        <div className="screens-stack">
          {SCREENS.map((s, i) => (
            <article
              key={s.id}
              ref={(el) => { blockRefs.current[i] = el; }}
              className={`screens-block${s.reverse ? ' screens-block--reverse' : ''}`}
            >
              <div className="screens-block-text">
                <span className="screens-badge">{s.badge}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <StoreDownloadLink className="screens-btn">
                  <span>Скачать приложение</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </StoreDownloadLink>
              </div>

              <div
                className={`screens-block-visual${
                  s.imageLayout === 'showcase' ? ' screens-block-visual--showcase' : ''
                }`}
              >
                {s.imageLayout === 'showcase' && s.image ? (
                  <div className="screens-showcase-stage" aria-label={`Иллюстрация — ${s.badge}`}>
                    <img
                      src={s.image}
                      alt={s.imageAlt ?? s.title}
                      className="screens-showcase-img"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <>
                    <div className="screens-phone-glow" aria-hidden="true" />
                    <div className="screens-phone-slot" aria-label={`Скриншот — ${s.badge}`}>
                      <div className="screens-phone-frame">
                        <div className="screens-phone-notch" />
                        <div className={`screens-phone-screen${s.image ? ' screens-phone-screen--filled' : ''}`}>
                          {s.image ? (
                            <img
                              src={s.image}
                              alt={s.imageAlt ?? s.title}
                              className="screens-phone-img"
                              loading="lazy"
                              draggable={false}
                            />
                          ) : (
                            <span className="screens-phone-label">Скриншот</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
