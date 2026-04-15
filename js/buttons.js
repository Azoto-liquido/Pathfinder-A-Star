const obstacles = document.getElementById("obstacles");
const resources = document.getElementById("resources");
const startAndGoals = document.getElementById("startGoals");
const step = document.getElementById("step");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");

const alerts = document.getElementById("alerts");
const alertDelay = 3000;

const maxResources = ga.maxResources;
let resourcesNumber = 0;

let obstaclesPlaced = false;

function initializeButtons() {
    resourcesNumber = 0;
    obstaclesPlaced = false;

    obstacles.disabled = false;
    resources.disabled = false;
    startAndGoals.disabled = true;
    step.disabled = true;
    start.disabled = true;
    stop.disabled = true;
    reset.disabled = true;
    alerts.style.display = "none";
}

window.addEventListener("load", initializeButtons);

function handleClick(button, ga, env) {
    switch (button.id) {
        case "obstacles":
            obstaclesPlaced = true;
            obstacles.disabled = false;
            if (resourcesNumber < maxResources) resources.disabled = false;
            reset.disabled = false;
            alerts.style.display = "none";
            if (startAndGoals.disabled && resourcesNumber === maxResources) {
                startAndGoals.disabled = false;
            }
            break;
        case "resources":
            obstacles.disabled = false;
            reset.disabled = false;
            alerts.style.display = "none";
            if (resourcesNumber < maxResources - 1) {
                resourcesNumber++;
                resources.disabled = false;
            } else if (resourcesNumber === maxResources - 1) {
                resourcesNumber++;
                resources.disabled = true;
            }
            if (resourcesNumber === maxResources && obstaclesPlaced && startAndGoals.disabled) {
                startAndGoals.disabled = false;
            }
            break;
        case "startGoals":
            obstacles.disabled = true;
            resources.disabled = true;
            startAndGoals.disabled = true;
            step.disabled = false;
            start.disabled = false;
            reset.disabled = false;
            alerts.style.display = "none";
            break;
        case "start":
            step.disabled = true;
            start.disabled = true;
            stop.disabled = false;
            reset.disabled = true;
            break;
        case "stop":
            step.disabled = false;
            start.disabled = false;
            stop.disabled = true;
            reset.disabled = false;
            break;
        case "reset":
            resourcesNumber = 0;
            obstacles.disabled = false;
            resources.disabled = false;
            startAndGoals.disabled = true;
            step.disabled = true;
            start.disabled = true;
            stop.disabled = true;
            reset.disabled = true;
            ga.components = [];
            env.obstacles = [];
            ga.goals = [];
            ga.updateGameArea();
            document.getElementById("finish").innerHTML = "no";
            document.getElementById("res1").style.color = "gray";
            document.getElementById("res2").style.color = "gray";
            document.getElementById("res3").style.color = "gray";
            break;
    }
}

function handleAlerts(button) {
    alerts.style.display = "block";
    switch (button.id) {
        case "obstacles":
            alerts.innerHTML = "Click two cells to set the corners of the obstacle";
            break;
        case "resources":
            alerts.innerHTML = "Click a cell to place a resource";
            break;
        case "startGoals":
            alerts.innerHTML = "Click two cells: start and goal";
            break;
        case "start":
            alerts.innerHTML = "Simulation started";
            break;
        case "stop":
            alerts.innerHTML = "Simulation stopped";
            setTimeout(() => {
                alerts.style.display = "none";
            }, alertDelay);
            break;
        case "reset":
            alerts.innerHTML = "Reset";
            setTimeout(() => {
                alerts.style.display = "none";
            }, alertDelay);
            break;
    }
}

document.addEventListener('keydown', e => {
    switch (e.code) {
        case "KeyO":
            if (!obstacles.disabled) {
                ga.setObstacle();
                handleAlerts(obstacles);
            }
            break;
        case "KeyR":
            if (!resources.disabled) {
                ga.setResource();
                handleAlerts(resources);
            }
            break;
        case "KeyG":
            if (!startAndGoals.disabled) {
                ga.setStartAndGoal();
                handleClick(startAndGoals, null, null);
                handleAlerts(startAndGoals);
            }
            break;
        case "KeyS":
            if (!step.disabled) {
                ga.updateGameArea();
            }
            break;
        case "Space":
            if (stop.disabled) {
                if (!start.disabled) {
                    ga.startAutoUpdate();
                    handleClick(start, null, null);
                    handleAlerts(start);
                }
            } else {
                if (!stop.disabled) {
                    ga.stopAutoUpdate();
                    handleClick(stop, null, null);
                    handleAlerts(stop);
                }
            }
            break;
        case "Backspace":
            if (!reset.disabled) {
                ga.stopAutoUpdate();
                handleClick(reset, ga, ga.env);
                handleAlerts(reset);
            }
            break;
    }
});