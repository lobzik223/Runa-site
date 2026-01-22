import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <HeroSection />
      <main className="page-content">
        <section className="runa-intro" id="about-runa">
          <p className="eyebrow">Что такое RUNA</p>
          <h2>Умный финансовый помощник, созданный для вас</h2>
          <p className="description">
            RUNA — это интеллектуальный финансовый инструмент, созданный для того, чтобы ви могли полностью
            контролировать свои деньги и принимать взвешенные решения. Приложение помогает отслеживать доходы
            и расходы, анализирует привычки и предлагает рекомендации по оптимизации бюджета.
            RUNA объединяет ключевые функции управления личными финансами: планирование бюджета,
            аналитика трат, финансовые цели и персональные советы.
          </p>
        </section>

        <section className="runa-features" id="features">
          <div className="feature-grid">
            {[
              'Управление доходами и расходами',
              'Финансовые рекомендации AI',
              'Планирование бюджета и цели',
              'Автоматическая аналитика',
            ].map((title) => (
              <article key={title} className="feature-card">
                <h3>{title}</h3>
                <p>Универсальный инструмент для ежедневного контроля, анализа и планирования.</p>
              </article>
            ))}
          </div>
          <aside className="feature-advantages">
            <h3>Преимущества</h3>
            <ul>
              <li>Простота и скорость</li>
              <li>Полный контроль финансов</li>
              <li>Персональные советы, а не шаблоны</li>
            </ul>
          </aside>
        </section>

        <section className="runa-problems" id="problems">
          <p className="eyebrow">Проблемы и потери</p>
          <h2>Что теряют люди без контроля</h2>
          <div className="problem-grid">
            {[
              'Без контроля бюджета вы теряете в среднем 7 500 ₽ в месяц',
              'Потраченные впустую деньги на импульсивные покупки и забытые подписки',
              '72% россиян не знают, куда уходят их деньги',
              'Каждый второй тратит больше, чем планировал',
              'Без планирования доходов вы упускаете инвестиционные возможности',
            ].map((text, index) => (
              <article key={index} className="problem-card">
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="runa-pricing" id="pricing">
          <div className="pricing-card">
            <h2>Попробуй RUNA бесплатно</h2>
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
        <p className="footer-note">© RUNA Finance — Ваша уверенность в деньгах</p>
      </footer>
    </div>
  );
};

export default App;
