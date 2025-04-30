const POMODORO = 25 * 60 - 1;

const timer = document.querySelector("#timer");
const startBtn = document.querySelector("#start");
const resetBtn = document.querySelector("#reset");

let countdown;
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

startBtn.addEventListener("click", () => {
    if (countdown) return;
    countdown = setInterval(updateTimer, 1000);
});

resetBtn.addEventListener("click", () => {
    clearInterval(countdown);
    countdown = null;
    timeLeft = POMODORO;
    timer.textContent = "25:00";
})