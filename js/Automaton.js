class Automaton{

    expandable = [];
    expanded = [];

    constructor(x, y, env, goalX, goalY, width, height){
        this.initialX = x;
        this.initialY = y;
        this.env = env;
        this.goalX = goalX;
        this.goalY = goalY;
        this.width = width;
        this.height = height;
    }

    getSuccessors(state){
        let successors = [];
        let x = state.x;
        let y = state.y;
        // Right
        if(x + 1 + this.width - 1 < this.env.width){
            if(!this.env.underObstacle(x + 1, y, this.width, this.height)){
                successors.push(new State(x + 1, y, state.g + 1, this.heuristic(x + 1, y), state));
            }
        }
        // Left
        if(x - 1 >= 0){
            if(!this.env.underObstacle(x - 1, y, this.width, this.height)){
                successors.push(new State(x - 1, y, state.g + 1, this.heuristic(x - 1, y), state));
            }
        }
        // Down
        if(y + 1 + this.height - 1 < this.env.height){
            if(!this.env.underObstacle(x, y + 1, this.width, this.height)){
                successors.push(new State(x, y + 1, state.g + 1, this.heuristic(x, y + 1), state));
            }
        }
        // Up
        if(y - 1 >= 0){
            if(!this.env.underObstacle(x, y - 1, this.width, this.height)){
                successors.push(new State(x, y - 1, state.g + 1, this.heuristic(x, y - 1), state));
            }
        }

        this.removeExpandedSuccessors(successors);

        return successors;
    }

    removeExpandedSuccessors(successors){
        for (let i = 0; i < this.expanded.length; i++){
            for (let j = 0; j < successors.length; j++){
                if(this.expanded[i].isEqual(successors[j])){
                    if(successors[j].g < this.expanded[i].g){
                        this.expanded[i].g = successors[j].g;
                        this.expanded[i].previous = successors[j].previous;
                    }
                    successors.splice(j, 1);
                }
            }
        }
        for (let i = 0; i < this.expandable.length; i++){
            for (let j = 0; j < successors.length; j++){
                if(this.expandable[i].isEqual(successors[j])){
                    if(successors[j].g < this.expandable[i].g){
                        this.expandable[i].g = successors[j].g;
                        this.expandable[i].previous = successors[j].previous;
                    }
                    successors.splice(j, 1);
                }
            }
        }
    }

    getPosLowestF(){
        let minF = Number.MAX_SAFE_INTEGER;
        let posMinF;
        for(let i = 0; i < this.expandable.length; i++){
            if(this.expandable[i].f() < minF){
                minF = this.expandable[i].f();
                posMinF = i;
            }
        }
        return posMinF;
    }

    aStar(){
        this.expandable = [];
        this.expanded = [];

        this.expandable.push(new State(this.initialX, this.initialY, 0, this.heuristic(this.initialX, this.initialY), null));
        do{
            let posMinF = this.getPosLowestF();
            if(this.expandable[posMinF].h == 0){
                let path = [];
                let state = this.expandable[posMinF];

                while(state.previous != null){
                    path.push(state);
                    state = state.previous;
                }

                return path.reverse();
            }
            let successors = this.getSuccessors(this.expandable[posMinF]);
            this.expanded.push(this.expandable[posMinF]);
            this.expandable.splice(posMinF, 1);
            this.expandable = this.expandable.concat(successors);
        }while(this.expandable.length > 0);
        return [];
    }

    heuristic(stateX, stateY){
        return Math.abs(stateX - this.goalX) + Math.abs(stateY - this.goalY);
    }


}