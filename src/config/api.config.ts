/**
 * Конфигурация API
 * Настройки для подключения к бэкенду
 */

export const API_CONFIG = {
  // Базовый URL API (изменить при подключении реального бэкенда)
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.runafinance.online/api',
  
  // Ключ для безопасного общения с бэкендом (должен совпадать с SITE_API_KEY на бэкенде)
  SITE_KEY: import.meta.env.VITE_SITE_KEY || 'runa-site-secret-key-change-me-in-prod',

  // Таймаут запросов (в миллисекундах)
  TIMEOUT: 30000,
  
  // Эндпоинты API
  ENDPOINTS: {
    // Платежи (ЮKassa: создание платежа, подписка выдаётся только после успешной оплаты)
    PAYMENTS_CREATE: '/payments/create',
    PAYMENTS_CONFIRM_RETURN: '/payments/confirm-return',
    PAYMENTS_PLANS: '/payments/plans',
    
    // Пользователи
    USERS: '/users',
    USER_BY_ID: (id: string) => `/users/${id}`,
    
    // Проекты
    PROJECTS: '/projects',
    PROJECT_BY_ID: (id: string) => `/projects/${id}`,
    
    // Команда
    TEAM: '/team',
    TEAM_MEMBER_BY_ID: (id: string) => `/team/${id}`,
    
    // Клиенты
    CLIENTS: '/clients',
    CLIENT_BY_ID: (id: string) => `/clients/${id}`,
    
    // Добавить другие эндпоинты по необходимости
  },
} as const;
