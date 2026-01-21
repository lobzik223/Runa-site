# Установка и настройка на сервере

## Шаг 1: Установка необходимых инструментов

```bash
# Установка net-tools (для netstat)
apt install -y net-tools

# Установка Node.js 20.x (если еще не установлен)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Проверка версий
node -v
npm -v

# Установка PM2
npm install -g pm2

# Установка Nginx (если еще не установлен)
apt install -y nginx

# Установка Certbot (для SSL, если еще не установлен)
apt install -y certbot python3-certbot-nginx
```

## Шаг 2: Проверка существующих сервисов

```bash
# Проверка портов (альтернатива netstat)
ss -tulpn | grep LISTEN

# Проверка процессов Node.js
ps aux | grep node

# Проверка конфигураций Nginx
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Просмотр активных конфигураций Nginx
cat /etc/nginx/sites-enabled/*
```

## Шаг 3: Установка зависимостей проекта

```bash
cd ~/Runa-site

# Установка зависимостей
npm install

# Проверка, что установилось
ls -la node_modules/
```

## Шаг 4: Тестовая сборка

```bash
cd ~/Runa-site

# Сборка проекта
npm run build

# Проверка результата
ls -la dist/
```

## Шаг 5: Проверка портов и выбор порта для сайта

```bash
# Проверка занятых портов
ss -tulpn | grep LISTEN

# Проверка, свободен ли порт 3001
ss -tulpn | grep 3001

# Если порт занят, можно изменить в ecosystem.config.js
# Или использовать другой порт (например, 3002)
```

## Шаг 6: Создание папки для логов

```bash
cd ~/Runa-site
mkdir -p logs
```

## Шаг 7: Запуск через PM2

```bash
cd ~/Runa-site

# Запуск приложения
pm2 start ecosystem.config.js

# Проверка статуса
pm2 status

# Просмотр логов
pm2 logs runa-site

# Сохранение конфигурации PM2
pm2 save

# Настройка автозапуска
pm2 startup
# (выполните команду, которую выведет PM2)
```

## Шаг 8: Проверка работы приложения

```bash
# Проверка через curl
curl http://localhost:3001

# Или проверка через браузер (если есть доступ)
# http://YOUR_SERVER_IP:3001
```

## Шаг 9: Настройка Nginx

```bash
# Копирование конфигурации
cp ~/Runa-site/nginx.conf /etc/nginx/sites-available/runafinance.online

# Создание символической ссылки
ln -s /etc/nginx/sites-available/runafinance.online /etc/nginx/sites-enabled/

# Проверка конфигурации
nginx -t

# Если все ОК, перезапуск
systemctl restart nginx

# Проверка статуса
systemctl status nginx
```

## Шаг 10: Настройка DNS (если еще не настроено)

У вашего регистратора домена добавьте A-записи:
- `runafinance.online` → IP вашего сервера
- `www.runafinance.online` → IP вашего сервера

Проверка DNS:
```bash
nslookup runafinance.online
```

## Шаг 11: Настройка SSL (HTTPS)

```bash
# Получение SSL сертификата
certbot --nginx -d runafinance.online -d www.runafinance.online

# После получения сертификата отредактируйте конфигурацию:
nano /etc/nginx/sites-available/runafinance.online

# Раскомментируйте HTTPS блок и закомментируйте HTTP
# Затем:
nginx -t
systemctl restart nginx
```

## Полезные команды

```bash
# Просмотр логов PM2
pm2 logs runa-site --lines 50

# Перезапуск приложения
pm2 restart runa-site

# Просмотр логов Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Проверка работы сайта
curl -I http://runafinance.online
```
