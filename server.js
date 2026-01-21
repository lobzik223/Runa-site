const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Раздача статических файлов из папки dist
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// Все маршруты ведут на index.html (для SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📦 Окружение: ${process.env.NODE_ENV || 'development'}`);
});
