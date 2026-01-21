/**
 * API Service для работы с бэкендом
 * Централизованное управление всеми запросами к API
 */

// Базовый URL API (настроить после подключения бэкенда)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Базовый класс для работы с API
 */
class ApiService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Базовый метод для выполнения HTTP запросов
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * POST запрос
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT запрос
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE запрос
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Экспортируем единый экземпляр API сервиса
export const api = new ApiService(API_BASE_URL);

/**
 * Примеры использования (раскомментировать после подключения бэкенда):
 * 
 * // Получить данные
 * const data = await api.get('/users');
 * 
 * // Отправить данные
 * const newUser = await api.post('/users', { name: 'John' });
 * 
 * // Обновить данные
 * const updated = await api.put('/users/1', { name: 'Jane' });
 * 
 * // Удалить данные
 * await api.delete('/users/1');
 */
