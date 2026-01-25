import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoadingView from './components/LoadingView';
import './App.css';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [showHeader, setShowHeader] = useState(false);
  const introSectionRef = useRef<HTMLElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const problemsSectionRef = useRef<HTMLElement>(null);
  const whySectionRef = useRef<HTMLElement>(null);
  const appPreviewRef = useRef<HTMLElement>(null);
  const creditsSectionRef = useRef<HTMLElement>(null);
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

  // Отслеживание прокрутки мимо hero section для показа header на мобильной версии
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile || !heroSectionRef.current) {
      setShowHeader(true); // На ПК всегда показываем header
      return;
    }

    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Когда hero section полностью выходит из viewport, показываем header
          if (!entry.isIntersecting) {
            setShowHeader(true);
          } else {
            setShowHeader(false);
          }
        });
      },
      {
        threshold: 0, // Срабатывает когда hero section полностью выходит из viewport
        rootMargin: '0px'
      }
    );

    heroObserver.observe(heroSectionRef.current);

    return () => {
      heroObserver.disconnect();
    };
  }, []);

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

    const elements = [
      introTextRef.current, 
      widgetRef.current,
      problemsSectionRef.current,
      appPreviewRef.current,
      whySectionRef.current,
      creditsSectionRef.current
    ].filter(Boolean) as Element[];
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="app">
      <LoadingView isLoading={isLoading} />
      <Header showOnMobile={showHeader} />
      <HeroSection onVideoLoaded={handleVideoLoaded} ref={heroSectionRef} />
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
              <p className="description-mobile-logo">
                R<span className="logo-u">U</span>NA — интеллектуальный финансовый инструмент для полного контроля ваших денег. 
                Отслеживайте доходы и расходы, анализируйте привычки и получайте персональные рекомендации 
                по оптимизации бюджета.
              </p>
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

        <section className="runa-problems" id="problems" ref={problemsSectionRef}>
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
              // index 2: "Незнание о расходах" - колонка 1, строка 2 (под "Потери бюджета")
              // index 3: "Перерасход" - колонка 2, строка 2 (под "Импульсивные траты")
              if (index === 0) {
                gridClass = 'problem-card-pos-1-1';
              } else if (index === 1) {
                gridClass = 'problem-card-pos-2-1';
              } else if (index === 2) {
                gridClass = 'problem-card-pos-1-2';
              } else if (index === 3) {
                gridClass = 'problem-card-pos-2-2';
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

        <section className="runa-app-preview" id="app-preview" ref={appPreviewRef}>
          <div className="eyebrow-widget">
            <p className="eyebrow">Как мы выглядим</p>
          </div>
          <h2>R<span className="logo-u">U</span>NA — это ваш персональный финансовый помощник</h2>
          <p className="app-preview-desc">
            Удобный интерфейс, умная аналитика и AI-консультант в одном приложении. 
            Управляйте финансами легко и эффективно.
          </p>
          <div className="app-preview-container">
            <div className="app-preview-image">
              <img src="/mov/phone1.png" alt="Приложение RUNA на телефоне" className="app-phone-image" />
            </div>
            <div className="app-preview-features">
              <div className="app-feature-item">
                <div className="app-feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="48" height="48" rx="12" fill="rgba(37, 53, 80, 0.1)"/>
                    <path d="M12 32V28H16V32H12ZM12 24V20H20V24H12ZM12 16V12H24V16H12ZM28 32V28H36V32H28ZM28 24V20H36V24H28ZM28 16V12H36V16H28Z" fill="#253550"/>
                  </svg>
                </div>
                <div className="app-feature-text">
                  <h4>Удобная аналитика</h4>
                  <p>Отслеживайте доходы и расходы в реальном времени с наглядными графиками и статистикой</p>
                </div>
              </div>
              <div className="app-feature-item">
                <div className="app-feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="48" height="48" rx="12" fill="rgba(37, 53, 80, 0.1)"/>
                    <path d="M24 14C20.69 14 18 16.69 18 20C18 23.31 20.69 26 24 26C27.31 26 30 23.31 30 20C30 16.69 27.31 14 24 14ZM24 24C22.35 24 21 22.65 21 21C21 19.35 22.35 18 24 18C25.65 18 27 19.35 27 21C27 22.65 25.65 24 24 24Z" fill="#253550"/>
                    <path d="M24 28C18.48 28 14 32.48 14 38H16C16 33.58 19.58 30 24 30C28.42 30 32 33.58 32 38H34C34 32.48 29.52 28 24 28Z" fill="#253550"/>
                    <circle cx="32" cy="18" r="3" fill="#CD6F42"/>
                    <path d="M35 18C35 19.66 33.66 21 32 21C30.34 21 29 19.66 29 18C29 16.34 30.34 15 32 15C33.66 15 35 16.34 35 18Z" fill="#CD6F42"/>
                  </svg>
                </div>
                <div className="app-feature-text">
                  <h4>Чат с ИИ</h4>
                  <p>Получайте персональные советы и анализ ваших финансовых привычек от искусственного интеллекта</p>
                </div>
              </div>
              <div className="app-feature-item">
                <div className="app-feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="48" height="48" rx="12" fill="rgba(37, 53, 80, 0.1)"/>
                    <rect x="10" y="16" width="28" height="20" rx="3" fill="none" stroke="#253550" strokeWidth="2"/>
                    <rect x="10" y="20" width="28" height="3" fill="#253550"/>
                    <circle cx="36" cy="24" r="2" fill="#CD6F42"/>
                  </svg>
                </div>
                <div className="app-feature-text">
                  <h4>Быстрый ввод</h4>
                  <p>Добавляйте транзакции за секунды с автоматической категоризацией и выбором способа оплаты</p>
                </div>
              </div>
              <div className="app-feature-item">
                <div className="app-feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="48" height="48" rx="12" fill="rgba(37, 53, 80, 0.1)"/>
                    <circle cx="24" cy="24" r="10" fill="none" stroke="#253550" strokeWidth="2"/>
                    <circle cx="24" cy="24" r="4" fill="#CD6F42"/>
                    <path d="M24 14L24 20M24 28L24 34M14 24L20 24M28 24L34 24" stroke="#253550" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="app-feature-text">
                  <h4>Цели и планы</h4>
                  <p>Ставьте финансовые цели и отслеживайте прогресс с помощью встроенных инструментов планирования</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="runa-why" id="why-runa" ref={whySectionRef}>
          <div className="eyebrow-widget">
            <p className="eyebrow">Почему R<span className="logo-u">U</span>NA</p>
          </div>
          <h2>RUNA — это финансовый контроль, который работает за вас, а не требует дисциплины.</h2>
          <p className="runa-why-desc">
            Приложение анализирует ваши расходы, привычки и решения — и помогает тратить осознанно каждый день.
          </p>

          <div className="why-features">
            {/* Контроль без усилий - изображение слева, текст справа */}
            <div className="why-feature why-feature-left">
              <div className="why-feature-image">
                <img src="/mov/control.png" alt="Контроль без усилий" />
              </div>
              <div className="why-feature-content">
                <h3>Контроль без усилий</h3>
                <p>RUNA автоматически показывает, куда уходят деньги, и выделяет лишние траты — без ручного учёта и сложных таблиц.</p>
              </div>
            </div>

            {/* Умные подсказки - текст слева, изображение справа */}
            <div className="why-feature why-feature-right">
              <div className="why-feature-content">
                <h3>Умные подсказки</h3>
                <p>AI анализирует ваши расходы и даёт персональные рекомендации: где можно сэкономить и как улучшить финансовый баланс.</p>
              </div>
              <div className="why-feature-image">
                <img src="/mov/smart.png" alt="Умные подсказки" />
              </div>
            </div>

            {/* Меньше импульса — больше пользы - изображение слева, текст справа */}
            <div className="why-feature why-feature-left">
              <div className="why-feature-image">
                <img src="/mov/minimuminpuls.png" alt="Меньше импульса — больше пользы" />
              </div>
              <div className="why-feature-content">
                <h3>Меньше импульса — больше пользы</h3>
                <p>RUNA помогает замечать импульсивные покупки и подписки до того, как они станут проблемой.</p>
              </div>
            </div>

            {/* Прозрачность и уверенность - текст слева, изображение справа */}
            <div className="why-feature why-feature-right">
              <div className="why-feature-content">
                <h3>Прозрачность и уверенность</h3>
                <p>Вы всегда понимаете своё финансовое состояние и принимаете решения на основе данных, а не ощущений.</p>
              </div>
              <div className="why-feature-image">
                <img src="/mov/glasses.png" alt="Прозрачность и уверенность" />
              </div>
            </div>
          </div>
        </section>

        <section className="runa-credits" id="credits" ref={creditsSectionRef}>
          <div className="eyebrow-widget">
            <p className="eyebrow">Вклады и кредиты</p>
          </div>
          <h2>Контролируйте все ваши финансовые обязательства</h2>
          <p className="credits-desc">
            Отслеживайте кредиты, вклады и платежи в одном месте. Получайте напоминания 
            о предстоящих платежах и всегда знайте свой финансовый статус.
          </p>
          <div className="credits-container">
            <div className="credits-image">
              <img src="/mov/phone2.png" alt="Управление кредитами и вкладами в RUNA" className="credits-phone-image" />
            </div>
            <div className="credits-features">
              <div className="credit-feature-item">
                <div className="credit-feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="48" height="48" rx="12" fill="rgba(37, 53, 80, 0.1)"/>
                    <path d="M24 14C20.69 14 18 16.69 18 20V28C18 31.31 20.69 34 24 34C27.31 34 30 31.31 30 28V20C30 16.69 27.31 14 24 14ZM28 28C28 29.66 26.66 31 25 31C23.34 31 22 29.66 22 28V20C22 18.34 23.34 17 25 17C26.66 17 28 18.34 28 20V28Z" fill="#253550"/>
                    <circle cx="24" cy="38" r="2" fill="#CD6F42"/>
                  </svg>
                </div>
                <div className="credit-feature-text">
                  <h4>Умные напоминания</h4>
                  <p>Получайте уведомления о предстоящих платежах заранее, чтобы не пропустить важные финансовые обязательства</p>
                </div>
              </div>
              <div className="credit-feature-item">
                <div className="credit-feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="48" height="48" rx="12" fill="rgba(37, 53, 80, 0.1)"/>
                    <rect x="12" y="16" width="24" height="20" rx="2" fill="none" stroke="#253550" strokeWidth="2"/>
                    <rect x="12" y="20" width="24" height="3" fill="#253550"/>
                    <path d="M16 28L20 32L32 20" stroke="#CD6F42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="credit-feature-text">
                  <h4>Отслеживание прогресса</h4>
                  <p>Визуализируйте прогресс погашения кредитов с помощью наглядных индикаторов и всегда знайте остаток задолженности</p>
                </div>
              </div>
              <div className="credit-feature-item">
                <div className="credit-feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="48" height="48" rx="12" fill="rgba(37, 53, 80, 0.1)"/>
                    <rect x="10" y="18" width="28" height="18" rx="2" fill="none" stroke="#253550" strokeWidth="2"/>
                    <rect x="10" y="22" width="28" height="2" fill="#253550"/>
                    <rect x="10" y="26" width="20" height="2" fill="#253550"/>
                    <rect x="10" y="30" width="24" height="2" fill="#253550"/>
                    <circle cx="36" cy="28" r="4" fill="#CD6F42"/>
                  </svg>
                </div>
                <div className="credit-feature-text">
                  <h4>Все в одном месте</h4>
                  <p>Управляйте кредитами, вкладами и кредитными картами в едином интерфейсе с удобным переключением между разделами</p>
                </div>
              </div>
              <div className="credit-feature-item">
                <div className="credit-feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="48" height="48" rx="12" fill="rgba(37, 53, 80, 0.1)"/>
                    <path d="M24 14L28 22H36L29 28L32 36L24 30L16 36L19 28L12 22H20L24 14Z" fill="#253550"/>
                    <circle cx="24" cy="24" r="3" fill="#CD6F42"/>
                  </svg>
                </div>
                <div className="credit-feature-text">
                  <h4>Детальная информация</h4>
                  <p>Просматривайте детали каждого кредита: сумму, остаток, следующий платеж и сроки погашения</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="runa-pricing" id="pricing">
          <div className="pricing-card">
            <h2>Попробуй R<span className="logo-u">U</span>NA бесплатно</h2>
            <p>Бесплатный доступ на 3 дня. После — подписка всего от 400 ₽/мес.</p>
            <div className="pricing-actions">
              <a href="/premium" className="btn primary">Оформить подписку</a>
              <button className="btn secondary">Попробовать бесплатно</button>
            </div>
          </div>
        </section>
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
          <p className="footer-inn">ИНН: 660609610617</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
