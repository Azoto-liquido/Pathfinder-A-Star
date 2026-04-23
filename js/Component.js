class Component {

    constructor(width, height, x, y, color, ga, id, goalX, goalY) {
        this.pixelsPerState = ga.pixelsPerState;
        this.width = width * this.pixelsPerState;
        this.height = height * this.pixelsPerState;
        this.componentWidth = width;
        this.componentHeight = height;
        this.x = x * this.pixelsPerState;
        this.y = y * this.pixelsPerState;
        this.goalX = goalX * this.pixelsPerState;
        this.goalY = goalY * this.pixelsPerState;
        this.color = color;
        this.ga = ga;
        this.ctx = ga.context;
        this.id = id;
        /*
            ID =
            0: obstacle
            1: can move (automaton)
            2: resource
        */

        this.i = -1;

        if (id === "1") {
            /*
            let goalX, goalY;
            do {
                goalX = Math.floor(Math.random() * (this.ga.env.size - this.componentWidth + 1));
                goalY = Math.floor(Math.random() * (this.ga.env.size - this.componentHeight + 1));
            } while (this.ga.env.underObstacle(goalX, goalY, this.componentWidth, this.componentHeight) || (goalX == x && goalY == y));
            */

            this.automaton = new Automaton(x, y, ga.env, goalX, goalY, this.componentWidth, this.componentHeight, ga.env.getResources());

            this.path = this.automaton.pathfinder();

        }

    }

    update() {
        if (this.id === "1" && this.path != null && this.i == this.path.length) {
            end();
            if (this.x == this.goalX && this.y == this.goalY) {
                document.getElementById("finish").innerHTML = "yes";
                alert("Finished!");
            } else {
                alert("!Finished. Make sure to insert the goal position in a reachable spot.")
            }
        }

        if (this.id && this.i >= 0) this.newPos();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.id === "1" && this.path != null && this.i < this.path.length) {
            this.i++;
        }
        /*
        else if (this.id && this.path != null) {
            // alert("Finished!");
            this.i = 0;
            let goalX, goalY;
            let currentX = Math.floor(this.x / this.pixelsPerState);
            let currentY = Math.floor(this.y / this.pixelsPerState);
            do {
                goalX = Math.floor(Math.random() * this.ga.env.size);
                goalY = Math.floor(Math.random() * this.ga.env.size);
            } while (this.ga.env.underObstacle(goalX, goalY) || (goalX == currentX && goalY == currentY));

            this.automaton.initalX = currentX;
            this.automaton.initialY = currentY;
            this.automaton.goalX = goalX;
            this.automaton.goalY = goalY;
            
            this.path = this.automaton.aStar();
        }*/
    }

    newPos() {
        if (this.id === "1" && this.path != null && this.i < this.path.length) {
            this.state = this.path[this.i];
            this.x = this.state.x * this.pixelsPerState;
            this.y = this.state.y * this.pixelsPerState;
        }
    }
}