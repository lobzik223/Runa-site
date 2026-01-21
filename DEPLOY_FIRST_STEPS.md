# Первые шаги деплоя - клонирование в root

## Шаг 1: Подключение к серверу

```bash
ssh root@runafinance.online
# или
ssh root@YOUR_SERVER_IP
```

## Шаг 2: Клонирование в домашнюю директорию root

```bash
# Переход в домашнюю директорию
cd ~

# Клонирование репозитория
git clone https://github.com/lobzik223/Runa-site.git

# Переход в папку проекта
cd Runa-site

# Просмотр структуры
ls -la
```

## Шаг 3: Проверка существующих проектов

```bash
# Посмотреть, что уже есть на сервере
ls -la /var/www
# или
ls -la ~
# или где у вас находятся проекты

# Проверить, какие порты заняты
netstat -tulpn | grep LISTEN
# или
ss -tulpn | grep LISTEN

# Проверить конфигурации Nginx
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/
```

## Шаг 4: Установка зависимостей (если Node.js уже установлен)

```bash
cd ~/Runa-site

# Проверка версии Node.js
node -v
npm -v

# Если Node.js не установлен:
# curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
# apt install -y nodejs

# Установка зависимостей проекта
npm install
```

## Шаг 5: Тестовая сборка (проверка, что все работает)

```bash
cd ~/Runa-site

# Сборка проекта
npm run build

# Проверка, что папка dist создалась
ls -la dist/
```

## Шаг 6: Проверка конфигурации портов

```bash
# Проверка, какой порт использует бэкенд
netstat -tulpn | grep node
# или
pm2 list

# Убедитесь, что порт 3001 свободен (или измените в ecosystem.config.js)
```

## Шаг 7: Решение о размещении проекта

После проверки решите, куда переместить проект:

### Вариант A: Оставить в ~/Runa-site
```bash
# Просто продолжайте работу из ~/Runa-site
```

### Вариант B: Переместить в /var/www (стандартное место)
```bash
# Создать директорию (если нужно)
mkdir -p /var/www

# Переместить проект
mv ~/Runa-site /var/www/

# Перейти в новую директорию
cd /var/www/Runa-site
```

### Вариант C: Оставить рядом с бэкендом
```bash
# Если бэкенд в ~/backend-runa, можно оставить рядом
# Просто продолжайте работу из ~/Runa-site
```

## Шаг 8: Настройка Nginx (после решения о размещении)

```bash
# Скопировать конфигурацию
cp ~/Runa-site/nginx.conf /etc/nginx/sites-available/runafinance.online

# Или если переместили в /var/www:
# cp /var/www/Runa-site/nginx.conf /etc/nginx/sites-available/runafinance.online

# Создать символическую ссылку
ln -s /etc/nginx/sites-available/runafinance.online /etc/nginx/sites-enabled/

# Проверить конфигурацию
nginx -t

# Если все ОК, перезапустить
systemctl restart nginx
```

## Шаг 9: Запуск через PM2

```bash
# Перейти в директорию проекта
cd ~/Runa-site
# или
cd /var/www/Runa-site

# Создать папку для логов
mkdir -p logs

# Запустить через PM2
pm2 start ecosystem.config.js

# Проверить статус
pm2 status
pm2 logs runa-site
```

## Полезные команды для проверки

```bash
# Посмотреть все процессы Node.js
pm2 list

# Посмотреть все запущенные сервисы
systemctl list-units --type=service --state=running

# Посмотреть конфигурацию Nginx для бэкенда
cat /etc/nginx/sites-available/* | grep -A 5 "server_name"

# Проверить, какие домены уже настроены
ls -la /etc/nginx/sites-enabled/
```

## Важно!

1. **Проверьте порты**: Убедитесь, что порт 3001 свободен (или измените в `ecosystem.config.js`)
2. **Проверьте домен**: Убедитесь, что `runafinance.online` не конфликтует с другими конфигурациями Nginx
3. **Проверьте права доступа**: Убедитесь, что у пользователя есть права на чтение файлов проекта
