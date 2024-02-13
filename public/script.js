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

  const durations = {
    Work: 1 * 5, 
    Chill: 1 * 3,
    "Long Chill": 1 * 10,
  };

  let remainingSeconds = durations["Work"];
  let isTimerRunning = false;
  let stage = "Work";
  let cycleCount = 0; 
  let workStagesCompleted = 0;
  let chillStagesCompleted = 0;
  let totalChillStages = 0;

  let progressBar = document.querySelector('.e-c-progress');
  let pointer = document.getElementById('e-pointer');
  let length = Math.PI * 2 * 100;

  progressBar.style.strokeDasharray = length;

  function addNewTaskForm() {
      // Создаем элементы формы
      const form = document.createElement('div');
      const input = document.createElement('input');
      const startButton = document.createElement('button');

      // Настраиваем элементы
      input.setAttribute('type', 'text');
      input.setAttribute('placeholder', 'Введите название задания');
      startButton.textContent = 'Начать задание';
      startButton.disabled = true; // кнопка неактивна пока поле ввода пустое

      // Добавляем элементы в форму
      form.appendChild(input);
      form.appendChild(startButton);

      // Добавляем форму на страницу
      document.body.appendChild(form);

      // Обработчик событий для поля ввода
      input.addEventListener('input', function() {
          startButton.disabled = !input.value.trim();
      });

      // Обработчик событий для кнопки начала задания
      startButton.addEventListener('click', function() {
        const taskNameDisplay = document.createElement('div');
        taskNameDisplay.textContent = `Task: ${input.value.trim()}`;
        // Добавляем элемент с названием задачи в форму
        form.appendChild(taskNameDisplay);
          // Создаем кнопки завершения задания
          const completeButton = document.createElement('button');
          const notCompleteButton = document.createElement('button');

          // Настраиваем кнопки
          completeButton.textContent = 'complete';
          notCompleteButton.textContent = 'not complete';

          // Добавляем кнопки на страницу
          form.appendChild(completeButton);
          form.appendChild(notCompleteButton);

          // Скрываем ввод и кнопку начала задания
          input.style.display = 'none';
          startButton.style.display = 'none';

          // Обработчик для кнопки "complete"
          completeButton.addEventListener('click', function() {
              displayCompletionMessage(form, input.value, true);
          });

          // Обработчик для кнопки "not complete"
          notCompleteButton.addEventListener('click', function() {
              displayCompletionMessage(form, input.value, false);
          });
      });
  }

  // Функция для отображения сообщения о завершении задания
  function displayCompletionMessage(form, taskName, isCompleted) {
      const message = document.createElement('div');
      message.textContent = `${taskName} was ${isCompleted ? 'completed' : 'not completed'}.`;
      // Очищаем форму и отображаем сообщение
      form.innerHTML = '';
      form.appendChild(message);
  }

  // Инициализация первой формы задания при загрузке страницы
  document.addEventListener('DOMContentLoaded', function() {
      addNewTaskForm();
  });



  function updateCircle(value, timePercent) {
    var offset = -length * value / timePercent;
    progressBar.style.strokeDashoffset = offset;
    pointer.style.transform = `rotate(${360 * value / timePercent}deg)`;

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
    } else {
      stage = "Chill";
    }
    playSound_work();
  } else {
    chillStagesCompleted++;
    if (stage === "Chill" || stage === "Long Chill") {
      cycleCount++;
    }
    stage = "Work";
    playSound_chill();
  }
      remainingSeconds = durations[stage];
      updateDisplay();
      updateCircle(durations[stage] - remainingSeconds, durations[stage]);
      if (isTimerRunning) {
        startTimer();
      }
      updateCircleColor(stage); 
    }


  function updateCircleColor(stage) {
    const progressCirclLine = document.querySelector('.e-c-base');
    const progressCircle = document.querySelector('.e-c-pointer');

    let color;
    switch (stage) {
      case "Work":
        color = '#d44848'; // Красный
        break;
      case "Chill":
        color = '#3498db'; // Синий
        break;
      case "Long Chill":
        color = '#2c3e50'; // Темно-синий
        break;
      default:
        color = '#d44848'; // Значение по умолчанию
    }
    progressCirclLine.style.stroke = color;
    progressCircle.style.fill = color;
    progressCircle.style.stroke = color;
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
  document.getElementById("workDuration").addEventListener("input", validateInput);
  document.getElementById("chillDuration").addEventListener("input", validateInput);
  document.getElementById("longChillDuration").addEventListener("input", validateInput);

  function validateInput() {
      const workDuration = parseInt(document.getElementById("workDuration").value, 10);
      const chillDuration = parseInt(document.getElementById("chillDuration").value, 10);
      const longChillDuration = parseInt(document.getElementById("longChillDuration").value, 10);

      if (workDuration > 0 && chillDuration > 0 && longChillDuration > 0) {
          document.getElementById("applySettings").disabled = false;
      } else {
          document.getElementById("applySettings").disabled = true;
      }
  }

  validateInput();

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


  function updateDisplay() {
    stageDisplay.textContent = stage;
    cycleCountDisplay.textContent = `Cycles: ${cycleCount}`;
    updateTimerDisplay();
    remainingSeconds = durations[stage]; 
  }

  function initializeTimer() {
    updateDisplay();
  }

  actionButton.addEventListener("click", toggleTimer);
  restartButton.addEventListener("click", restartCurrentSession);

  window.onload = initializeTimer;