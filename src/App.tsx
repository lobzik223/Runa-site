import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoadingView from './components/LoadingView';
import './App.css';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const introSectionRef = useRef<HTMLElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  const problems = [
    {
      title: 'Потери бюджета',
      desc: 'Без контроля бюджета вы теряете в среднем 7 500 ₽ в месяц.',
      image: '/mov/potera.png',
      alt: 'Потери бюджета'
    },
    {
      title: 'Импульсивные траты',
      desc: 'Потраченные впустую деньги на импульсивные покупки и забытые подписки.',
      image: '/mov/q1.png',
      alt: 'Импульсивные траты'
    },
    {
      title: 'Незнание о расходах',
      desc: '72% россиян не знают, куда уходят их деньги.',
      image: '/mov/q2.png',
      alt: 'Незнание о расходах'
    },
    {
      title: 'Перерасход',
      desc: 'Каждый второй тратит больше, чем планировал.',
      image: '/mov/q3.png',
      alt: 'Перерасход'
    }
  ];

  const nextProblem = () => {
    setCurrentProblemIndex((prev) => (prev + 1) % problems.length);
  };

  const prevProblem = () => {
    setCurrentProblemIndex((prev) => (prev - 1 + problems.length) % problems.length);
  };

  // Поддержка свайпа для мобильной версии
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Свайп влево - следующая карточка
      nextProblem();
    } else if (distance < -minSwipeDistance) {
      // Свайп вправо - предыдущая карточка
      prevProblem();
    }
    
    // Сброс значений
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleVideoLoaded = () => {
    // Минимальная задержка для плавного перехода (уменьшено для быстрой загрузки)
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  // Таймаут безопасности - показываем сайт максимум через 2 секунды
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Принудительное скрытие загрузочного экрана по таймауту');
        setIsLoading(false);
      }
    }, 2000);

    return () => clearTimeout(safetyTimeout);
  }, [isLoading]);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const observerOptions = {
      threshold: isMobile ? 0.1 : 0.15,
      rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elements = [introTextRef.current, widgetRef.current].filter(Boolean) as Element[];
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="app">
      <LoadingView isLoading={isLoading} />
      <Header />
      <HeroSection onVideoLoaded={handleVideoLoaded} />
      <main className="page-content">
        <section className="runa-intro-features" id="about-runa" ref={introSectionRef}>
          <div className="eyebrow-widget">
            <p className="eyebrow">Что такое R<span className="logo-u">U</span>NA</p>
          </div>
          <div className="runa-intro" ref={introTextRef}>
            <div className="runa-intro-content">
              <h2>Умный финансовый помощник, созданный для вас</h2>
              <p className="description">
                R<span className="logo-u">U</span>NA — интеллектуальный финансовый инструмент для полного контроля ваших денег. 
                Отслеживайте доходы и расходы, анализируйте привычки и получайте персональные рекомендации 
                по оптимизации бюджета.
              </p>
            </div>
            <div className="runa-intro-logo-mobile">
              <img src="/mov/analitiklogo.png" alt="RUNA Analytics" className="analytics-logo-mobile" />
            </div>
          </div>
          <div className="feature-column" ref={widgetRef}>
            <aside className="feature-advantages">
              <div className="advantages-image">
                <img src="/mov/analitiklogo.png" alt="RUNA Analytics" className="analytics-logo" />
              </div>
            </aside>
          </div>
        </section>

        <section className="runa-problems" id="problems">
          <div className="eyebrow-widget">
            <p className="eyebrow">Проблемы и потери</p>
          </div>
          <h2>Что теряют люди без контроля</h2>
          <p className="runa-problems-desc">
            Без контроля бюджета и привычек вы теряете деньги каждый месяц. 
            Узнайте, какие потери можно избежать с R<span className="logo-u">U</span>NA.
          </p>
          <div className="problem-grid">
            {/* Desktop версия - все карточки */}
            {problems.map((problem, index) => {
              let gridClass = '';
              // Позиционирование карточек на ПК:
              // index 0: "Потери бюджета" - колонка 1, строка 1
              // index 1: "Импульсивные траты" - колонка 2, строка 1
              // index 2: "Незнание о расходах" - колонка 2, строка 2 (под "Импульсивные траты")
              // index 3: "Перерасход" - колонка 3, строка 2 (правый угол)
              if (index === 0) {
                gridClass = 'problem-card-pos-1-1';
              } else if (index === 1) {
                gridClass = 'problem-card-pos-2-1';
              } else if (index === 2) {
                gridClass = 'problem-card-pos-2-2';
              } else if (index === 3) {
                gridClass = 'problem-card-pos-3-2';
              }
              
              return (
                <article key={index} className={`problem-card problem-card-with-image problem-card-desktop ${gridClass}`}>
                  <div className="problem-card-text">
                    <h3 className="problem-card-title">{problem.title}</h3>
                    <p className="problem-card-desc">{problem.desc}</p>
                  </div>
                  <div className="problem-card-image">
                    <img src={problem.image} alt={problem.alt} />
                  </div>
                </article>
              );
            })}
            
            {/* Mobile версия - карусель */}
            <div className="problem-carousel-mobile">
              <button 
                className="carousel-btn carousel-btn-prev" 
                onClick={prevProblem}
                aria-label="Предыдущая карточка"
              >
                ←
              </button>
              <div 
                className="problem-carousel-container"
                ref={carouselRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="problem-carousel-track"
                  style={{ transform: `translateX(-${currentProblemIndex * 100}%)` }}
                >
                  {problems.map((problem, index) => (
                    <article key={index} className="problem-card problem-card-with-image problem-card-mobile">
                      <div className="problem-card-text">
                        <h3 className="problem-card-title">{problem.title}</h3>
                        <p className="problem-card-desc">{problem.desc}</p>
                      </div>
                      <div className="problem-card-image">
                        <img src={problem.image} alt={problem.alt} />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <button 
                className="carousel-btn carousel-btn-next" 
                onClick={nextProblem}
                aria-label="Следующая карточка"
              >
                →
              </button>
              <div className="carousel-indicators">
                {problems.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-indicator ${index === currentProblemIndex ? 'active' : ''}`}
                    onClick={() => setCurrentProblemIndex(index)}
                    aria-label={`Перейти к карточке ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="runa-pricing" id="pricing">
          <div className="pricing-card">
            <h2>Попробуй R<span className="logo-u">U</span>NA бесплатно</h2>
            <p>Бесплатный доступ на 3 дня. После — подписка всего X ₽/мес.</p>
            <div className="pricing-actions">
              <button className="btn primary">Попробовать бесплатно</button>
              <button className="btn secondary">Купить подписку</button>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>Контакты</h4>
            <p>Телефон / Email / Telegram</p>
          </div>
          <div>
            <h5>Ссылки</h5>
            <ul>
              <li>Telegram</li>
              <li>Email</li>
              <li>Политика конфиденциальности</li>
              <li>Пользовательское соглашение</li>
            </ul>
          </div>
        </div>
        <p className="footer-note">© R<span className="logo-u">U</span>NA Finance — Ваша уверенность в деньгах</p>
      </footer>
    </div>
  );
};

export default App;
