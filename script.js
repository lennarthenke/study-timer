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
const statPomo = document.querySelector("#stat-pomo");
const statTotal = document.querySelector("#stat-total");
const statStreak = document.querySelector("#stat-streak");

let countdown;
let stopped = true;
let timeLeft = POMODORO;
let currentMode = TimerMode.POMODORO;
let pomodoroCounter = 0;
const stats = loadStats();

renderStats();

if (Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
        if (permission !== "granted") {
            console.log("Notifcations disabled by user.");
        }
    });
}

function notify(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body: body,
            icon: "icon.png"
        });
    }
}

function sendNotification() {
    switch(currentMode) {
        case TimerMode.POMODORO:
            notify("Break over!", "Time to focus for 25 minutes.");
            break;
        case TimerMode.BREAK:
            notify("Time's up!", "Take a 5-minute break.");
            break;
        case TimerMode.LONG_BREAK:
            notify("Time's up!", "Take a 15-minute break.");
            break;
    }
}

function switchMode() {
    if (currentMode === TimerMode.BREAK || currentMode == TimerMode.LONG_BREAK) {
        currentMode = TimerMode.POMODORO;
        timeLeft = POMODORO;
        timer.textContent = "25:00";
        timer.className = "pomodoro";
        mode.textContent = TimerMode.POMODORO;
    } else {
        pomodoroCounter++;
        if (pomodoroCounter % 4 === 0) {
            currentMode = TimerMode.LONG_BREAK;
            timeLeft = LONG_BREAK;
            timer.textContent = "15:00";
            timer.className = "long-break";
            mode.textContent = TimerMode.LONG_BREAK;
        } else {
            currentMode = TimerMode.BREAK;
            timeLeft = BREAK;
            timer.textContent = "05:00";
            timer.className = "break";
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
        recordSession();
        renderStats();
        switchMode();
        sendNotification();
    }
}

function stopTimer() {
    clearInterval(countdown);
    stopped = true;
    startStopBtn.textContent = "Start";
}

function loadStats() {
    const raw = localStorage.getItem("studyStats");
    return raw ? JSON.parse(raw) : {
        history: {},
        currentStreak: 0,
        totalFocusMinutes: 0
    };
}

function saveStats(s) {
    localStorage.setItem("studyStats", JSON.stringify(s));
}

function recordSession() {
    const today = new Date().toISOString().slice(0,10);
    if (!stats.history[today]) {
        stats.history[today] = { pomodoros:0, breaks:0, longBreaks:0 };
        const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0,10);
        stats.currentStreak = stats.history[yesterday]?.pomodoros > 0
                            ? stats.currentStreak + 1
                            : 1;
    }
    switch(currentMode) {
        case TimerMode.POMODORO:
            stats.history[today].pomodoros++;
            stats.totalFocusMinutes += 25;
            break;
        case TimerMode.BREAK:
            stats.history[today].breaks++;
            break;
        case TimerMode.LONG_BREAK:
            stats.history[today].longBreaks++;
            break;
    }
    saveStats(stats);
}

function renderStats() {
    const today = new Date().toISOString().slice(0,10);
    statPomo.textContent = stats.history[today]?.pomodoros || 0;
    const totalMin = stats.totalFocusMinutes;
    const hours = Math.floor(totalMin / 60);
    const minutes = totalMin % 60;
    statTotal.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    statStreak.textContent = stats.currentStreak;
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
            stats.totalFocusMinutes += Math.floor((POMODORO - timeLeft) / 60);
            renderStats();
            timeLeft = POMODORO;
            timer.textContent = "25:00";
            break;
        case TimerMode.BREAK:
            timeLeft = BREAK;
            timer.textContent = "05:00";
            break;
        case TimerMode.LONG_BREAK:
            timeLeft = LONG_BREAK;
            timer.textContent = "15:00";
            break;
    }
});