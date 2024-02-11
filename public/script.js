let timerInterval;
const timerDisplay = document.getElementById("timer");
const actionButton = document.getElementById("actionButton");
const nextButton = document.getElementById("nextButton");
const stageDisplay = document.getElementById("stageDisplay");
const cycleCountDisplay = document.getElementById("cycleCount");
const restartButton = document.getElementById("restartButton");
const soundAlertWork = new Audio("sounds/work.mp3");
const soundAlertChill = new Audio("sounds/chill.mp3");
const longChillFrequency = 3;

// Длительности стадий
const durations = {
  Work: 1 * 5, // Для упрощения демонстрации: работа 5 секунд
  Chill: 1 * 3, // Короткий перерыв 3 секунды
  "Long Chill": 1 * 10,
};

let remainingSeconds = durations["Work"]; // Начальная длительность
let isTimerRunning = false;
let stage = "Work"; // Начальная стадия
let cycleCount = 0; // Счётчик циклов
let workStagesCompleted = 0; // Завершенные стадии работы
let chillStagesCompleted = 0; // Завершенные стадии отдыха
let totalChillStages = 0; // Общее количество коротких перерывов

function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function switchStage() {
  if (stage === "Work") {
    workStagesCompleted++;
    if (
      workStagesCompleted % 2 === 0 &&
      chillStagesCompleted >= longChillFrequency
    ) {
      stage = "Long Chill";
      chillStagesCompleted = 0; // Reset chill stages counter after long chill
    } else {
      stage = "Chill";
    }
    playSound_work();

  } else {
    chillStagesCompleted++;
    // Increment cycle count only after a chill stage
    if (stage === "Chill" || stage === "Long Chill") {
      cycleCount++;
    }
    stage = "Work";
    playSound_chill();
  }

  remainingSeconds = durations[stage];
  updateDisplay();
  // Only auto-restart the timer if it was running
  if (isTimerRunning) {
    startTimer();
  }
}

// Adjust the startTimer function to reset isTimerRunning flag
function startTimer() {
  clearInterval(timerInterval); // Ensure any previous timer is cleared
  timerInterval = setInterval(decrementTimer, 1000);
  actionButton.textContent = "Pause";
  isTimerRunning = true; // Flag to indicate the timer is running
}

// Update the decrementTimer function
function decrementTimer() {
  remainingSeconds--;
  updateTimerDisplay();
  if (remainingSeconds <= 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    // Do not set isTimerRunning to false here as we want to auto-restart
    switchStage(); // Automatically switch stages
  }
}

function toggleTimer() {
  if (!isTimerRunning) {
    startTimer();
  } else {
    pauseTimer();
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  actionButton.textContent = "Start";
  isTimerRunning = false;
}

// Функция для сброса текущего сеанса таймера
function restartCurrentSession() {
  clearInterval(timerInterval); // Останавливаем текущий таймер
  timerInterval = null;
  isTimerRunning = false; // Указываем, что таймер находится на паузе
  actionButton.textContent = "Start"; // Меняем текст кнопки действия на "Start"

  // Сбрасываем только оставшееся время текущего этапа, не изменяя общий счетчик и этапы
  remainingSeconds = durations[stage]; // Устанавливаем оставшееся время согласно текущему этапу

  updateTimerDisplay(); 
}

function playSound_work() {
    soundAlertWork.play();
}

function playSound_chill() {
    soundAlertChill.play();
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
actionButton.addEventListener("click", toggleTimer);
restartButton.addEventListener("click", restartCurrentSession);

window.onload = initializeTimer;
