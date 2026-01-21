# Инструкция по деплою на VPS сервер

## Подготовка сервера

### 1. Подключение к серверу

```bash
ssh root@your-server-ip
# или
ssh root@runafinance.online
```

### 2. Установка необходимого ПО

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Установка Nginx
apt install -y nginx

# Установка PM2 (менеджер процессов)
npm install -g pm2

# Установка Git
apt install -y git

# Установка Certbot (для SSL)
apt install -y certbot python3-certbot-nginx
```

### 3. Создание пользователя для приложения (опционально, но рекомендуется)

```bash
adduser runa-site
usermod -aG sudo runa-site
su - runa-site
```

## Деплой приложения

### 1. Клонирование репозитория

```bash
cd /var/www
git clone https://github.com/lobzik223/Runa-site.git
cd Runa-site
```

### 2. Установка зависимостей и сборка

```bash
npm install
npm run build
```

### 3. Создание папки для логов

```bash
mkdir -p logs
```

### 4. Запуск приложения через PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Проверка статуса

```bash
pm2 status
pm2 logs runa-site
```

## Настройка Nginx

### 1. Копирование конфигурации

```bash
sudo cp /var/www/Runa-site/nginx.conf /etc/nginx/sites-available/runafinance.online
sudo ln -s /etc/nginx/sites-available/runafinance.online /etc/nginx/sites-enabled/
```

### 2. Удаление дефолтной конфигурации (если есть)

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 3. Проверка конфигурации

```bash
sudo nginx -t
```

### 4. Перезапуск Nginx

```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Настройка DNS

### 1. Настройка DNS записей у регистратора домена

Добавьте следующие A-записи:
- `runafinance.online` → IP вашего VPS сервера
- `www.runafinance.online` → IP вашего VPS сервера

### 2. Проверка DNS

```bash
# Проверка с вашего компьютера
nslookup runafinance.online
ping runafinance.online
```

## Настройка SSL (HTTPS)

### 1. Получение SSL сертификата через Let's Encrypt

```bash
sudo certbot --nginx -d runafinance.online -d www.runafinance.online
```

### 2. После получения сертификата

1. Отредактируйте `/etc/nginx/sites-available/runafinance.online`
2. Раскомментируйте блок HTTPS конфигурации
3. Закомментируйте или удалите блок HTTP с редиректом
4. Раскомментируйте строку `return 301 https://$server_name$request_uri;` в HTTP блоке

```bash
sudo nano /etc/nginx/sites-available/runafinance.online
```

### 3. Перезапуск Nginx

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Автоматическое обновление сертификата

Certbot автоматически настроит обновление, но можно проверить:

```bash
sudo certbot renew --dry-run
```

## Обновление приложения

### 1. Обновление кода

```bash
cd /var/www/Runa-site
git pull origin main
npm install
npm run build
pm2 restart runa-site
```

### 2. Или создайте скрипт обновления

```bash
cat > /var/www/Runa-site/deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/Runa-site
git pull origin main
npm install
npm run build
pm2 restart runa-site
echo "Деплой завершен!"
EOF

chmod +x /var/www/Runa-site/deploy.sh
```

Использование:
```bash
./deploy.sh
```

## Полезные команды

### PM2

```bash
pm2 status              # Статус приложений
pm2 logs runa-site      # Логи приложения
pm2 restart runa-site   # Перезапуск
pm2 stop runa-site      # Остановка
pm2 delete runa-site    # Удаление из PM2
```

### Nginx

```bash
sudo nginx -t                    # Проверка конфигурации
sudo systemctl status nginx      # Статус
sudo systemctl restart nginx     # Перезапуск
sudo systemctl reload nginx      # Перезагрузка конфигурации
sudo tail -f /var/log/nginx/error.log  # Логи ошибок
```

### Проверка портов

```bash
netstat -tulpn | grep :3001
ss -tulpn | grep :3001
```

## Настройка файрвола

```bash
# Установка UFW (если не установлен)
apt install -y ufw

# Разрешение SSH
ufw allow 22/tcp

# Разрешение HTTP и HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Включение файрвола
ufw enable

# Проверка статуса
ufw status
```

## Мониторинг

### Проверка работы приложения

```bash
# Проверка через curl
curl http://localhost:3001

# Проверка через браузер
# Откройте http://runafinance.online
```

### Логи

```bash
# Логи PM2
pm2 logs runa-site --lines 100

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Системные логи
journalctl -u nginx -f
```

## Решение проблем

### Приложение не запускается

```bash
# Проверка логов
pm2 logs runa-site

# Проверка порта
netstat -tulpn | grep 3001

# Проверка прав доступа
ls -la /var/www/Runa-site
```

### Nginx не работает

```bash
# Проверка конфигурации
sudo nginx -t

# Проверка статуса
sudo systemctl status nginx

# Просмотр логов
sudo tail -f /var/log/nginx/error.log
```

### Домен не работает

```bash
# Проверка DNS
nslookup runafinance.online
dig runafinance.online

# Проверка доступности порта
curl -I http://runafinance.online
```

## Безопасность

1. **Регулярно обновляйте систему:**
   ```bash
   apt update && apt upgrade -y
   ```

2. **Настройте автоматические обновления безопасности**

3. **Используйте сильные пароли**

4. **Настройте fail2ban для защиты от брутфорса:**
   ```bash
   apt install -y fail2ban
   ```

5. **Регулярно проверяйте логи на подозрительную активность**
