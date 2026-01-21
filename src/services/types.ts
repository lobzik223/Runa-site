/**
 * Типы данных для работы с API
 */

/**
 * Базовый тип ответа API
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * Тип для пагинации
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Примеры типов для будущих данных
 * (расширить по мере подключения бэкенда)
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatarUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  logoUrl?: string;
}
