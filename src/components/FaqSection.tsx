import { useEffect, useRef, useState } from 'react';
import './FaqSection.css';
import './FeaturesSection.css';

const FAQ_ITEMS = [
  {
    q: 'Приложение бесплатное?',
    a: 'Да, базовые функции — учёт операций, аналитика, цели и банкинг — доступны бесплатно. Premium открывает расширенный AI и углублённую аналитику.',
  },
  {
    q: 'Как оформить подписку Premium?',
    a: 'Перейдите в раздел «Подписка» на сайте, выберите тариф, укажите email и ID аккаунта из приложения, затем оплатите через ЮKassa.',
  },
  {
    q: 'Где взять ID аккаунта?',
    a: 'Откройте приложение RUNA Finance → Профиль → внизу экрана или в настройках указан ваш ID для оплаты на сайте.',
  },
  {
    q: 'Runa AI записывает операции сам?',
    a: 'Да. Напишите, например: «добавь расход на продукты 500 ₽» — ассистент предложит категорию и счёт, после подтверждения сохранит в журнал.',
  },
  {
    q: 'Как связаться с поддержкой?',
    a: 'Оставьте тикет в разделе «Поддержка» на сайте — укажите имя, почту и вопрос. Также можно написать в Telegram @RUNAfinance или на runa.fintech@bk.ru.',
  },
];

export default function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <section className="runa-section faq-section" id="faq" ref={sectionRef}>
      <div className="runa-section-bg faq-section-bg" aria-hidden="true" />
      <div className="runa-section-inner">
        <p className="runa-eyebrow">FAQ</p>
        <h2 className="runa-section-title">Частые вопросы</h2>
        <p className="runa-section-desc">
          Коротко о подписке, AI и том, как начать пользоваться RUNA Finance.
        </p>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <article key={item.q} className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className="faq-chevron" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p className="faq-answer">{item.a}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
