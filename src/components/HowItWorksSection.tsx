import { useEffect, useRef, type CSSProperties } from 'react';
import './HowItWorksSection.css';
import './FeaturesSection.css';

const STEPS = [
  {
    num: '01',
    title: 'Скачайте приложение',
    desc: 'Установите RUNA Finance из App Store или Google Play и создайте аккаунт за пару минут.',
  },
  {
    num: '02',
    title: 'Добавьте финансы',
    desc: 'Записывайте доходы и расходы, подключайте карты, кредиты, вклады и цели накопления.',
  },
  {
    num: '03',
    title: 'Смотрите аналитику',
    desc: 'Графики, категории и динамика по счетам покажут, куда уходят деньги и что можно улучшить.',
  },
  {
    num: '04',
    title: 'Используйте Runa AI',
    desc: 'Напишите в чат — ассистент подскажет категорию, счёт и сохранит операцию в журнал.',
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.classList.add('is-visible');
      },
      { threshold: 0.08, rootMargin: '60px 0px' },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="runa-section how-section" id="how-it-works" ref={sectionRef}>
      <div className="runa-section-bg how-section-bg" aria-hidden="true" />
      <div className="runa-section-inner">
        <p className="runa-eyebrow">Как это работает</p>
        <h2 className="runa-section-title">Четыре шага к порядку в финансах</h2>
        <p className="runa-section-desc">
          От первой операции до умных подсказок — всё в одном приложении, без лишней сложности.
        </p>
        <ol className="how-steps">
          {STEPS.map((step, i) => (
            <li key={step.num} className="how-step" style={{ '--step-delay': `${0.12 + i * 0.08}s` } as CSSProperties}>
              <span className="how-step-num">{step.num}</span>
              <div className="how-step-body">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
