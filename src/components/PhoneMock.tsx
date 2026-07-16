import './PhoneMock.css';

type PhoneMockProps = {
  variant?: 'main' | 'banking';
};

export default function PhoneMock({ variant = 'main' }: PhoneMockProps) {
  return (
    <div className="phone-mock" aria-hidden="true">
      <div className="phone-mock-bezel">
        <div className="phone-mock-notch" />
        <div className="phone-mock-screen">
          <div className="phone-mock-header">
            <span className="phone-mock-logo-dot" />
            <span>RUNA</span>
          </div>
          {variant === 'main' ? (
            <>
              <div className="phone-mock-balance">128 450 ₽</div>
              <div className="phone-mock-sub">Баланс за месяц</div>
              <div className="phone-mock-row">
                <div className="phone-mock-chip income">+42 000</div>
                <div className="phone-mock-chip expense">−28 150</div>
              </div>
              <div className="phone-mock-bars">
                <div className="phone-mock-bar" style={{ height: '45%' }} />
                <div className="phone-mock-bar" style={{ height: '70%' }} />
                <div className="phone-mock-bar" style={{ height: '55%' }} />
                <div className="phone-mock-bar" style={{ height: '90%' }} />
                <div className="phone-mock-bar" style={{ height: '60%' }} />
              </div>
            </>
          ) : (
            <>
              <div className="phone-mock-tabs">
                <span className="active">Кредиты</span>
                <span>Вклады</span>
              </div>
              <div className="phone-mock-card-item">
                <span>Ипотека</span>
                <strong>342 000 ₽</strong>
              </div>
              <div className="phone-mock-card-item">
                <span>Вклад «Накопления»</span>
                <strong className="green">+18 200 ₽</strong>
              </div>
              <div className="phone-mock-progress">
                <div className="phone-mock-progress-fill" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
