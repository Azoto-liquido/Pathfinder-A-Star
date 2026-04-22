class Environment {
    constructor(size, pixelPerState) {
        this.size = size;
        this.pixelPerState = pixelPerState;

        this.grid = [];
        for (let y = 0; y < size; y++) {
            this.grid[y] = [];
            for (let x = 0; x < size; x++) {
                this.grid[y][x] = { type: 'empty', hasResource: false };
            }
        }

        this.obstacles = [];
    }

    addObstacle(x, y, width, height) {
        this.obstacles.push(new Obstacle(x, y, width, height));
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                this.grid[y + dy][x + dx] = { type: 'wall', hasResource: false };
            }
        }
    }

    addResources(x, y) {
        this.grid[y][x].hasResource = true;
    }

    isResource(x, y) {
        return this.grid[y][x].hasResource;
    }

    takeResource(x, y) {
        this.grid[y][x].hasResource = false;
    }

    resourceUnder(x, y, width, height) {
        for (let dy = y; dy < y + height; dy++) {
            for (let dx = x; dx < x + width; dx++) {
                if (this.grid[dy][dx].hasResource) return true;
            }
        }
        return false;
    }

    getResources() {
        const resources = [];
        for (let dy = 0; dy < this.size; dy++) {
            for (let dx = 0; dx < this.size; dx++) {
                if (this.grid[dy][dx].hasResource) resources.push({ x: dx, y: dy });
            }
        }
        return resources;
    }

    underObstacle(x, y, width, height) {
        for (let dx = 0; dx < width; dx++) {
            for (let dy = 0; dy < height; dy++) {
                for (let i = 0; i < this.obstacles.length; i++) {
                    if (this.obstacles[i].isUnder(x + dx, y + dy)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
