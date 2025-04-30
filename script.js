const POMODORO = 25 * 60 - 1;

const timer = document.querySelector("#timer");
const startStopBtn = document.querySelector("#start-stop");
const resetBtn = document.querySelector("#reset");

let countdown;
let stopped = true;
let timeLeft = POMODORO;

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timeLeft--;

    if (timeLeft < 0) {
        clearInterval(countdown);
        timer.textContent = "00:00";
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
    timeLeft = POMODORO;
    timer.textContent = "25:00";
})