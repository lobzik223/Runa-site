# Проверка и исправление SSL сертификата

## Проблема
Ошибка `NET::ERR_CERT_COMMON_NAME_INVALID` означает, что сертификат не соответствует домену.

## Диагностика

Выполните на сервере следующие команды для диагностики:

### 1. Проверьте, для каких доменов выдан сертификат:

```bash
sudo openssl x509 -in /etc/letsencrypt/live/runafinance.online/fullchain.pem -noout -text | grep -A 2 "Subject Alternative Name"
```

Должно показать:
```
X509v3 Subject Alternative Name:
    DNS:runafinance.online, DNS:www.runafinance.online
```

### 2. Проверьте активную конфигурацию Nginx:

```bash
sudo nginx -T | grep -A 50 "server_name runafinance.online"
```

### 3. Проверьте, что Certbot правильно настроил конфигурацию:

```bash
sudo cat /etc/nginx/sites-enabled/runafinance.online | grep -A 5 "server_name"
```

### 4. Проверьте логи Nginx:

```bash
sudo tail -20 /var/log/nginx/runa-site-error.log
```

## Решение

### Вариант 1: Certbot перезаписал конфигурацию

Если Certbot автоматически обновил конфигурацию, возможно нужно использовать его версию:

```bash
# Посмотрите, что Certbot создал
sudo cat /etc/nginx/sites-enabled/runafinance.online

# Если там есть правильные настройки SSL, но неправильный proxy_pass,
# нужно объединить конфигурации
```

### Вариант 2: Обновите конфигурацию вручную

Убедитесь, что в `nginx.conf`:
1. `server_name` точно совпадает с доменом в сертификате
2. Пути к сертификатам правильные
3. Нет конфликтующих блоков server

### Вариант 3: Перевыпустите сертификат

Если проблема сохраняется:

```bash
# Удалите текущий сертификат
sudo certbot delete --cert-name runafinance.online

# Получите новый сертификат
sudo certbot --nginx -d runafinance.online -d www.runafinance.online

# Проверьте конфигурацию
sudo nginx -t
sudo systemctl reload nginx
```

## Быстрое исправление

Выполните на сервере:

```bash
cd /root/Runa-site

# 1. Проверьте сертификат
sudo openssl x509 -in /etc/letsencrypt/live/runafinance.online/fullchain.pem -noout -subject

# 2. Посмотрите текущую конфигурацию
sudo nginx -T | grep -B 5 -A 30 "listen 443"

# 3. Убедитесь, что server_name правильный
sudo grep "server_name" /etc/nginx/sites-enabled/runafinance.online

# 4. Если нужно, обновите конфигурацию
sudo cp nginx.conf /etc/nginx/sites-available/runafinance.online
sudo nginx -t
sudo systemctl reload nginx

# 5. Проверьте работу
curl -vI https://runafinance.online 2>&1 | grep -i "subject\|CN="
```
