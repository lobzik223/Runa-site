import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <HeroSection />
    </div>
  );
};

export default App;
