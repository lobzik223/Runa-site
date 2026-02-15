import React, { useState, useEffect } from 'react';
import Header from './Header';
import logoImage from './images/runalogo.png';
import { API_CONFIG } from '../config/api.config';
import './PremiumView.css';

/** Преобразует ответ API и исключения в понятное сообщение об ошибке на русском */
function getPaymentErrorMessage(
  response: Response | null,
  data: { message?: string | string[] },
  err: unknown
): string {
  if (response && !response.ok) {
    const msg = data?.message;
    const text = Array.isArray(msg) ? msg.join('. ') : (msg || '');
    const lower = (text || '').toLowerCase();
    if (lower.includes('shopid') || lower.includes('secret key') || lower.includes('reissue')) {
      return 'Оплата временно недоступна. Обратитесь в поддержку.';
    }
    if (text) return text;
    switch (response.status) {
      case 400:
        return 'Неверные данные. Проверьте Email или ID аккаунта и попробуйте снова.';
      case 401:
        return 'Ошибка доступа к серверу оплаты. Обратитесь в поддержку.';
      case 404:
        return 'Сервис оплаты временно недоступен. Попробуйте позже.';
      case 429:
        return 'Слишком много попыток. Подождите минуту и попробуйте снова.';
      case 502:
      case 503:
        return 'Сервер временно недоступен. Попробуйте через несколько минут.';
      default:
        return `Ошибка сервера (${response.status}). Попробуйте позже или обратитесь в поддержку.`;
    }
  }
  const message = err instanceof Error ? err.message : String(err);
  if (/fetch|network|failed to fetch/i.test(message)) {
    return 'Нет связи с сервером. Проверьте интернет и попробуйте снова.';
  }
  if (message && message !== 'Error') return message;
  return 'Произошла ошибка. Попробуйте ещё раз или обратитесь в поддержку.';
}

const MOBILE_BREAKPOINT = 768;

