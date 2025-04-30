const POMODORO = 25 * 60 - 1;
const BREAK = 5 * 60 - 1;
const LONG_BREAK = 15 * 60 - 1;

const TimerMode = Object.freeze({
    POMODORO: "Pomodoro",
    BREAK: "Short Break",
    LONG_BREAK: "Long Break"
});

const mode = document.querySelector("#mode");
const timer = document.querySelector("#timer");
const startStopBtn = document.querySelector("#start-stop");
const resetBtn = document.querySelector("#reset");

let countdown;
let stopped = true;
let timeLeft = POMODORO;
let currentMode = TimerMode.POMODORO;
let pomodoroCounter = 0;

function switchMode() {
    if (currentMode === TimerMode.BREAK || currentMode == TimerMode.LONG_BREAK) {
        currentMode = TimerMode.POMODORO;
        timeLeft = POMODORO;
        timer.textContent = "25:00";
        mode.textContent = TimerMode.POMODORO;
    } else {
        pomodoroCounter++;
        if (pomodoroCounter % 4 === 0) {
            currentMode = TimerMode.LONG_BREAK;
            timeLeft = LONG_BREAK;
            timer.textContent = "15:00";
            mode.textContent = TimerMode.LONG_BREAK;
        } else {
            currentMode = TimerMode.BREAK;
            timeLeft = BREAK;
            timer.textContent = "05:00";
            mode.textContent = TimerMode.BREAK;
        }
    }
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timeLeft--;

    if (timeLeft < 0) {
        stopTimer();
        switchMode();
    }
}

function stopTimer() {
    clearInterval(countdown);
    stopped = true;
    startStopBtn.textContent = "Start";
}

startStopBtn.addEventListener("click", () => {
    if (stopped) {
        countdown = setInterval(updateTimer, 1000);
        stopped = false;
        startStopBtn.textContent = "Pause";
    } else {
        stopTimer();
    }
});

resetBtn.addEventListener("click", () => {
    stopTimer();
    countdown = null;
    switch(currentMode) {
        case TimerMode.POMODORO:
            timeLeft = POMODORO;
            timer.textContent = "25:00";
            break;
        case TimerMode.BREAK:
            timeLeft = BREAK;
            timer.textContent = "05:00";
            break;
        case TimerMode.BREAK:
            timeLeft = LONG_BREAK;
            timer.textContent = "15:00";
            break;
    }
});