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


// Получаем элементы
const settingsModal = document.getElementById("settingsModal");
const settingsButton = document.getElementById("settingsButton");
const span = document.getElementsByClassName("close")[0];
const applySettingsButton = document.getElementById("applySettings");

// Открываем модальное окно при клике на кнопку
settingsButton.onclick = function() {
    settingsModal.style.display = "block";
}

// Закрываем модальное окно при клике на (x)
span.onclick = function() {
    settingsModal.style.display = "none";
}

// Закрываем модальное окно при клике вне его
window.onclick = function(event) {
    if (event.target == settingsModal) {
        settingsModal.style.display = "none";
    }
}
document.getElementById("workDuration").addEventListener("input", validateInput);
document.getElementById("chillDuration").addEventListener("input", validateInput);
document.getElementById("longChillDuration").addEventListener("input", validateInput);

function validateInput() {
    const workDuration = parseInt(document.getElementById("workDuration").value, 10);
    const chillDuration = parseInt(document.getElementById("chillDuration").value, 10);
    const longChillDuration = parseInt(document.getElementById("longChillDuration").value, 10);

    // Проверяем, что все значения положительные и больше нуля
    if (workDuration > 0 && chillDuration > 0 && longChillDuration > 0) {
        // Если все проверки пройдены, кнопка "Apply" становится активной
        document.getElementById("applySettings").disabled = false;
    } else {
        // Иначе кнопка остается неактивной
        document.getElementById("applySettings").disabled = true;
    }
}

// Инициализируем валидацию, чтобы сразу применить состояние кнопки "Apply"
validateInput();

applySettingsButton.onclick = function() {
    const workDurationInput = parseInt(document.getElementById("workDuration").value, 10) * 60;
    const chillDurationInput = parseInt(document.getElementById("chillDuration").value, 10) * 60;
    const longChillDurationInput = parseInt(document.getElementById("longChillDuration").value, 10) * 60;

    // Проверяем, что все введенные значения положительны и больше нуля
    if (workDurationInput > 0 && chillDurationInput > 0 && longChillDurationInput > 0) {
        // Обновляем длительности только если все проверки пройдены
        durations['Work'] = workDurationInput;
        durations['Chill'] = chillDurationInput;
        durations['Long Chill'] = longChillDurationInput;

        // Сброс или корректировка оставшегося времени текущей сессии
        remainingSeconds = durations[stage];
        updateTimerDisplay(); // Обновляем отображение таймера
        settingsModal.style.display = "none"; // Скрываем модальное окно
    } else {
       
        alert("Please enter positive numbers greater than zero for all durations.");
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
actionButton.addEventListener("click", toggleTimer);
restartButton.addEventListener("click", restartCurrentSession);

window.onload = initializeTimer;
