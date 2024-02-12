let timerInterval;
const timerDisplay = document.getElementById("timer");
const actionButton = document.getElementById("actionButton");
const stageDisplay = document.getElementById("stageDisplay");
const cycleCountDisplay = document.getElementById("cycleCount");
const restartButton = document.getElementById("restartButton");
const soundAlertWork = new Audio("sounds/work.mp3");
const soundAlertChill = new Audio("sounds/chill.mp3");
const settingsModal = document.getElementById("settingsModal");
const settingsButton = document.getElementById("settingsButton");
const applySettingsButton = document.getElementById("applySettings");
const span = document.getElementsByClassName("close")[0];
const progressBar = document.querySelector('.e-c-progress');
const pointer = document.getElementById('e-pointer');
const length = Math.PI * 2 * 100;

const durations = {
    Work: 5,
    Chill: 3,
    "Long Chill": 10,
};

let remainingSeconds = durations["Work"];
let isTimerRunning = false;
let stage = "Work";
let cycleCount = 0;
let workStagesCompleted = 0;
let chillStagesCompleted = 0;
let longChillFrequency = 3;

progressBar.style.strokeDasharray = length;

function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function updateCircle(value, timePercent) {
    var offset = -length * value / timePercent;
    progressBar.style.strokeDashoffset = offset;
    pointer.style.transform = `rotate(${360 * value / timePercent}deg)`;
}

function playSound_work() {
    soundAlertWork.play();
}

function playSound_chill() {
    soundAlertChill.play();
}

function switchStage() {
    if (stage === "Work") {
        workStagesCompleted++;
        stage = (workStagesCompleted % 2 === 0 && chillStagesCompleted >= longChillFrequency) ? "Long Chill" : "Chill";
        if (stage === "Long Chill") chillStagesCompleted = 0;
        playSound_work();
    } else {
        chillStagesCompleted++;
        if (stage === "Chill" || stage === "Long Chill") cycleCount++;
        stage = "Work";
        playSound_chill();
    }
    remainingSeconds = durations[stage];
    updateDisplay();
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
    actionButton.textContent = "Start";
    isTimerRunning = false;
}

function restartCurrentSession() {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
    actionButton.textContent = "Start";
    remainingSeconds = durations[stage];
    updateTimerDisplay();
    updateCircle(durations[stage] - remainingSeconds, durations[stage]);
}

function validateInput() {
    const workDuration = parseInt(document.getElementById("workDuration").value, 10);
    const chillDuration = parseInt(document.getElementById("chillDuration").value, 10);
    const longChillDuration = parseInt(document.getElementById("longChillDuration").value, 10);
    document.getElementById("applySettings").disabled = !(workDuration > 0 && chillDuration > 0 && longChillDuration > 0);
}

function updateDisplay() {
    stageDisplay.textContent = stage;
    cycleCountDisplay.textContent = `Cycles: ${cycleCount}`;
    updateTimerDisplay();
}

function initializeTimer() {
    updateDisplay();
}

document.getElementById("workDuration").addEventListener("input", validateInput);
document.getElementById("chillDuration").addEventListener("input", validateInput);
document.getElementById("longChillDuration").addEventListener("input", validateInput);

settingsButton.onclick = function() {
    settingsModal.style.display = "block";
}

span.onclick = function() {
    settingsModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == settingsModal) {
        settingsModal.style.display = "none";
    }
}

applySettingsButton.onclick = function() {
    const workDurationInput = parseInt(document.getElementById("workDuration").value, 10) * 60;
    const chillDurationInput = parseInt(document.getElementById("chillDuration").value, 10) * 60;
    const longChillDurationInput = parseInt(document.getElementById("longChillDuration").value, 10) * 60;
    if (workDurationInput > 0 && chillDurationInput > 0 && longChillDurationInput > 0) {
        durations['Work'] = workDurationInput;
        durations['Chill'] = chillDurationInput;
        durations['Long Chill'] = longChillDurationInput;
        remainingSeconds = durations[stage];
        updateTimerDisplay();
        updateCircle(durations[stage] - remainingSeconds, durations[stage]);
        settingsModal.style.display = "none";
    } else {
        alert("Please enter positive numbers greater than zero for all durations.");
    }
}

actionButton.addEventListener("click", toggleTimer);
restartButton.addEventListener("click", restartCurrentSession);

window.onload = initializeTimer;
