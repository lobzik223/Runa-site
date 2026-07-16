import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import StoreDownloadLink from './StoreDownloadLink';
import './BentoSection.css';

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
    id: 'goals',
    side: 'right',
    top: '58%',
    parallax: -0.1,
    delay: 0.14,
    label: 'Цели',
    desc: 'Финансовые цели с прогрессом накоплений, приоритетом и пополнением в любой момент.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.35" />
      </svg>
    ),
  },
];

export default function BentoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const widgetRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) section.classList.add('is-visible'); },
      { threshold: 0.05, rootMargin: '80px 0px -20px 0px' },
    );
    observer.observe(section);

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
      observer.disconnect();
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
    };
  }, []);

  return (
    <section className="bento-section" id="tools" ref={sectionRef}>
      <div className="bento-side-layer" aria-hidden="true">
        {SIDE_WIDGETS.map((w, i) => (
          <div
            key={w.id}
            ref={(el) => { widgetRefs.current[i] = el; }}
            className={`bento-side-widget bento-side-widget--${w.side}`}
            style={{ '--sw-top': w.top, '--sw-delay': `${w.delay}s` } as CSSProperties}
          >
            <div className="bento-side-widget-body">
              <div className="bento-side-icon">{w.icon}</div>
              <div className="bento-side-text">
                <span className="bento-side-label">{w.label}</span>
                <p className="bento-side-desc">{w.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bento-inner">
        <p className="bento-eyebrow">Возможности</p>
        <h2 className="bento-title">Всё для ваших финансов</h2>
        <p className="bento-desc">
          Runa Finance — приложение для личных финансов: учёт, аналитика, инвестиции
          и умный помощник в одном месте.
        </p>

        <div className="bento-grid">
          <article className="bento-card bento-card--main">
            <span className="bento-badge">Главная</span>
            <div className="bento-main-layout">
              <div className="bento-card-content">
                <h3>Доходы и расходы</h3>
                <p>
                  Записывайте доходы и расходы за секунды, выбирайте категорию
                  и способ оплаты — наличные или карта.
                </p>
                <ul>
                  <li>Удобные категории: зарплата, продукты, транспорт, ЖКУ, подписки</li>
                  <li>Регулярные платежи и обязательства под контролем</li>
                  <li>История операций с удобными фильтрами</li>
                  <li>Аналитика расходов и доходов за месяц</li>
                </ul>
                <div className="bento-actions">
                  <a href="/premium" className="bento-btn bento-btn--dark">Подробнее</a>
                  <StoreDownloadLink className="bento-btn bento-btn--light">Скачать</StoreDownloadLink>
                </div>
              </div>
              <div className="bento-photo bento-photo--filled" aria-label="Доходы и расходы — Runa Finance">
                <img
                  src="/delovo.png"
                  alt="Runa Finance — учёт доходов и расходов"
                  className="bento-photo-img"
                  loading="lazy"
                />
              </div>
            </div>
          </article>

          <article className="bento-card bento-card--side">
            <span className="bento-badge">Кошелёк</span>
            <h3>Кошелёк</h3>
            <p>
              Карты, наличные и общий баланс — всё собрано в одном экране.
              Пополняйте и списывайте средства, настраивайте счета под себя.
            </p>
            <ul>
              <li>Баланс по каждой карте и наличным</li>
              <li>Быстрое пополнение и списание</li>
            </ul>
            <div className="bento-text-block">
              <p>
                Ведите личный бюджет удобно и наглядно.
                Каждый счёт учитывается отдельно, итоговый баланс обновляется автоматически.
              </p>
              <ul>
                <li>Несколько карт и наличные в одном кошельке</li>
                <li>Оформление и валюта для каждого счёта</li>
                <li>История операций за любой период</li>
              </ul>
            </div>
            <StoreDownloadLink className="bento-btn bento-btn--dark bento-btn--full">Открыть</StoreDownloadLink>
          </article>

          <article className="bento-card bento-card--side">
            <span className="bento-badge">Активы</span>
            <h3>Крипта и биржа</h3>
            <p>
              Следите за криптовалютой и акциями в одном портфеле.
              Котировки, сделки и финансовые новости — рядом с вашим бюджетом.
            </p>
            <ul>
              <li>Курсы валют и рыночная аналитика</li>
              <li>Актуальные финансовые новости</li>
              <li>RUNA Premium — расширенные возможности</li>
            </ul>
            <div className="bento-photo bento-photo--sm bento-photo--filled" aria-label="Крипта и биржа">
              <img
                src="/screens-crypto.png"
                alt="Runa Finance — крипта и биржа"
                className="bento-photo-img"
                loading="lazy"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
