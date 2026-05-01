// other elements
breakToggle = document.getElementById("breakToggle");
timer = document.getElementById("timer");

// buttons on the timer webpage; check HTML document for reference
startButton = document.getElementById("startButton");
stopButton = document.getElementById("stopButton");
resetButton = document.getElementById("resetButton");
breakToggle = document.getElementById("breakToggle");
recommendedTimeDisplay = document.getElementById("calculatedTimeDisplay");

// popUp initialization
poppedUp = false;

// variables to set to handle the timer
stopped = true;
reset = false;
minutes = 0;
seconds = 0;

//session type
sessionType = 'study';

// ALGORITHMIC FUNCTIONS

function weightedAverage(ratings, studyTime, breakTime) { // function is to be used in the timer handler

    // these will be changed to output times based off of the algorithm
    currentStudyTime = studyTime;
    currentBreakTime = breakTime;

    let sum = 0; // sum of the weights

    const weights = [0.2, 0.25, 0.25, 0.2, 0.1]; // weights for the weighted average algorithm
    for (let i = 0; i < ratings.length; i++) {
        sum += ratings[i] * weights[i];
    } 

    if (sum <= 2) {
        currentStudyTime *= 0.8
        currentBreakTime *= 1.2
    } else if (sum >2 && sum <= 3) {
        currentStudyTime *= 0.85
        currentBreakTime *= 1.1
    } else if (sum >3 && sum <= 3.75) {
        currentStudyTime *= 1.05
        currentBreakTime *= 0.9
    } else if (sum > 3.75 && sum <= 4.25) {
        currentStudyTime *= 1.1
        currentBreakTime *= 0.85
    } else {
        currentStudyTime *= 1.15
        currentBreakTime *= 0.75
    }

    return { studyTime: Math.round(currentStudyTime), breakTime: Math.round(currentBreakTime) };
}

// initialisation

function init() {
    startUserData = loadData(); 

    if (startUserData.length === 0) {
        // no sessions yet, use defaults
        studyTime = 25*60;
        breakTime = 5 * 60;
    } else {
        // grab the most recent session
        const lastSession = startUserData[startUserData.length - 1];
        studyTime = lastSession.newStudyTime;
        breakTime = lastSession.newBreakTime;
    }

    time = studyTime; // just for default and functionality
    
    startBreakTime_min = Math.floor(breakTime/60);
    startBreakTime_sec = breakTime%60
    startStudyTime_min = Math.floor(studyTime/60);
    startStudyTime_sec = studyTime%60;


    recommendedTimeDisplay.textContent = `Study time: ${startStudyTime_min}m ${startStudyTime_sec}s, Break time: ${startBreakTime_min}m ${startBreakTime_sec}s`;
}

init();

// functions for data handling

function loadData() {
    const saved = localStorage.getItem('userSessionData');
    return saved ? JSON.parse(saved) : [];
}

function saveSessionData(newEntry) {
    const data = loadData();
    data.push(newEntry);
    localStorage.setItem('userSessionData', JSON.stringify(data));
}

// function to open pop up

function openPopUp() {
    document.getElementById("popUpAll").style.display = 'flex';
}

function closePopUp() {
    document.getElementById("popUpAll").style.display = 'none';

    // for the new study times after the algorithm

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
    overallRating = Number(document.getElementById("overallSlider").value);
    studyRating = Number(document.getElementById("studySlider").value);
    breakRating = Number(document.getElementById("breakSlider").value);
    afterRating = Number(document.getElementById("afterSlider").value);
    motivationRating = Number(document.getElementById("motivationSlider").value);

    ratings = [overallRating, studyRating, breakRating, afterRating, motivationRating]; // for storage

    // call function to output a recommended time for study and break, let this depend on the number of entries done

    // check the length of data tables
    const userData = loadData();    
    const userDataLength = userData.length; // not used for now

    // DEFAULT call the weighted avg. but later implement the others
    
    const { studyTime: calculatedStudyTime, breakTime: calculatedBreakTime } = weightedAverage(ratings, studyTime, breakTime);
    
    // save data to local storage
    saveSessionData({ 
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        studyTime: studyTime,
        breakTime: breakTime,
        newStudyTime: calculatedStudyTime,
        newBreakTime: calculatedBreakTime,
        ratings: ratings
    });

    studyTime = calculatedStudyTime;
    breakTime = calculatedBreakTime;

    newBreakTime_min = Math.floor(breakTime/60);
    newBreakTime_sec = breakTime%60
    newStudyTime_min = Math.floor(studyTime/60);
    newStudyTime_sec = studyTime%60;

    recommendedTimeDisplay.textContent = `Study time: ${newStudyTime_min}m ${newStudyTime_sec}s, Break time: ${newBreakTime_min}m ${newBreakTime_sec}s`;

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

    if (breakToggle.checked == false) {
        time = studyTime
    } else {
        time = breakTime
    }

    minutes = Math.trunc(time/60);
    seconds = time%60; 

    timer.textContent = minutes + "m" + seconds + "s";

    startButton.disabled = true;
    stopButton.disabled = false;
    resetButton.disabled = true;
    breakToggle.disabled = true;
    stopped = false;
    reset = false;
    poppedUp = false;
});

// handles what happens when you press the stop button
stopButton.addEventListener("click", () => {
    stopButton.disabled = true;
    startButton.disabled = false;
    resetButton.disabled = false;
    stopped = true;
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

    // mark that reset has happened
    poppedUp = false;
    reset = true;

});

// timer handler, setInterval uses milliseconds as a unit
setInterval(() => {
    if (stopped == false) {
        if (seconds == 0 && minutes > 0) {
            --minutes;
            seconds = 59;
        } else if (seconds > 0) {  // ✅ only decrement if seconds > 0
            --seconds;
        }

        time = (minutes * 60) + seconds;
        timer.textContent = minutes + "m " + seconds + "s";
    }

    if (time <= 0 && poppedUp == false && reset == false) {
        openPopUp();
        stopped = true;
        poppedUp = true;
    }
}, 1);


// !! FURTHER NOTES BELOW.

// HANDLING THE ALGORITHM FOR STUDY TIMING.

/*
    Algorithms to use:
    
    Global variable regarding the amount of sessions there have been done i.e. after a consecutive study and break, increment

    < 20: weighted average algorithm
    20-50: linear regression
    50+: random forest
    100+: neural network
*/