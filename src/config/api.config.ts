/**
 * Конфигурация API
 * Настройки для подключения к бэкенду
 */

export const API_CONFIG = {
  // Базовый URL API (изменить при подключении реального бэкенда)
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  
  // Таймаут запросов (в миллисекундах)
  TIMEOUT: 30000,
  
  // Эндпоинты API
  ENDPOINTS: {
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
