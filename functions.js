export function weightedAverage(ratings, studyTime, breakTime) { // function is to be used in the timer handler

    // these will be changed to output times based off of the algorithm
    let currentStudyTime = studyTime;
    let currentBreakTime = breakTime;

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

    return { studyTime: currentStudyTime, breakTime: currentBreakTime };
}