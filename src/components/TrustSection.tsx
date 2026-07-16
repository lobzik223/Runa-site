import { useEffect, useRef } from 'react';
import './TrustSection.css';
import './FeaturesSection.css';

const TRUST_ITEMS = [
  {
    title: 'Безопасные платежи',
    desc: 'Подписка Premium оформляется через ЮKassa — СБП, карты МИР и другие способы оплаты.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4L6 8V14C6 19 9.5 23.5 14 25C18.5 23.5 22 19 22 14V8L14 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M11 14L13 16L17 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Конфиденциальность',
    desc: 'Политика конфиденциальности и пользовательское соглашение доступны на сайте в любой момент.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="6" y="10" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M10 10V8C10 5.8 11.8 4 14 4C16.2 4 18 5.8 18 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Поддержка',
    desc: 'Ответим в Telegram и на почте — поможем с подпиской, аккаунтом и вопросами по приложению.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M6 14C6 9.6 9.6 6 14 6C18.4 6 22 9.6 22 14C22 18.4 18.4 22 14 22H8L6 24V14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.classList.add('is-visible');
      },
      { threshold: 0.08 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="runa-section trust-section" id="trust" ref={sectionRef}>
      <div className="runa-section-bg trust-section-bg" aria-hidden="true" />
      <div className="runa-section-inner">
        <p className="runa-eyebrow">Надёжность</p>
        <h2 className="runa-section-title">Спокойствие за ваши данные и оплату</h2>
        <p className="runa-section-desc">
          Мы строим финансовый сервис с прозрачными правилами и понятной поддержкой.
        </p>
        <div className="runa-glass-grid trust-grid">
          {TRUST_ITEMS.map((item) => (
            <article key={item.title} className="runa-glass-card trust-card">
              <div className="runa-glass-card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
        <div className="trust-links">
          <a href="/privacy" className="trust-link">Политика конфиденциальности</a>
          <span className="trust-dot" aria-hidden="true">·</span>
          <a href="/user-agreement" className="trust-link">Пользовательское соглашение</a>
        </div>
      </div>
    </section>
  );
}
