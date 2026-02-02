import React from 'react';
import Header from './Header';
import logoImage from './images/runalogo.png';
import './UserAgreementView.css';

const UserAgreementView: React.FC = () => {
  return (
    <div className="user-agreement-view">
      <Header showOnMobile={true} />
      <main className="user-agreement-content">
        <div className="user-agreement-container">
          <div className="user-agreement-header">
            <h1>ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ</h1>
            <p className="user-agreement-subtitle">сайта R<span className="logo-u">U</span>NA</p>
            <p className="user-agreement-date">Дата вступления в силу: 25.01.2026</p>
          </div>

          <div className="user-agreement-intro">
            <p>
              Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между Оператором и Пользователем при использовании сайта R<span className="logo-u">U</span>NA.
            </p>
            <p>
              Используя Сайт, Пользователь подтверждает, что ознакомился, понял и полностью согласен с условиями настоящего Соглашения.
            </p>
          </div>

          <div className="user-agreement-section">
            <h2>1. Общие положения</h2>
            
            <p><strong>1.1.</strong> Сайт R<span className="logo-u">U</span>NA предоставляет информацию о сервисе, а также возможность оплаты подписки на мобильное приложение R<span className="logo-u">U</span>NA.</p>
            
            <p><strong>1.2.</strong> Оператор — самозанятый, осуществляющий управление и поддержку Сайта.</p>
            <p>Попков Фёдор Анатольевич</p>
            <p>ИНН: 660609610617</p>
            <p>Контактный email: <a href="mailto:runa.fintech@bk.ru" className="agreement-link">runa.fintech@bk.ru</a></p>
            
            <p><strong>1.3.</strong> Сайт не является банком, брокером, инвестиционным консультантом или финансовой организацией.</p>
            
            <p><strong>1.4.</strong> Настоящее Соглашение является публичной офертой в соответствии с законодательством Российской Федерации.</p>
          </div>

          <div className="user-agreement-section">
            <h2>2. Территория и возрастные ограничения</h2>
            
            <p><strong>2.1.</strong> Сайт предназначен исключительно для пользователей, находящихся на территории Российской Федерации.</p>
            
            <p><strong>2.2.</strong> Использование Сайта допускается лицами старше 16 лет.</p>
            
            <p><strong>2.3.</strong> Использование Сайта лицами младше установленного возраста запрещено.</p>
          </div>

          <div className="user-agreement-section">
            <h2>3. Оплата подписки</h2>
            
            <p><strong>3.1.</strong> На Сайте предоставляется возможность оплаты подписки на мобильное приложение R<span className="logo-u">U</span>NA через платёжный сервис Robokassa.</p>
            
            <p><strong>3.2.</strong> Варианты подписки:</p>
            <ul>
              <li>1 месяц — 400 рублей;</li>
              <li>6 месяцев — 1800 рублей;</li>
              <li>12 месяцев — 2500 рублей.</li>
            </ul>
            
            <p><strong>3.3.</strong> Оплата осуществляется через Robokassa. Сайт не хранит и не обрабатывает данные банковских карт Пользователя.</p>
            
            <p><strong>3.4.</strong> Возврат денежных средств осуществляется в порядке, предусмотренном законодательством Российской Федерации.</p>
          </div>

          <div className="user-agreement-section">
            <h2>4. Ответственность Пользователя</h2>
            
            <p><strong>4.1.</strong> Пользователь обязуется:</p>
            <ul>
              <li>предоставлять достоверные данные при оплате;</li>
              <li>не использовать Сайт в целях, противоречащих законодательству РФ;</li>
              <li>не предпринимать действий, нарушающих работоспособность Сайта.</li>
            </ul>
          </div>

          <div className="user-agreement-section">
            <h2>5. Ограничение ответственности</h2>
            
            <p><strong>5.1.</strong> Оператор не несет ответственности за:</p>
            <ul>
              <li>финансовые последствия оплаты подписки;</li>
              <li>убытки или упущенную выгоду Пользователя;</li>
              <li>технические сбои платежной системы, находящейся под управлением Robokassa.</li>
            </ul>
            
            <p><strong>5.2.</strong> Сайт предоставляется на принципе «как есть» (as is).</p>
          </div>

          <div className="user-agreement-section">
            <h2>6. Изменение условий</h2>
            
            <p><strong>6.1.</strong> Оператор вправе изменять настоящее Соглашение в любое время.</p>
            
            <p><strong>6.2.</strong> Новая редакция вступает в силу с момента публикации на Сайте.</p>
            
            <p><strong>6.3.</strong> Продолжение использования Сайта после внесения изменений означает согласие Пользователя с новой редакцией Соглашения.</p>
          </div>

          <div className="user-agreement-section">
            <h2>7. Заключительные положения</h2>
            
            <p><strong>7.1.</strong> Все споры и разногласия подлежат разрешению в соответствии с законодательством Российской Федерации.</p>
            
            <p><strong>7.2.</strong> Досудебный порядок урегулирования споров является обязательным.</p>
            
            <p><strong>7.3.</strong> По всем вопросам Пользователь может обратиться по адресу: <a href="mailto:runa.fintech@bk.ru" className="agreement-link">runa.fintech@bk.ru</a></p>
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
          <p className="footer-fio">Попков Фёдор Анатольевич</p>
          <p className="footer-inn">ИНН: 660609610617</p>
        </div>
      </footer>
    </div>
  );
};

export default UserAgreementView;
