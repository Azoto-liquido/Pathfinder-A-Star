const obstacles = document.getElementById("obstacles");
const resources = document.getElementById("resources");
const startAndGoals = document.getElementById("startGoals");
const step = document.getElementById("step");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");

const alerts = document.getElementById("alerts");
const alertDelay = 3000;

let maxResources = ga.maxResources;
let resourcesNumber = 0;

let obstaclesPlaced = false;

const form = document.getElementById("form");
const submit = document.getElementById("formButton");

form.addEventListener('submit', (event) => {
    maxResources = form.resources.value;
    ga.maxResources = form.resources.value;
    loadSettings();
    ga.setDimension(form.grid.value);
});

function initialize() {
    form.resources.value = 3;
    ga.maxResources = 3;
    maxResources = ga.maxResources;
    ga.resourcesNumber = 0;
    resourcesNumber = 0;
    form.grid.value = 20;
    loadSettings();
    obstaclesPlaced = false;

    obstacles.disabled = false;
    resources.disabled = false;
    startAndGoals.disabled = true;
    step.disabled = true;
    start.disabled = true;
    stop.disabled = true;
    reset.disabled = true;
    submit.disabled = false;
    alerts.style.display = "none";
}

window.addEventListener("load", initialize);

function loadSettings() {
    const display = document.getElementById("resources-display");
    display.textContent = "Resources:";
    
    for (let i = 0; i < maxResources; i++) {
        const span = document.createElement("span");
        span.textContent = "★";
        span.className = "res";
        span.id = "res" + i;
        display.append(" ");
        display.appendChild(span);
    }
}

function handleClick(button, ga, env) {
    switch (button.id) {
        case "obstacles":
            obstaclesPlaced = true;
            obstacles.disabled = false;
            if (resourcesNumber < maxResources) resources.disabled = false;
            reset.disabled = false;
            submit.disabled = true;
            alerts.style.display = "none";
            if (startAndGoals.disabled && obstaclesPlaced && resourcesNumber == maxResources) {
                startAndGoals.disabled = false;
            }
            break;
        case "resources":
            obstacles.disabled = false;
            reset.disabled = false;
            submit.disabled = true;
            alerts.style.display = "none";
            if (resourcesNumber < maxResources - 1) {
                resourcesNumber++;
                resources.disabled = false;
            } else if (resourcesNumber == maxResources - 1) {
                resourcesNumber++;
                resources.disabled = true;
            }
            if (startAndGoals.disabled && obstaclesPlaced && resourcesNumber == maxResources) {
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
            /*
            form.resources.value = 3;
            ga.maxResources = 3;
            maxResources = ga.maxResources;
            form.grid.value = 20;
            */
            ga.resourcesNumber = 0;
            resourcesNumber = 0;
            obstacles.disabled = false;
            resources.disabled = false;
            startAndGoals.disabled = true;
            step.disabled = true;
            start.disabled = true;
            stop.disabled = true;
            reset.disabled = true;
            submit.disabled = false;
            ga.components = [];
            env.obstacles = [];
            ga.goals = [];
            ga.updateGameArea();
            document.getElementById("finish").innerHTML = "no";
            const res = document.getElementsByClassName("res");
            for (const r of res) {
                r.style.color = "gray";
            }
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