const PremiumView: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>(() =>
    typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT ? '' : '6months'
  );
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT
  );
  const [showForm, setShowForm] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // При смене ширины: мобилка — сброс выбора, ПК — по умолчанию 6 месяцев
  useEffect(() => {
    const check = () => {
      const m = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(m);
      if (m) setSelectedPlan('');
      else setSelectedPlan((prev) => prev || '6months');
    };
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const plans = [
    { id: '1month', duration: '1 месяц', price: '400', description: 'Месяц полного доступа' },
    { id: '6months', duration: '6 месяцев', price: '1800', description: 'Экономия 600 ₽', badge: 'Лучший выбор', recommended: true },
    { id: '1year', duration: '1 год', price: '2500', description: 'Экономия 2300 ₽', badge: 'Максимальная выгода', best: true }
  ];

  const handleOpenForm = () => {
    if (!selectedPlan) return;
    setError(null);
    setShowForm(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Выберите тариф перед оплатой.');
      return;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (!origin) {
      setError('Не удалось определить адрес возврата. Откройте страницу с сайта.');
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedAccountId = accountId.trim();
    const emailOrId = trimmedAccountId || trimmedEmail;

    if (!emailOrId) {
      setError('Укажите Email или ID аккаунта из приложения. Без этого к оплате перейти нельзя.');
      return;
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Введите корректный адрес электронной почты.');
      return;
    }

    if (trimmedEmail && trimmedAccountId) {
      setLoading(true);
      setError(null);
      try {
        const verifyRes = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS_VERIFY_ACCOUNT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Runa-Site-Key': API_CONFIG.SITE_KEY,
          },
          body: JSON.stringify({ email: trimmedEmail, accountId: trimmedAccountId }),
        });
        const verifyData = await verifyRes.json().catch(() => ({}));
        if (!verifyData.valid) {
          setError(verifyData.message || 'Почта не совпадает с ID вашего аккаунта. Укажите данные из профиля в приложении.');
          setLoading(false);
          return;
        }
      } catch (_) {
        setError('Не удалось проверить данные. Попробуйте снова.');
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const returnUrl = `${origin}/premium/success`;
      const cancelUrl = `${origin}/premium/cancel`;

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS_CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Runa-Site-Key': API_CONFIG.SITE_KEY,
        },
        body: JSON.stringify({
          planId: selectedPlan,
          emailOrId,
          returnUrl,
          cancelUrl,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(getPaymentErrorMessage(response, data, null));
        return;
      }

      if (data.confirmationUrl && data.paymentId) {
        try {
          sessionStorage.setItem('runa_payment_id', data.paymentId);
        } catch (_) {}
        window.location.href = data.confirmationUrl;
        return;
      }
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
        return;
      }
      setError('Сервер не вернул ссылку на оплату. Попробуйте снова или обратитесь в поддержку.');
    } catch (err) {
      setError(getPaymentErrorMessage(null, {}, err));
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

          <div className="pricing-plans">
            <h3>Выберите тариф</h3>
            <div className="plans-grid">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`plan-card ${plan.recommended ? 'plan-card-recommended' : ''} ${plan.best ? 'plan-card-best' : ''} ${selectedPlan === plan.id ? 'plan-card-selected' : ''}`}
                  onClick={() => {
                    if (isMobile && selectedPlan === plan.id) {
                      setSelectedPlan('');
                    } else {
                      setSelectedPlan(plan.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (isMobile && selectedPlan === plan.id) setSelectedPlan('');
                      else setSelectedPlan(plan.id);
                    }
                  }}
                  aria-label={selectedPlan === plan.id && isMobile ? `Снять выбор тарифа ${plan.duration}` : `Выбрать тариф ${plan.duration}`}
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

          <div className="payment-methods">
            <h3>Способы оплаты</h3>
            <div className="payment-icons">
              <span className="payment-icon">СБП</span>
              <span className="payment-icon">МИР</span>
              <span className="payment-icon">T-Pay</span>
              <span className="payment-icon">Сбер Pay</span>
              <span className="payment-icon">Мир Pay</span>
              <span className="payment-icon">ЮMoney</span>
            </div>
          </div>

          <div className="pricing-cta">
            <p className="pricing-note">
              Здесь вы официально можете получить подписку R<span className="logo-u">U</span>NA Premium.
              Все платежи защищены и обрабатываются безопасно через ЮKassa.
            </p>
            <button
              className="btn-subscribe btn-subscribe-desktop"
              onClick={handleOpenForm}
              disabled={loading}
            >
              Оформить подписку
            </button>
            <p className="pricing-disclaimer">
              При оформлении подписки применяются условия использования.
              Подписка активируется в приложении после успешной оплаты (обычно в течение минуты).
            </p>
          </div>
        </div>
      </main>

      {/* Только для мобилки: прилипающая кнопка внизу, появляется при выборе тарифа */}
      <div className={`mobile-cta-bar ${selectedPlan ? 'mobile-cta-bar-visible' : ''}`} aria-hidden="true">
        <button
          type="button"
          className="btn-subscribe btn-subscribe-mobile"
          onClick={handleOpenForm}
          disabled={loading}
        >
          Оформить подписку
        </button>
      </div>

      {/* Модальное окно: Email/ID и переход к оплате в ЮKassa */}
      {showForm && (
        <div className="modal-overlay" onClick={() => !loading && setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <h3 className="modal-title">Данные для подписки</h3>
              <p className="modal-subtitle">
                Тариф: {plans.find((p) => p.id === selectedPlan)?.duration}. Укажите Email и ID аккаунта из профиля в приложении.
              </p>
              <div className="modal-rules">
                <strong>Правила оплаты:</strong> Вводите точные данные — почту и ID, указанные в вашем профиле в приложении. Если указать их с ошибкой, платёж может уйти на другой аккаунт, и вернуть средства будет сложно.
              </div>
              <div className="modal-fields">
              <input
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                className="modal-input"
                disabled={loading}
                aria-required="true"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="ID аккаунта из приложения *"
                value={accountId}
                onChange={(e) => { setAccountId(e.target.value); setError(null); }}
                className="modal-input"
                disabled={loading}
                aria-required="true"
              />
              <input
                type="text"
                placeholder="Промокод (необязательно)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="modal-input modal-input-promo"
                disabled={loading}
              />
            </div>
              {error && (
                <p className="modal-error" role="alert">
                  {error}
                </p>
              )}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-modal-cancel" onClick={() => !loading && setShowForm(false)} disabled={loading}>
                Отмена
              </button>
              <button
                type="button"
                className="btn-modal-demo"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? 'Переход к оплате...' : 'Перейти к оплате'}
              </button>
            </div>
          </div>
        </div>
      )}

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
          <p className="footer-fio">Попков Фёдор Анатольевич</p>
          <p className="footer-inn">ИНН: 660609610617</p>
        </div>
      </footer>
    </div>
  );
};

export default PremiumView;
