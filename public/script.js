const timerDisplay = document.getElementById("timer");
const actionButton = document.getElementById("actionButton");
const nextButton = document.getElementById("nextButton");
const stageDisplay = document.getElementById("stageDisplay");
const cycleCountDisplay = document.getElementById("cycleCount");
const restartButton = document.getElementById("restartButton");
const progressBar = document.querySelector(".e-c-progress");
const pointer = document.getElementById("e-pointer");
const volumeControl = document.getElementById("volumeControl");
const settingsModal = document.getElementById("settingsModal");
const settingsButton = document.getElementById("settingsButton");
const span = document.getElementsByClassName("close")[0];
const applySettingsButton = document.getElementById("applySettings");

// Importing media files
const soundAlertChillLong = new Audio("sounds/to_long_chill_notification.mp3");
const soundAlertWork = new Audio("sounds/to_work_notification.mp3");
const soundAlertChill = new Audio("sounds/to_chill_notification.mp3");
const audio = new Audio("./sounds/music.mp3");

// Deafult time config
const durations = {
  Work: 25 * 60,
  Chill: 5 * 60,
  "Long Chill": 5 * 60,
};

// Deafult app setting
let stage = "Work";
let remainingSeconds = durations["Work"];
let timerInterval;
let longChillFrequency = 3;
let volume = 0.5;
let isTimerRunning = false;
let cycleCount = 0;
let workStagesCompleted = 0;
let chillStagesCompleted = 0;
let currentColor = "#FF5733";
let musicPlaying = false;
let length = Math.PI * 2 * 100;

audio.volume = volume;
audio.loop = true;

progressBar.style.strokeDasharray = length;

// Start initalization
function initializeTimer() {
  updateDisplay();
}
// Display prepering
function updateDisplay() {
  cangeTitle();
  updateTimerDisplay();
  remainingSeconds = durations[stage];
}
// Update timer
function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Time changing
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

// Changing main title
function cangeTitle() {
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
}

// Pouse and resume checker
function toggleTimer() {
  if (!isTimerRunning) {
    resumeTimer();
  } else {
    pauseTimer();
  }
}

// Resume time
function resumeTimer() {
  changeColors(currentColor);
  cangeTitle();
  clearInterval(timerInterval);
  timerInterval = setInterval(decrementTimer, 1000);
  actionButton.textContent = "Pause";
  isTimerRunning = true;
}

// Pause time
function pauseTimer() {
  changeColors("#808080");
  stageDisplay.textContent = "Time Paused!";
  stageDisplay.style.color = "#808080";
  cycleCountDisplay.textContent = `Pomodoro cycles: ${cycleCount}`;
  clearInterval(timerInterval);
  timerInterval = null;
  actionButton.textContent = "Continue";
  isTimerRunning = false;
}

// Restart time
function restartCurrentSession() {
  clearInterval(timerInterval);
  timerInterval = null;
  isTimerRunning = false;
  actionButton.textContent = "Continue";

  remainingSeconds = durations[stage];

  updateTimerDisplay();
  updateCircle(durations[stage] - remainingSeconds, durations[stage]);
}

// Audio pause and play
document.getElementById("musicToggle").addEventListener("click", function () {
  if (musicPlaying) {
    audio.pause();
    musicPlaying = false;
  } else {
    audio.play();
    musicPlaying = true;
  }
});

// Music volume
volumeControl.addEventListener("input", function () {
  audio.volume = volumeControl.value;
});

document.addEventListener("DOMContentLoaded", function () {
  stage = "Work";
  remainingSeconds = durations[stage];
  updateDisplay();
  updateCircle(durations[stage] - remainingSeconds, durations[stage]);
  updateCircleColor(stage);
});

// Upate progress in circle
function updateCircle(value, timePercent) {
  var offset = (-length * value) / timePercent;
  progressBar.style.strokeDashoffset = offset;
  pointer.style.transform = `rotate(${(360 * value) / timePercent}deg)`;
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
    resumeTimer();
  }
  updateCircleColor(stage);
}

function updateCircleColor(stage) {
  let color;

  switch (stage) {
    case "Work":
      color = "#FF5733";
      break;
    case "Chill":
      color = "#3498db";
      break;
    case "Long Chill":
      color = "#2ecc71";
      break;
    default:
      color = "#900C3F";
  }
  currentColor = color;
  changeColors(color);
}

function changeColors(color) {
  const progressCirclLine = document.querySelector(".e-c-base");
  const progressCircle = document.querySelector(".e-c-pointer");
  const button = document.querySelector(".button-start");
  const restartButton = document.getElementById("restartButton");
  const settingsButton = document.getElementById("settingsButton");
  const musicToggle = document.getElementById("musicToggle");

  progressCirclLine.style.stroke = color;
  progressCircle.style.fill = color;
  progressCircle.style.stroke = color;
  button.style.background = color;
  restartButton.style.background = color;
  settingsButton.style.background = color;
  musicToggle.style.background = color;
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

// Setting displaying
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

// Setting valide input checking
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

// Checking input validation in settings
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
  );

  if (
    workDuration > 0 &&
    chillDuration > 0 &&
    longChillDuration > 0 &&
    workDuration < 1000 &&
    chillDuration < 1000 &&
    longChillDuration < 1000 &&
    longChillFrequencyInput >= 1 &&
    longChillFrequencyInput <= 5
  ) {
    document.getElementById("applySettings").disabled = false;
  } else {
    document.getElementById("applySettings").disabled = true;
  }
}

// Setting apply functions
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

actionButton.addEventListener("click", toggleTimer);
restartButton.addEventListener("click", restartCurrentSession);

window.onload = initializeTimer;
