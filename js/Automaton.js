class Automaton {

    expandable = [];
    expanded = [];

    constructor(x, y, env, goalX, goalY, width, height, resources) {
        this.initialX = x;
        this.initialY = y;
        this.env = env;
        this.goalX = goalX;
        this.goalY = goalY;
        this.width = width;
        this.height = height;
        this.resources = resources;
    }

    getSuccessors(state, goalX, goalY) {
        let successors = [];
        let x = state.x;
        let y = state.y;
        if (x + 1 + this.width - 1 < this.env.size) {
            if (!this.env.underObstacle(x + 1, y, this.width, this.height)) {
                successors.push(new State(x + 1, y, state.g + 1, this.heuristic(x + 1, y, goalX, goalY), state));
            }
        }
        if (x - 1 >= 0) {
            if (!this.env.underObstacle(x - 1, y, this.width, this.height)) {
                successors.push(new State(x - 1, y, state.g + 1, this.heuristic(x - 1, y, goalX, goalY), state));
            }
        }
        if (y + 1 + this.height - 1 < this.env.size) {
            if (!this.env.underObstacle(x, y + 1, this.width, this.height)) {
                successors.push(new State(x, y + 1, state.g + 1, this.heuristic(x, y + 1, goalX, goalY), state));
            }
        }
        if (y - 1 >= 0) {
            if (!this.env.underObstacle(x, y - 1, this.width, this.height)) {
                successors.push(new State(x, y - 1, state.g + 1, this.heuristic(x, y - 1, goalX, goalY), state));
            }
        }

        this.removeExpandedSuccessors(successors);

        return successors;
    }

    removeExpandedSuccessors(successors) {
        for (let i = 0; i < this.expanded.length; i++) {
            for (let j = 0; j < successors.length; j++) {
                if (this.expanded[i].isEqual(successors[j])) {
                    if (successors[j].g < this.expanded[i].g) {
                        this.expanded[i].g = successors[j].g;
                        this.expanded[i].previous = successors[j].previous;
                    }
                    successors.splice(j, 1);
                }
            }
        }
        for (let i = 0; i < this.expandable.length; i++) {
            for (let j = 0; j < successors.length; j++) {
                if (this.expandable[i].isEqual(successors[j])) {
                    if (successors[j].g < this.expandable[i].g) {
                        this.expandable[i].g = successors[j].g;
                        this.expandable[i].previous = successors[j].previous;
                    }
                    successors.splice(j, 1);
                }
            }
        }
    }

    getPosLowestF() {
        let minF = Number.MAX_SAFE_INTEGER;
        let posMinF;
        for (let i = 0; i < this.expandable.length; i++) {
            if (this.expandable[i].f() < minF) {
                minF = this.expandable[i].f();
                posMinF = i;
            }
        }
        return posMinF;
    }

    pathfinder() {
        let resourcesPaths = [];
        for (const r of this.resources) {
            resourcesPaths.push(this.aStar(this.initialX, this.initialY, r.x, r.y));
        }

        resourcesPaths = resourcesPaths.filter(p => p.length > 0);

        if (resourcesPaths.length > 1) resourcesPaths.sort((a, b) => a.length - b.length);

        if (resourcesPaths.length == 0) {
            const goalPath = this.aStar(this.initialX, this.initialY, this.goalX, this.goalY);
            if (goalPath.length === 0) {
                alert("Automaton is completely blocked! Cannot reach any resource or the goal.");
                end();
                return [];
            }
            alert("No reachable resource! Reaching the goal without any resources.");
            return goalPath;
        }

        const firstPath = resourcesPaths[0];

        let lastState = firstPath[firstPath.length - 1];
        const visitedResource = this.resources.find(r => r.x === lastState.x && r.y === lastState.y);
        let remaining = this.resources.filter(r => r !== visitedResource);
        
        resourcesPaths = [firstPath];

        let noResource = false;

        while (remaining.length > 0) {
            remaining.sort((a, b) =>
                this.aStar(lastState.x, lastState.y, a.x, a.y).length - this.aStar(lastState.x, lastState.y, b.x, b.y).length
            );
            const nearest = remaining.shift();
            const nextPath = this.aStar(lastState.x, lastState.y, nearest.x, nearest.y);
            if (nextPath.length == 0) {
                if (!noResource) {
                    alert("No path found to 1 or more resources.");
                    noResource = true;
                }
                continue;
            }
            resourcesPaths.push(nextPath);
            lastState = nextPath[nextPath.length - 1];
        }

        let path = [];
        for (const rPath of resourcesPaths) {
            for (const state of rPath) {
                path.push(state);
            }
        }

        const lastPath = resourcesPaths[resourcesPaths.length - 1];
        lastState = lastPath[lastPath.length - 1];
        const final = this.aStar(lastState.x, lastState.y, this.goalX, this.goalY);
        for (const state of final) {
            path.push(state);
        }

        return path;
    }

    aStar(startX, startY, goalX, goalY) {
        this.expandable = [];
        this.expanded = [];

        this.expandable.push(new State(startX, startY, 0, this.heuristic(startX, startY, goalX, goalY), null));
        do {
            let posMinF = this.getPosLowestF();
            if (this.expandable[posMinF].h == 0) {
                let path = [];
                let state = this.expandable[posMinF];

                while (state.previous != null) {
                    path.push(state);
                    state = state.previous;
                }

                return path.reverse();
            }
            let successors = this.getSuccessors(this.expandable[posMinF], goalX, goalY);
            this.expanded.push(this.expandable[posMinF]);
            this.expandable.splice(posMinF, 1);
            this.expandable = this.expandable.concat(successors);
        } while (this.expandable.length > 0);
        return [];
    }

    heuristic(stateX, stateY, goalX, goalY) {
        return Math.abs(stateX - goalX) + Math.abs(stateY - goalY);
    }
}