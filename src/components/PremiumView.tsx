import React, { useState } from 'react';
import Header from './Header';
import logoImage from './images/runalogo.png';
import { API_CONFIG } from '../config/api.config';
import './PremiumView.css';

const PremiumView: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('6months');
  const [emailOrId, setEmailOrId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    { id: '1month', duration: '1 месяц', price: '400', description: 'Месяц полного доступа' },
    { id: '6months', duration: '6 месяцев', price: '1800', description: 'Экономия 600 ₽', badge: 'Лучший выбор', recommended: true },
    { id: '1year', duration: '1 год', price: '2500', description: 'Экономия 2300 ₽', badge: 'Максимальная выгода', best: true }
  ];

  const handleSubscribe = async () => {
    if (!emailOrId.trim()) {
      setError('Пожалуйста, введите Email или ID аккаунта из приложения');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS_CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-runa-site-key': API_CONFIG.SITE_KEY,
        },
        body: JSON.stringify({
          emailOrId: emailOrId.trim(),
          planId: selectedPlan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при создании платежа');
      }

      if (data.url) {
        // Перенаправляем на Robokassa
        window.location.href = data.url;
      } else {
        throw new Error('Не удалось получить ссылку на оплату');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Произошла ошибка. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-view">
      <Header showOnMobile={true} />
      <main className="premium-content">
        <div className="pricing-container">
          <div className="pricing-header">
            <h2>R<span className="logo-u">U</span>NA Premium</h2>
            <p className="pricing-intro">
              Выберите подписку R<span className="logo-u">U</span>NA Premium и получите полный контроль над вашими финансами. 
              Отслеживайте доходы и расходы, получайте персональные рекомендации от ИИ и принимайте обоснованные финансовые решения. 
              Вы можете отменить подписку в любое время.
            </p>
          </div>

          <div className="pricing-features">
            <h3>Что входит в Premium подписку</h3>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Неограниченный ИИ-чат для финансовых консультаций</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Глубокий анализ доходов и расходов с графиками</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Прогнозы по инвестициям и рекомендации по акциям</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Индивидуальные финансовые планы для достижения целей</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Ежедневный анализ фондового рынка и трендов</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Приоритетная поддержка и обновления</span>
              </div>
            </div>
          </div>

          <div className="payment-methods">
            <h3>Способы оплаты</h3>
            <div className="payment-icons">
              <div className="payment-icon">МИР</div>
              <div className="payment-icon">Visa / MasterCard</div>
              <div className="payment-icon">СБП</div>
            </div>
          </div>

          <div className="user-identification">
            <h3>Ваш аккаунт</h3>
            <p className="id-instruction">
              Введите Email или ID аккаунта (можно найти в профиле приложения), чтобы мы знали, кому выдать подписку.
            </p>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Email или ID аккаунта" 
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                className={`id-input ${error ? 'input-error' : ''}`}
                disabled={loading}
              />
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>

          <div className="pricing-plans">
            <h3>Выберите тариф</h3>
            <div className="plans-grid">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`plan-card ${plan.recommended ? 'plan-card-recommended' : ''} ${plan.best ? 'plan-card-best' : ''} ${selectedPlan === plan.id ? 'plan-card-selected' : ''}`}
                  onClick={() => !loading && setSelectedPlan(plan.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!loading) setSelectedPlan(plan.id);
                    }
                  }}
                  aria-label={`Выбрать тариф ${plan.duration}`}
                >
                  {plan.badge && (
                    <div className="plan-badge">{plan.badge}</div>
                  )}
                  <div className="plan-header">
                    <span className="plan-duration">{plan.duration}</span>
                  </div>
                  <div className={`plan-price ${plan.recommended || plan.best ? 'plan-price-special' : ''}`}>
                    {plan.price} ₽
                  </div>
                  <div className="plan-description">{plan.description}</div>
                  {selectedPlan === plan.id && (
                    <div className="plan-selected-indicator">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="9" fill="#CD6F42" stroke="#FFFFFF" strokeWidth="2"/>
                        <path d="M6 10L9 13L14 7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pricing-cta">
            <p className="pricing-note">
              Здесь вы официально можете получить подписку R<span className="logo-u">U</span>NA Premium. 
              Все платежи защищены и обрабатываются безопасно через Robokassa.
            </p>
            <button 
              className="btn-subscribe" 
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? 'Обработка...' : 'Оформить подписку'}
            </button>
            <p className="pricing-disclaimer">
              При оформлении подписки применяются условия использования. 
              Подписка активируется автоматически в приложении после оплаты.
            </p>
          </div>
        </div>
      </main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>Контакты</h4>
            <div className="footer-contacts">
              <p>
                <span className="footer-label">Почта:</span>{' '}
                <a href="mailto:runa.fintech@bk.ru" className="footer-link">runa.fintech@bk.ru</a>
              </p>
              <p>
                <span className="footer-label">Telegram:</span>{' '}
                <a href="https://t.me/RUNAfinance" target="_blank" rel="noopener noreferrer" className="footer-link">@RUNAfinance</a>
              </p>
            </div>
          </div>
          <div className="footer-logo-container">
            <img src={logoImage} alt="RUNA Finance" className="footer-logo" />
          </div>
          <div>
            <h5>Ссылки</h5>
            <ul>
              <li><a href="https://t.me/RUNAfinance" target="_blank" rel="noopener noreferrer" className="footer-link">Telegram</a></li>
              <li><a href="mailto:runa.fintech@bk.ru" className="footer-link">Email</a></li>
              <li><a href="/privacy" className="footer-link">Политика конфиденциальности</a></li>
              <li><a href="/user-agreement" className="footer-link">Пользовательское соглашение</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-note">© R<span className="logo-u">U</span>NA Finance — Ваша уверенность в деньгах</p>
          <p className="footer-inn">ИНН: 660609610617</p>
        </div>
      </footer>
    </div>
  );
};

export default PremiumView;
