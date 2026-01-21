import React from 'react';
import './Header.css';
import logoImage from './images/runalogo.png';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img src={logoImage} alt="RUNA Finance" className="logo-image" />
        </div>
        
        <nav className="header-nav">
          <a href="#home" className="nav-link">Home</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#team" className="nav-link">Team</a>
          <a href="#clients" className="nav-link">Clients</a>
          <a href="#about" className="nav-link">About</a>
        </nav>
        
        <button className="header-download-btn">Скачать</button>
      </div>
    </header>
  );
};

export default Header;
