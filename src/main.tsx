import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PremiumView from './components/PremiumView';
import PrivacyPolicyView from './components/PrivacyPolicyView';
import UserAgreementView from './components/UserAgreementView';
import './index.css';

// Простой роутинг на основе пути
const Root: React.FC = () => {
  const path = window.location.pathname;
  
  if (path === '/premium' || path === '/premium/') {
    return <PremiumView />;
  }
  
  if (path === '/privacy' || path === '/privacy-policy' || path === '/privacy/') {
    return <PrivacyPolicyView />;
  }
  
  if (path === '/user-agreement' || path === '/user-agreement/' || path === '/agreement') {
    return <UserAgreementView />;
  }
  
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
