import React from 'react';
import Header from './Header';
import './PremiumView.css';

const PremiumCancelView: React.FC = () => (
  <div className="premium-view">
    <Header showOnMobile={true} />
    <main className="premium-content">
      <div className="pricing-container" style={{ maxWidth: 560, margin: '2rem auto', textAlign: 'center' }}>
        <div className="pricing-header">
          <h2>Оплата отменена</h2>
          <p className="pricing-intro">
            Вы вернулись с платёжной страницы без оплаты. Если хотите оформить подписку — выберите тариф и попробуйте снова.
          </p>
        </div>
        <a href="/premium" className="btn-subscribe" style={{ display: 'inline-block', marginTop: '1rem' }}>
          Вернуться к тарифам
        </a>
      </div>
    </main>
  </div>
);

export default PremiumCancelView;
