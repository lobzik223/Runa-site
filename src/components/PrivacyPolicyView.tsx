import React from 'react';
import Header from './Header';
import logoImage from './images/runalogo.png';
import { getLang, t } from '../i18n';
import './PrivacyPolicyView.css';

const CONTACT_EMAIL = 'runa.fintech@bk.ru';

const PrivacyPolicyView: React.FC = () => {
  const isEn = getLang() === 'en';

  return (
    <div className="privacy-policy-view">
      <Header showOnMobile={true} />
      <main className="privacy-policy-content">
        <div className="privacy-policy-container">
          <div className="privacy-policy-header">
            <h1>{t('privacy.title')}</h1>
            <p className="privacy-policy-date">{t('privacy.effectiveDate')}</p>
            <p className="privacy-lang-switch">
              {isEn ? (
                <>
                  <a href="/privacy" className="privacy-link">{t('privacy.langRu')}</a>
                  <span className="privacy-lang-sep"> | </span>
                  <strong>{t('privacy.langEn')}</strong>
                </>
              ) : (
                <>
                  <strong>{t('privacy.langRu')}</strong>
                  <span className="privacy-lang-sep"> | </span>
                  <a href="/privacy-en" className="privacy-link">{t('privacy.langEn')}</a>
                </>
              )}
            </p>
          </div>

          <div className="privacy-policy-section">
            <h2>{t('privacy.s1Title')}</h2>
            <p><strong>1.1.</strong> {t('privacy.s1_1')}</p>
            <p><strong>1.2.</strong> {t('privacy.s1_2')}</p>
            <p><strong>1.3.</strong> {t('privacy.s1_3')}<a href={`mailto:${CONTACT_EMAIL}`} className="privacy-link">{CONTACT_EMAIL}</a>.</p>
            <p><strong>1.4.</strong> {t('privacy.s1_4')}</p>
            <p><strong>1.5.</strong> {t('privacy.s1_5')}</p>
            <p><strong>1.6.</strong> {t('privacy.s1_6')}</p>
          </div>

          <div className="privacy-policy-section">
            <h2>{t('privacy.s2Title')}</h2>
            <p><strong>2.1.</strong> {t('privacy.s2_1')}</p>
            <p><strong>2.2.</strong> {t('privacy.s2_2')}</p>
            <p><strong>2.3.</strong> {t('privacy.s2_3')}</p>
            <p><strong>2.4.</strong> {t('privacy.s2_4')}</p>
          </div>

          <div className="privacy-policy-section">
            <h2>{t('privacy.s3Title')}</h2>
            <p><strong>3.1.</strong> {t('privacy.s3_1')}</p>
            <ul>
              <li><strong>{t('privacy.s3CameraLabel')}</strong> — {t('privacy.s3CameraText')}</li>
              <li><strong>{t('privacy.s3PhotosLabel')}</strong> — {t('privacy.s3PhotosText')}</li>
              <li><strong>{t('privacy.s3NotificationsLabel')}</strong> — {t('privacy.s3NotificationsText')}</li>
            </ul>
            <p><strong>3.2.</strong> {t('privacy.s3_2')}</p>
          </div>

          <div className="privacy-policy-section">
            <h2>{t('privacy.s4Title')}</h2>
            <p><strong>4.1.</strong> {t('privacy.s4_1')}</p>
            <p><strong>4.2.</strong> {t('privacy.s4_2')}</p>
            <p><strong>4.3.</strong> {t('privacy.s4_3')}</p>
          </div>

          <div className="privacy-policy-section">
            <h2>{t('privacy.s5Title')}</h2>
            <p><strong>5.1.</strong> {t('privacy.s5_1')}</p>
            <p><strong>5.2.</strong> {t('privacy.s5_2')}</p>
          </div>

          <div className="privacy-policy-section">
            <h2>{t('privacy.s6Title')}</h2>
            <p><strong>6.1.</strong> {t('privacy.s6_1')}</p>
            <p><strong>6.2.</strong> {t('privacy.s6_2')}</p>
          </div>

          <div className="privacy-policy-section">
            <h2>{t('privacy.s7Title')}</h2>
            <p><strong>7.1.</strong> {t('privacy.s7_1')}</p>
          </div>

          <div className="privacy-policy-section">
            <h2>{t('privacy.s8Title')}</h2>
            <p><strong>8.1.</strong> {t('privacy.s8_1')}</p>
            <p><strong>8.2.</strong> {t('privacy.s8_2')}</p>
          </div>

          <div className="privacy-policy-section">
            <h2>{t('privacy.s9Title')}</h2>
            <p><strong>9.1.</strong> {t('privacy.s9_1')}</p>
            <p><strong>9.2.</strong> {t('privacy.s9_2')}</p>
          </div>

          <div className="privacy-policy-section">
            <h2>{t('privacy.s10Title')}</h2>
            <p><strong>10.1.</strong> {t('privacy.s10_1')}</p>
            <p><strong>10.2.</strong> {t('privacy.s10_2')}</p>
            <p><strong>10.3.</strong> {t('privacy.s10_3')}<a href={`mailto:${CONTACT_EMAIL}`} className="privacy-link">{CONTACT_EMAIL}</a>{t('privacy.s10_3DataProtection')}</p>
          </div>
        </div>
      </main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>{t('privacy.footerContact')}</h4>
            <div className="footer-contacts">
              <p>
                <span className="footer-label">{t('privacy.footerEmail')}</span>{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">{CONTACT_EMAIL}</a>
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
            <h5>{t('privacy.footerLinks')}</h5>
            <ul>
              <li><a href="https://t.me/RUNAfinance" target="_blank" rel="noopener noreferrer" className="footer-link">Telegram</a></li>
              <li><a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">Email</a></li>
              <li><a href="/privacy" className="footer-link">{t('privacy.footerPrivacyRu')}</a></li>
              <li><a href="/privacy-en" className="footer-link">{t('privacy.footerPrivacyEn')}</a></li>
              <li><a href="/user-agreement" className="footer-link">{t('privacy.footerUserAgreement')}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-note">© R<span className="logo-u">U</span>NA Finance — {t('privacy.footerTagline')}</p>
          <p className="footer-fio">{t('privacy.footerFio')}</p>
          <p className="footer-inn">ИНН: 660609610617</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyView;
