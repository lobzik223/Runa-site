import { useEffect, useRef, type CSSProperties } from 'react';
import './PremiumTeaserSection.css';
import './FeaturesSection.css';

const PREMIUM_FEATURES = [
  'Безлимитный чат Runa AI',
  'Глубокая аналитика по категориям',
  'Прогнозы и финансовые планы',
  'Приоритетная поддержка',
];

export default function PremiumTeaserSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.classList.add('is-visible');
      },
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="runa-section premium-teaser" id="premium-teaser" ref={sectionRef}>
      <div className="premium-teaser-bg" aria-hidden="true" />
      <div className="runa-section-inner premium-teaser-inner">
        <p className="runa-eyebrow runa-eyebrow--light">Premium</p>
        <h2 className="runa-section-title runa-section-title--light">Больше возможностей с подпиской</h2>
        <p className="runa-section-desc runa-section-desc--light">
          Расширенный AI, детальная аналитика и инструменты для тех, кто серьёзно управляет деньгами.
        </p>
        <ul className="premium-feature-list">
          {PREMIUM_FEATURES.map((f, i) => (
            <li key={f} style={{ '--feat-delay': `${0.15 + i * 0.06}s` } as CSSProperties}>
              <span className="premium-check" aria-hidden="true">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <div className="premium-teaser-actions">
          <a href="/premium" className="premium-teaser-btn">Выбрать тариф</a>
          <p className="premium-teaser-note">от 350 ₽ / месяц · оплата через ЮKassa</p>
        </div>
      </div>
    </section>
  );
}
