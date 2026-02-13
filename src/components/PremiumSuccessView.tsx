import React, { useEffect, useState } from 'react';
import Header from './Header';
import { API_CONFIG } from '../config/api.config';
import './PremiumView.css';

type Status = 'loading' | 'granted' | 'not_granted' | 'error';

const PremiumSuccessView: React.FC = () => {
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    let paymentId: string | null = null;
    try {
      paymentId = sessionStorage.getItem('runa_payment_id');
    } catch (_) {
      // ignore
    }
    const params = new URLSearchParams(window.location.search);
    paymentId = paymentId || params.get('paymentId') || params.get('orderId');

    if (!paymentId) {
      setStatus('not_granted');
      setMessage('Подписка активируется по данным оплаты. Если статус не обновился, откройте приложение и обновите профиль или напишите в поддержку.');
      return;
    }

    const run = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS_CONFIRM_RETURN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Runa-Site-Key': API_CONFIG.SITE_KEY,
          },
          body: JSON.stringify({ paymentId }),
        });
        const data = await response.json().catch(() => ({}));
        try {
          sessionStorage.removeItem('runa_payment_id');
        } catch (_) {}

        if (response.ok && data.granted) {
          setStatus('granted');
          setMessage('');
          return;
        }
        setStatus('not_granted');
        setMessage(data.message || 'Оплата получена. Подписка будет активирована в течение минуты. Обновите приложение.');
      } catch (_) {
        try {
          sessionStorage.removeItem('runa_payment_id');
        } catch (_) {}
        setStatus('error');
        setMessage('Не удалось проверить оплату. Откройте приложение — подписка может уже быть активна. Если нет, обратитесь в поддержку.');
      }
    };

    run();
  }, []);

  return (
    <div className="premium-view">
      <Header showOnMobile={true} />
      <main className="premium-content">
        <div className="pricing-container" style={{ maxWidth: 560, margin: '2rem auto', textAlign: 'center' }}>
          <div className="pricing-header">
            <h2>Оплата прошла успешно</h2>
            {status === 'loading' && (
              <p className="pricing-intro">Проверяем оплату и активируем подписку…</p>
            )}
            {status === 'granted' && (
              <p className="pricing-intro">
                Подписка R<span className="logo-u">U</span>NA Premium активирована. Откройте приложение — статус «Премиум» уже действует.
              </p>
            )}
            {(status === 'not_granted' || status === 'error') && (
              <p className="pricing-intro">
                {message || 'Подписка будет активирована в приложении в течение минуты. Обновите экран профиля или перезайдите в приложение.'}
              </p>
            )}
          </div>
          <a href="/premium" className="btn-subscribe" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Вернуться к тарифам
          </a>
        </div>
      </main>
    </div>
  );
};

export default PremiumSuccessView;
