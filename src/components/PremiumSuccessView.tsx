import React from 'react';
import Header from './Header';
import './PremiumView.css';

const PremiumSuccessView: React.FC = () => (
  <div className="premium-view">
    <Header showOnMobile={true} />
    <main className="premium-content">
      <div className="pricing-container" style={{ maxWidth: 560, margin: '2rem auto', textAlign: 'center' }}>
        <div className="pricing-header">
          <h2>Оплата прошла успешно</h2>
          <p className="pricing-intro">
            Спасибо за оплату. Подписка R<span className="logo-u">U</span>NA Premium будет активирована в приложении в течение минуты.
            Обновите экран профиля или перезайдите в приложение.
          </p>
        </div>
        <a href="/premium" className="btn-subscribe" style={{ display: 'inline-block', marginTop: '1rem' }}>
          Вернуться к тарифам
        </a>
      </div>
    </main>
  </div>
);

export default PremiumSuccessView;
