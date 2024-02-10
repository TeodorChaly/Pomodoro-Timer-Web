let timerInterval;
const timerDisplay = document.getElementById('timer');
const actionButton = document.getElementById('actionButton');
const nextButton = document.getElementById('nextButton');
const stageDisplay = document.getElementById('stageDisplay');
const cycleCountDisplay = document.getElementById('cycleCount');
const longChillFrequency = 3; 

// Длительности стадий
const durations = {
    'Work': 1 * 5, // Для упрощения демонстрации: работа 5 секунд
    'Chill': 1 * 3, // Короткий перерыв 3 секунды
    'Long Chill': 1 * 10 // Длинный перерыв 10 секунд
};

let remainingSeconds = durations['Work']; // Начальная длительность
let isTimerRunning = false;
let stage = 'Work'; // Начальная стадия
let cycleCount = 0; // Счётчик циклов
let workStagesCompleted = 0; // Завершенные стадии работы
let chillStagesCompleted = 0; // Завершенные стадии отдыха
let totalChillStages = 0; // Общее количество коротких перерывов

function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function switchStage() {
    if (stage === 'Work') {
        workStagesCompleted++;
        // Проверяем условие для перехода к длинному перерыву
        if (workStagesCompleted % 2 === 0 && chillStagesCompleted >= longChillFrequency) {
            stage = 'Long Chill';
            chillStagesCompleted = 0; // Сбрасываем счетчик коротких перерывов после длинного
          
        } else {
            stage = 'Chill';
        }
    } else if (stage === 'Chill' || stage === 'Long Chill') {
        chillStagesCompleted++;
        stage = 'Work'; 
        cycleCount++; 
    }

    remainingSeconds = durations[stage];
    updateDisplay();
}


function toggleTimer() {
    if (!isTimerRunning) {
        startTimer();
    } else {
        pauseTimer();
    }
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(decrementTimer, 1000);
        actionButton.textContent = "Pause";
        isTimerRunning = true;
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    actionButton.textContent = "Start";
    isTimerRunning = false;
}

function decrementTimer() {
    remainingSeconds--;
    updateTimerDisplay();
    if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        isTimerRunning = false;
        actionButton.textContent = "Start";
        switchStage();
    }
}

function updateDisplay() {
    stageDisplay.textContent = stage;
    cycleCountDisplay.textContent = `Cycles: ${cycleCount}`;
    updateTimerDisplay();
    remainingSeconds = durations[stage]; // Обновляем время согласно текущей стадии
}

// Инициализация интерфейса
function initializeTimer() {
    updateDisplay();
}

// Обработчики событий
actionButton.addEventListener('click', toggleTimer);
nextButton.addEventListener('click', switchStage);

window.onload = initializeTimer;
