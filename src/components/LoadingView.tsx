import React from 'react';
import './LoadingView.css';
import RunaLogo from './RunaLogo';

interface LoadingViewProps {
  isLoading: boolean;
}

const LoadingView: React.FC<LoadingViewProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-view">
      <div className="loading-content">
        <RunaLogo width={160} height={40} variant="light" className="loading-logo-svg" />
        <div className="loading-spinner">
          <div className="spinner-ring" />
          <div className="spinner-ring" />
          <div className="spinner-ring" />
        </div>
      </div>
    </div>
  );
};

export default LoadingView;
