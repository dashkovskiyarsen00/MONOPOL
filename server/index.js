const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Путь к папке public
const publicDir = path.join(__dirname, "..", "public");

// Парсинг JSON (на будущее для API)
app.use(express.json());

// Раздача статических файлов
app.use(express.static(publicDir));

// Проверка работоспособности сервера
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    db: "disabled"
  });
});

// Отдаём index.html для всех маршрутов (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});