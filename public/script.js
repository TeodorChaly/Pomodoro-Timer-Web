let timerInterval;
const timerDisplay = document.getElementById('timer');
const actionButton = document.getElementById('actionButton'); // Это наша универсальная кнопка
let remainingSeconds = 25 * 60; // Инициализация таймера на 25 минут
let isTimerRunning = false; // Отслеживаем, работает ли таймер

function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function toggleTimer() {
    if (!isTimerRunning && remainingSeconds === 25 * 60) {
        startTimer();
    } else if (isTimerRunning) {
        pauseTimer();
    } else {
        resumeTimer();
    }
}

function startTimer() {
    if (!timerInterval) {
        decrementTimer(); 
        timerInterval = setInterval(decrementTimer, 1000);
        actionButton.textContent = "Pause";
        isTimerRunning = true;
    }
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        actionButton.textContent = "Resume";
        isTimerRunning = false;
    }
}

function resumeTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(decrementTimer, 1000);
        actionButton.textContent = "Pause";
        isTimerRunning = true;
    }
}

function decrementTimer() {
    remainingSeconds--;
    updateTimerDisplay();
    if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        alert("Time's up!");
        resetTimer();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    remainingSeconds = 25 * 60; // Сброс таймера
    updateTimerDisplay();
    actionButton.textContent = "Start";
    isTimerRunning = false;
}

// Инициализация интерфейса
function initializeTimer() {
    updateTimerDisplay(); // Обновляем дисплей таймера
    actionButton.textContent = "Start"; // Устанавливаем текст кнопки на "Start"
}

window.onload = initializeTimer;

// Добавляем обработчик события для кнопки
actionButton.addEventListener('click', toggleTimer);
