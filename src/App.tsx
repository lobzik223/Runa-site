import React, { useEffect, useRef } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import './App.css';

const App: React.FC = () => {
  const introSectionRef = useRef<HTMLElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const observerOptions = {
      threshold: isMobile ? 0.1 : 0.15,
      rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elements = [introTextRef.current, widgetRef.current].filter(Boolean) as Element[];
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="app">
      <Header />
      <HeroSection />
      <main className="page-content">
        <section className="runa-intro-features" id="about-runa" ref={introSectionRef}>
          <div className="eyebrow-widget">
            <p className="eyebrow">Что такое R<span className="logo-u">U</span>NA</p>
          </div>
          <div className="runa-intro" ref={introTextRef}>
            <div className="runa-intro-content">
              <h2>Умный финансовый помощник, созданный для вас</h2>
              <p className="description">
                R<span className="logo-u">U</span>NA — интеллектуальный финансовый инструмент для полного контроля ваших денег. 
                Отслеживайте доходы и расходы, анализируйте привычки и получайте персональные рекомендации 
                по оптимизации бюджета.
              </p>
            </div>
            <div className="runa-intro-logo-mobile">
              <img src="/mov/analitiklogo.png" alt="RUNA Analytics" className="analytics-logo-mobile" />
            </div>
          </div>
          <div className="feature-column" ref={widgetRef}>
            <aside className="feature-advantages">
              <div className="advantages-image">
                <img src="/mov/analitiklogo.png" alt="RUNA Analytics" className="analytics-logo" />
              </div>
            </aside>
          </div>
        </section>

        <section className="runa-problems" id="problems">
          <div className="eyebrow-widget">
            <p className="eyebrow">Проблемы и потери</p>
          </div>
          <h2>Что теряют люди без контроля</h2>
          <p className="runa-problems-desc">
            Без контроля бюджета и привычек вы теряете деньги каждый месяц. 
            Узнайте, какие потери можно избежать с R<span className="logo-u">U</span>NA.
          </p>
          <div className="problem-grid">
            <article className="problem-card problem-card-with-image">
              <div className="problem-card-text">
                <h3 className="problem-card-title">Потери бюджета</h3>
                <p className="problem-card-desc">Без контроля бюджета вы теряете в среднем 7 500 ₽ в месяц.</p>
              </div>
              <div className="problem-card-image">
                <img src="/mov/potera.png" alt="Потери бюджета" />
              </div>
            </article>
            <article className="problem-card problem-card-wide">
              <span className="problem-card-number">02</span>
              <h3 className="problem-card-title">Импульсивные траты</h3>
              <p className="problem-card-desc">Потраченные впустую деньги на импульсивные покупки и забытые подписки.</p>
            </article>
            <article className="problem-card problem-card-light problem-card-large">
              <span className="problem-card-number">03</span>
              <h3 className="problem-card-title">Незнание о расходах</h3>
              <p className="problem-card-desc">72% россиян не знают, куда уходят их деньги.</p>
            </article>
            <article className="problem-card">
              <span className="problem-card-number">04</span>
              <h3 className="problem-card-title">Перерасход</h3>
              <p className="problem-card-desc">Каждый второй тратит больше, чем планировал.</p>
            </article>
          </div>
        </section>

        <section className="runa-pricing" id="pricing">
          <div className="pricing-card">
            <h2>Попробуй R<span className="logo-u">U</span>NA бесплатно</h2>
            <p>Бесплатный доступ на 3 дня. После — подписка всего X ₽/мес.</p>
            <div className="pricing-actions">
              <button className="btn primary">Попробовать бесплатно</button>
              <button className="btn secondary">Купить подписку</button>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>Контакты</h4>
            <p>Телефон / Email / Telegram</p>
          </div>
          <div>
            <h5>Ссылки</h5>
            <ul>
              <li>Telegram</li>
              <li>Email</li>
              <li>Политика конфиденциальности</li>
              <li>Пользовательское соглашение</li>
            </ul>
          </div>
        </div>
        <p className="footer-note">© R<span className="logo-u">U</span>NA Finance — Ваша уверенность в деньгах</p>
      </footer>
    </div>
  );
};

export default App;
