class Component {

    constructor(width, height, x, y, color, ga, move, goalX, goalY) {
        this.pixelsPerState = ga.pixelsPerState;
        this.width = width * this.pixelsPerState;
        this.height = height * this.pixelsPerState;
        this.componentWidth = width;
        this.componentHeight = height;
        this.x = x * this.pixelsPerState;
        this.y = y * this.pixelsPerState;
        this.color = color;
        this.ga = ga;
        this.ctx = ga.context;
        this.move = move;
        this.i = -1;
        this.path = [];

        if (move) {
            /*
            let goalX, goalY;
            do {
                goalX = Math.floor(Math.random() * (this.ga.env.width - this.componentWidth + 1));
                goalY = Math.floor(Math.random() * (this.ga.env.height - this.componentHeight + 1));
            } while (this.ga.env.underObstacle(goalX, goalY, this.componentWidth, this.componentHeight) || (goalX == x && goalY == y));
            */

            this.automaton = new Automaton(x, y, ga.env, goalX, goalY, this.componentWidth, this.componentHeight);

            this.path = this.automaton.aStar();
        }

    }

    update() {
        if (this.move && this.i >= 0) this.newPos();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.move && this.path != null && this.i < this.path.length) {
            this.i++;
        } 
        /*
        else if (this.move && this.path != null) {
            // alert("Finished!");
            this.i = 0;
            let goalX, goalY;
            let currentX = Math.floor(this.x / this.pixelsPerState);
            let currentY = Math.floor(this.y / this.pixelsPerState);
            do {
                goalX = Math.floor(Math.random() * this.ga.env.width);
                goalY = Math.floor(Math.random() * this.ga.env.height);
            } while (this.ga.env.underObstacle(goalX, goalY) || (goalX == currentX && goalY == currentY));

            this.automaton.initalX = currentX;
            this.automaton.initialY = currentY;
            this.automaton.goalX = goalX;
            this.automaton.goalY = goalY;
            
            this.path = this.automaton.aStar();
        }*/
    }

    newPos() {
        if (this.move && this.path != null && this.i < this.path.length) {
            this.state = this.path[this.i];
            this.x = this.state.x * this.pixelsPerState;
            this.y = this.state.y * this.pixelsPerState;
        }
    }
}