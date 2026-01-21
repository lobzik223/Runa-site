const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

// Проверка существования dist папки при запуске
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ ОШИБКА: Папка dist не найдена!');
  console.error('📦 Запустите: npm run build');
  process.exit(1);
}

// Правильные MIME типы
express.static.mime.define({
  'video/quicktime': ['mov'],
  'video/mp4': ['mp4'],
  'application/javascript': ['js'],
  'text/css': ['css'],
  'image/svg+xml': ['svg']
});

// CORS заголовки для статических файлов
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Раздача статических файлов из папки dist
app.use(express.static(distPath, {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Правильные Content-Type для разных файлов
    if (filePath.endsWith('.mov')) {
      res.setHeader('Content-Type', 'video/quicktime');
    } else if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
    // Кеширование для статических файлов
    if (!filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Все маршруты ведут на index.html (для SPA)
// express.static уже обработал все статические файлы, поэтому сюда попадут только HTML маршруты
app.get('*', (req, res) => {
  const filePath = path.join(distPath, 'index.html');
  
  // Проверка существования файла
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Файл не найден: ${filePath}`);
    return res.status(500).send('Ошибка: файл index.html не найден. Запустите: npm run build');
  }
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Ошибка отправки index.html:', err);
      if (!res.headersSent) {
        res.status(500).send('Ошибка загрузки страницы');
      }
    }
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err);
  res.status(500).send('Внутренняя ошибка сервера');
});

app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📦 Окружение: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Статические файлы из: ${distPath}`);
  
  // Проверка наличия index.html
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log(`✅ index.html найден`);
  } else {
    console.error(`❌ index.html НЕ найден! Запустите: npm run build`);
  }
});
