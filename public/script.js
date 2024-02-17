let timerInterval;
const timerDisplay = document.getElementById("timer");
const actionButton = document.getElementById("actionButton");
const nextButton = document.getElementById("nextButton");
const stageDisplay = document.getElementById("stageDisplay");
const cycleCountDisplay = document.getElementById("cycleCount");
const restartButton = document.getElementById("restartButton");
const soundAlertChillLong = new Audio("sounds/to_long_chill_notification.mp3");
const soundAlertWork = new Audio("sounds/to_work_notification.mp3");
const soundAlertChill = new Audio("sounds/to_chill_notification.mp3");
let longChillFrequency = 3;

const durations = {
  Work: 1 * 5,
  Chill: 1 * 5,
  "Long Chill": 1 * 10,
};

let remainingSeconds = durations["Work"];
let isTimerRunning = false;
let stage = "Work";
let cycleCount = 0;
let workStagesCompleted = 0;
let chillStagesCompleted = 0;
let totalChillStages = 0;

let progressBar = document.querySelector(".e-c-progress");
let pointer = document.getElementById("e-pointer");
let length = Math.PI * 2 * 100;

progressBar.style.strokeDasharray = length;

// function addNewTaskForm() {
//   const form = document.createElement("div");
//   form.classList.add("task-modal");
//   const btns = document.createElement("div");
//   btns.classList.add("bnts-modal");

//   const heading = document.createElement("h2");
//   heading.classList.add("heading");
//   heading.textContent = "Task";

//   const input = document.createElement("input");
//   input.classList.add("task-modal-input");
//   const startButton = document.createElement("button");
//   startButton.classList.add("task-modal-button");

//   input.setAttribute("type", "text");
//   input.setAttribute("placeholder", "Введите название задания");
//   startButton.textContent = "Начать задание";
//   startButton.disabled = true;

//   // Add elements to form
//   form.appendChild(heading);
//   form.appendChild(input);
//   form.appendChild(startButton);

//   document.querySelector(".container").appendChild(form);
//   input.addEventListener("input", function () {
//     startButton.disabled = !input.value.trim();
//   });

//   // Обработчик событий для кнопки начала задания
//   startButton.addEventListener("click", function () {
//     const taskNameDisplay = document.createElement("div");
//     taskNameDisplay.classList.add("task-modal-div");
//     taskNameDisplay.textContent = `${input.value.trim()}`;
//     // Добавляем элемент с названием задачи в форму
//     form.appendChild(taskNameDisplay);
//     // Создаем кнопки завершения задания
//     const completeButton = document.createElement("button");
//     completeButton.classList.add("task-modal-button");
//     const notCompleteButton = document.createElement("button");
//     notCompleteButton.classList.add("task-modal-button");
//     // Настраиваем кнопки
//     completeButton.textContent = "complete";
//     notCompleteButton.textContent = "not complete";

//     // Добавляем кнопки на страницу
//     btns.appendChild(completeButton);
//     btns.appendChild(notCompleteButton);
//     form.appendChild(btns);

//     // Скрываем ввод и кнопку начала задания
//     input.style.display = "none";
//     startButton.style.display = "none";

//     // Обработчик для кнопки "complete"
//     completeButton.addEventListener("click", function () {
//       displayCompletionMessage(form, input.value, true);
//     });

//     // Обработчик для кнопки "not complete"
//     notCompleteButton.addEventListener("click", function () {
//       displayCompletionMessage(form, input.value, false);
//     });
//   });
// }
// // Функция для отображения сообщения о завершении задания
// function displayCompletionMessage(form, taskName, isCompleted) {
//   const message = document.createElement("div");
//   message.textContent = `${taskName} was ${
//     isCompleted ? "completed" : "not completed"
//   }.`;
//   // Очищаем форму и отображаем сообщение
//   form.innerHTML = "";
//   form.appendChild(message);
// }

document.addEventListener("DOMContentLoaded", function () {
  stage = "Work";
  remainingSeconds = durations[stage];
  updateDisplay();
  updateCircle(durations[stage] - remainingSeconds, durations[stage]);
  updateCircleColor(stage);
  // addNewTaskForm();
});

function updateCircle(value, timePercent) {
  var offset = (-length * value) / timePercent;
  progressBar.style.strokeDashoffset = offset;
  pointer.style.transform = `rotate(${(360 * value) / timePercent}deg)`;
}

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
      chillStagesCompleted = 0;
      playSound_long_chill();
    } else {
      stage = "Chill";
      playSound_chill();
    }
  } else {
    chillStagesCompleted++;
    if (stage === "Chill" || stage === "Long Chill") {
      playSound_work();
      cycleCount++;
    }
    stage = "Work";
  }
  remainingSeconds = durations[stage];
  updateDisplay();
  updateCircle(durations[stage] - remainingSeconds, durations[stage]);
  if (isTimerRunning) {
    startTimer();
  }
  updateCircleColor(stage);
}

