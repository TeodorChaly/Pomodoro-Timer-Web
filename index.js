const express = require('express'); // Импортируем Express
const app = express(); // Создаем экземпляр приложения Express

// Подключаем статический сервер для обслуживания файлов из папки 'public'
app.use(express.static('public'));

// Опционально: Можете добавить базовый маршрут для проверки работоспособности сервера
app.get('/', (req, res) => {
    res.send('Welcome to the Pomodoro Timer API!');
});

// Запускаем сервер на порту 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
