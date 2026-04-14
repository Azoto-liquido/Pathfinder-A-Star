class GameArea {

    goals = [];
    maxResources = 3;
    resourcesNumber = 1;

    constructor(width, height, pixelsPerState) {
        this.components = [];
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("style", "border: 3px solid black");
        this.pixelsPerState = pixelsPerState;
        this.env = new Environment(width, height, pixelsPerState);
        this.canvas.width = width * pixelsPerState;
        this.canvas.height = height * pixelsPerState;
        this.obstacleStart = null;
        this.startGoalStart = null;
        this.selectionMode = null;
        this.start();
    }

    start() {
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.canvas.addEventListener("click", (e) => this.handleCanvasClick(e));
        this.updateGameArea();
    }

    drawGrid() {
        this.context.beginPath();
        for (let rows = this.pixelsPerState; rows < this.canvas.width; rows += this.pixelsPerState) {
            this.context.moveTo(0, rows);
            this.context.lineTo(this.canvas.width, rows);
        }
        for (let columns = this.pixelsPerState; columns < this.canvas.width; columns += this.pixelsPerState) {
            this.context.moveTo(columns, 0);
            this.context.lineTo(columns, this.canvas.height);
        }
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 0.5;
        this.context.stroke();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addComponent(component) {
        this.components.push(component);
    }

    updateGameArea() {
        this.clear();
        this.drawGrid();
        for (const component of this.components) {
            component.update();
            if (component.id === "1" && this.env.resourceUnder(this.getCell(component.x), this.getCell(component.y), this.getCell(component.width), this.getCell(component.height))) {
                const resourceIndex = this.components.findIndex(r => r.id === "2" && r.x === component.x && r.y === component.y);
                this.env.takeResource(this.getCell(this.components[resourceIndex].x), this.getCell(this.components[resourceIndex].y));
                this.components.splice(resourceIndex, 1);
                document.getElementById("res" + this.resourcesNumber++).style.color = "black";
            }
        }

        if (this.selectionMode === "startGoal" && this.startGoalStart) {
            this.context.strokeStyle = "red";
            this.context.lineWidth = 2;
            const xStart = this.startGoalStart.x * this.pixelsPerState;
            const yStart = this.startGoalStart.y * this.pixelsPerState;
            this.context.strokeRect(xStart, yStart, this.pixelsPerState, this.pixelsPerState);
        }

        if (this.goals.length > 0) {
            this.context.strokeStyle = "green";
            this.context.lineWidth = 2;
            this.context.strokeRect(this.goals[0] * this.pixelsPerState, this.goals[1] * this.pixelsPerState, this.pixelsPerState, this.pixelsPerState);
        }
    }

    stopAutoUpdate() {
        clearInterval(this.interval);
    }

    startAutoUpdate() {
        this.interval = setInterval(this.updateGameArea.bind(this), 100);
    }

    // ------ Setup ------
    getCell(value) {
        return Math.floor(value / this.pixelsPerState);
    }

    setObstacle() {
        this.obstacleStart = null;
        this.selectionMode = "obstacles";
        this.disableButtons();
    }

    setResource() {
        this.selectionMode = "resources";
        this.disableButtons();
    }

    setStartAndGoal() {
        this.startGoalStart = null;
        this.selectionMode = "startGoal";
        this.disableButtons();
    }

    disableButtons() {
        document.querySelectorAll("#buttons button").forEach(b => {
            b.disabled = true;
        });
    }

    handleCanvasClick(event) {
        if (this.selectionMode == null) return;

        const obstacles = document.getElementById("obstacles");
        const resources = document.getElementById("resources");
        const startAndGoals = document.getElementById("startGoals");

        let rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        let cellX, cellY;

        switch (this.selectionMode) {
            case "obstacles":
                if (this.obstacleStart === null) {
                    this.obstacleStart = { x, y };
                    this.context.fillStyle = "orange";
                    this.context.fillRect(this.getCell(x) * this.pixelsPerState, this.getCell(y) * this.pixelsPerState, this.pixelsPerState, this.pixelsPerState);
                } else {
                    const x1 = this.obstacleStart.x;
                    const y1 = this.obstacleStart.y;
                    const xState1 = this.getCell(x1);
                    const yState1 = this.getCell(y1);
                    const xState2 = this.getCell(x);
                    const yState2 = this.getCell(y);
                    const xStart = Math.min(xState1, xState2);
                    const yStart = Math.min(yState1, yState2);
                    const width = Math.abs(xState2 - xState1) + 1;
                    const height = Math.abs(yState2 - yState1) + 1;

                    if (this.env.resourceUnder(xStart, yStart, width, height)) return;

                    this.env.addObstacle(xStart, yStart, width, height);
                    const newObstacle = this.env.obstacles[this.env.obstacles.length - 1];
                    this.addComponent(new Component(newObstacle.width, newObstacle.height, newObstacle.x, newObstacle.y, "blue", this, "0", null, null));
                    this.selectingObstacles = false;
                    this.selectionMode = null;
                    this.obstacleStart = null;
                    this.updateGameArea();
                    handleClick(obstacles, null, null);
                }
                break;
            case "resources":
                if (this.env.underObstacle(this.getCell(x), this.getCell(y), 1, 1)) {
                    return;
                }
                cellX = this.getCell(x);
                cellY = this.getCell(y);
                this.env.addResources(cellX, cellY);
                this.addComponent(new Component(1, 1, cellX, cellY, "yellow", this, "2", null, null));
                this.selectingResources = false;
                this.selectionMode = null;
                this.updateGameArea();
                handleClick(resources, null, null);
                break;
            case "startGoal":
                if (this.env.underObstacle(this.getCell(x), this.getCell(y), 1, 1)) {
                    return;
                }
                cellX = this.getCell(x);
                cellY = this.getCell(y);
                if (this.startGoalStart === null) {
                    if (this.env.underObstacle(this.getCell(x), this.getCell(y), 1, 1)) {
                        return;
                    }
                    this.startGoalStart = { x: cellX, y: cellY };
                    this.updateGameArea();
                    break;
                }
                const startX = this.startGoalStart.x;
                const startY = this.startGoalStart.y;
                const goalX = cellX;
                const goalY = cellY;
                this.goals = [goalX, goalY];

                this.addComponent(new Component(1, 1, startX, startY, "red", this, "1", goalX, goalY));
                this.selectingStartGoal = false;
                this.selectionMode = null;
                this.startGoalStart = null;
                this.updateGameArea();
                handleClick(startAndGoals, null, null);
                break;
        }
    }
}