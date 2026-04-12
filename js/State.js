class State{
    constructor(x, y, g, h, previous){
        this.x = x;
        this.y = y;
        this.g = g;
        this.h = h;
        this.previous = previous;
    }

    // return the cost to get to this state from the initial state
    g(){
        if(this.previous != null){
            return this.previous.g() + 1;
        }
        return 0;
    }

    f(){
        return this.g + this.h;
    }

    // check if this State opbject is the same as state
    // state is another object of State class
    isEqual(state){
        return state.x == this.x && state.y == this.y;
    }
}