function updateDisplay() {
  let displayText;
  let textColor;

  switch (stage) {
    case "Work":
      displayText = "Time to Work!";
      textColor = "#FF5733";
      break;
    case "Chill":
      displayText = "Chill Out!";
      textColor = "#3498db";
      break;
    case "Long Chill":
      displayText = "Long Break!";
      textColor = "#2ecc71";
      break;
    default:
      displayText = stage;
      textColor = "#d44848";
  }

  stageDisplay.textContent = displayText;
  stageDisplay.style.color = textColor;
  cycleCountDisplay.textContent = `Pomodoro cycles: ${cycleCount}`;
  updateTimerDisplay();
  remainingSeconds = durations[stage];
}

function updateCircleColor(stage) {
  const progressCirclLine = document.querySelector(".e-c-base");
  const progressCircle = document.querySelector(".e-c-pointer");
  const button = document.querySelector(".button-start");
  const restartButton = document.getElementById("restartButton");
  const settingsButton = document.getElementById("settingsButton");

  let color;
  switch (stage) {
    case "Work":
      color = "#FF5733"; // Красный
      break;
    case "Chill":
      color = "#3498db"; // Синий
      break;
    case "Long Chill":
      color = "#2ecc71"; // Темно-синий
      break;
    default:
      color = "#900C3F"; // Значение по умолчанию
  }
  progressCirclLine.style.stroke = color;
  progressCircle.style.fill = color;
  progressCircle.style.stroke = color;
  button.style.background = color;
  restartButton.style.background = color;
  settingsButton.style.background = color;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(decrementTimer, 1000);
  actionButton.textContent = "Pause";
  isTimerRunning = true;
}

function decrementTimer() {
  remainingSeconds--;
  updateTimerDisplay();
  console.log(durations[stage], remainingSeconds);
  updateCircle(durations[stage] - remainingSeconds, durations[stage]);
  if (remainingSeconds <= 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    switchStage();
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
  actionButton.textContent = "Continue";
  isTimerRunning = false;
}

function restartCurrentSession() {
  clearInterval(timerInterval);
  timerInterval = null;
  isTimerRunning = false;
  actionButton.textContent = "Continue";

  remainingSeconds = durations[stage];

  updateTimerDisplay();
  updateCircle(durations[stage] - remainingSeconds, durations[stage]);
}

function playSound_long_chill() {
  soundAlertChillLong.play();
}

function playSound_work() {
  soundAlertWork.play();
}

function playSound_chill() {
  soundAlertChill.play();
}

const settingsModal = document.getElementById("settingsModal");
const settingsButton = document.getElementById("settingsButton");
const span = document.getElementsByClassName("close")[0];
const applySettingsButton = document.getElementById("applySettings");

settingsButton.onclick = function () {
  settingsModal.style.display = "block";
};

span.onclick = function () {
  settingsModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == settingsModal) {
    settingsModal.style.display = "none";
  }
};
document
  .getElementById("workDuration")
  .addEventListener("input", validateInput);
document
  .getElementById("chillDuration")
  .addEventListener("input", validateInput);
document
  .getElementById("longChillDuration")
  .addEventListener("input", validateInput);
document
  .getElementById("longChillFrequency")
  .addEventListener("input", validateInput);

function validateInput() {
  const workDuration = parseInt(
    document.getElementById("workDuration").value,
    10,
  );
  const chillDuration = parseInt(
    document.getElementById("chillDuration").value,
    10,
  );
  const longChillDuration = parseInt(
    document.getElementById("longChillDuration").value,
    10,
  );
  const longChillFrequencyInput = parseInt(
    document.getElementById("longChillFrequency").value,
    10,
  ); // Добавлено

  if (
    workDuration > 0 &&
    chillDuration > 0 &&
    longChillDuration > 0 &&
    workDuration < 1000 &&
    chillDuration < 1000 &&
    longChillDuration < 1000 &&
    longChillFrequencyInput >= 1 && // Добавлено
    longChillFrequencyInput <= 5 // Добавлено
  ) {
    document.getElementById("applySettings").disabled = false;
  } else {
    document.getElementById("applySettings").disabled = true;
  }
}

applySettingsButton.onclick = function () {
  const workDurationInput =
    parseInt(document.getElementById("workDuration").value, 10) * 60;
  const chillDurationInput =
    parseInt(document.getElementById("chillDuration").value, 10) * 60;
  const longChillDurationInput =
    parseInt(document.getElementById("longChillDuration").value, 10) * 60;
  const longChillFrequencyInput = parseInt(
    document.getElementById("longChillFrequency").value,
    10,
  );

  durations["Work"] = workDurationInput;
  durations["Chill"] = chillDurationInput;
  durations["Long Chill"] = longChillDurationInput;
  longChillFrequency = longChillFrequencyInput;

  remainingSeconds = durations[stage];
  updateTimerDisplay();
  updateCircle(durations[stage] - remainingSeconds, durations[stage]);
  settingsModal.style.display = "none";
};

function initializeTimer() {
  updateDisplay();
}

actionButton.addEventListener("click", toggleTimer);
restartButton.addEventListener("click", restartCurrentSession);

window.onload = initializeTimer;
