const obstacles = document.getElementById("obstacles");
const resources = document.getElementById("resources");
const startAndGoals = document.getElementById("startGoals");
const step = document.getElementById("step");
const start = document.getElementById("start");
const stop = document.getElementById("stop");

const alerts = document.getElementById("alerts");
const alertDelay = 3000;

const maxResources = 3;
let resourcesNumber = 0;

let obstaclesPlaced = false;

function handleClick(button, ga, env) {
    switch (button.id) {
        case "obstacles":
            obstaclesPlaced = true;
            obstacles.disabled = false;
            if (resourcesNumber < maxResources - 1) resources.disabled = false;
            reset.disabled = false;
            alerts.style.display = "none";
            if (startAndGoals.disabled && resourcesNumber == maxResources - 1) {
                startAndGoals.disabled = false;
            }
            break;
        case "resources":
            obstacles.disabled = false;
            resources.disabled = false;
            reset.disabled = false;
            if (resourcesNumber < maxResources - 1) {
                resourcesNumber++;
            } else {
                resources.disabled = true;
                if (startAndGoals.disabled && obstaclesPlaced) {
                    startAndGoals.disabled = false;
                }
            }
            alerts.style.display = "none";
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
            ga.updateGameArea();
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