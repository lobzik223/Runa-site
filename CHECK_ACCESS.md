# Проверка доступа к сайту

## 1. Узнать IP адрес сервера

```bash
# Вариант 1: через hostname
hostname -I

# Вариант 2: через ip
ip addr show

# Вариант 3: через curl внешнего сервиса
curl ifconfig.me
# или
curl ipinfo.io/ip
```

## 2. Проверка работы приложения локально

```bash
# Проверка через curl
curl http://localhost:3001

# Проверка статуса PM2
pm2 status
pm2 logs runa-site
```

## 3. Доступ через IP адрес

После того как узнаете IP адрес, откройте в браузере:
```
http://YOUR_SERVER_IP:3001
```

Например, если IP адрес `123.45.67.89`:
```
http://123.45.67.89:3001
```

## 4. Настройка Nginx для доступа по домену

После настройки Nginx сайт будет доступен по:
```
http://runafinance.online
https://runafinance.online (после настройки SSL)
```
