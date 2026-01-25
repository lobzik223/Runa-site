import React from 'react';
import './LoadingView.css';
import logo from './images/runalogo.png';

interface LoadingViewProps {
  isLoading: boolean;
}

const LoadingView: React.FC<LoadingViewProps> = ({ isLoading }) => {
  // Всегда рендерим LoadingView если isLoading = true
  if (!isLoading) return null;

  console.log('LoadingView рендерится, isLoading:', isLoading);

  return (
    <div className="loading-view" style={{ display: 'flex' }}>
      <div className="loading-content">
        <div className="loading-logo-container">
          <img src={logo} alt="RUNA" className="loading-logo" />
        </div>
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">Загрузка...</p>
      </div>
    </div>
  );
};

export default LoadingView;
