import RunaLogo from './RunaLogo';
import './SiteFooter.css';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-panel">
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
            <RunaLogo width={140} height={36} variant="header" className="footer-logo" />
          </div>
          <div>
            <h5>Ссылки</h5>
            <ul>
              <li><a href="/#features" className="footer-link">О приложении</a></li>
              <li><a href="/#faq" className="footer-link">FAQ</a></li>
              <li><a href="/#support" className="footer-link">Оставить тикет</a></li>
              <li><a href="/#download" className="footer-link">Скачать</a></li>
              <li><a href="/premium" className="footer-link">Подписка Premium</a></li>
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
      </div>
    </footer>
  );
}
