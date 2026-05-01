// other elements
breakToggle = document.getElementById("breakToggle");
timer = document.getElementById("timer");

// buttons on the timer webpage; check HTML document for reference
startButton = document.getElementById("startButton");
stopButton = document.getElementById("stopButton");
resetButton = document.getElementById("resetButton");
breakToggle = document.getElementById("breakToggle");

// popUp initialization
poppedUp = false;

// variables to set to handle the
stopped = true;
minutes = 0;
seconds = 0;

// variables for timing, in sec
studyTime = 25*60;
breakTime = 5*60;
time = 0; // current time as shown by timer

// as dictated by the algorithm. by default 25 min study, 5 min break.
studyTime = 3;
breakTime = 5*60;

// IMPORTED FUNCTIONS

import { weightedAverage } from "./functions.js";

// function to open pop up

function openPopUp() {
    document.getElementById("popUpAll").style.display = 'flex';
}

function closePopUp() {
    document.getElementById("popUpAll").style.display = 'none';

    // reset time values
    minutes = 0;
    seconds = 0;
    time = 0;

    // reset states to default in UI
    timer.textContent = minutes + "m " + seconds + "s";
    stopped = true;
    stopButton.disabled = true;
    startButton.disabled = false;
    resetButton.disabled = false;
    breakToggle.disabled = false;

    // use ratings from popup
    overallRating = Number(document.getElementById("rating-slider-1").value);
    studyRating = Number(document.getElementById("rating-slider-2").value);
    breakRating = Number(document.getElementById("rating-slider-3").value);
    afterRating = Number(document.getElementById("rating-slider-4").value);
    motivationRating = Number(document.getElementById("rating-slider-5").value);

    // call function to output a recommended time for study and break, let this depend on the number of entries done

    // save data to local storage

}

// handling the sliders

const labels = ['', 'Horrible', 'Bad', 'Just right', 'Good', 'Excellent']; // planning to replace this with images of tomatoes

function updateSlider(num, val) {
    document.getElementById('rating-label-' + num).textContent = labels[val];
    document.getElementById('rating-sub-' + num).textContent = val + ' / 5';
}

// change colour to indicate break or not.
breakToggle.addEventListener("change", () => {
    if (breakToggle.checked) {
        timer.style.backgroundColor = "#5d8353";
    } else {
        timer.style.backgroundColor = "#ca5048";
    }
});

// handles what happens when you press the start button
startButton.addEventListener("click", () => {
    startButton.disabled = true;
    stopButton.disabled = false;
    resetButton.disabled = true;
    breakToggle.disabled = true;
    stopped = false;
});

// handles what happens when you press the stop button
stopButton.addEventListener("click", () => {
    stopButton.disabled = true;
    startButton.disabled = false;
    resetButton.disabled = false;
    stopped = true;
    poppedUp = true; // can only reset popup state after a session is over.
});

// handles what happens when you press the reset button
resetButton.addEventListener("click", () => {
    document.getElementById("timer").textContent = "RESET";

    // enable break button
    breakToggle.disabled = false;

    // reset variables to 0
    seconds = 0;
    minutes = 0;
    time = 0;

    // reflect this change
    timer.textContent = minutes + "m " + seconds + "s";

    // can pop up again
    poppedUp=false;

});

// timer handler, setInterval uses milliseconds as a unit
setInterval(() => {
    if (seconds == 60 && stopped == false) {
        ++minutes;
        seconds = 0;
        time = (minutes*60) + seconds;
        timer.textContent = minutes + "m " + seconds + "s";
    } else if (stopped == false) {
        ++seconds;
        timer.textContent = minutes + "m " + seconds + "s";
        time = (minutes*60) + seconds;
    };

    if (time >= studyTime && poppedUp == false) { // adjust time
        openPopUp();
        stopped = true;
        poppedUp = true;
        clearInterval();
    }

}, 1000);

// handle the appearance of thhe study raters and break raters

// HANDLING THE ALGORITHM FOR STUDY TIMING.

/*
    Algorithms to use:
    
    Global variable regarding the amount of sessions there have been done i.e. after a consecutive study and break, increment

    < 20: weighted average algorithm
    20-50: linear regression
    50+: random forest
    100+: neural network
*/