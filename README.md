# Pathfinder-A-Star

## Overview

Pathfinder-A-Star allows users to create custom grid environments with obstacles and resources, then watch an automaton intelligently navigate from a starting position to collect all resources and reach a goal position using the A* algorithm.

## Features

- **Interactive Grid Setup**: Click-to-place interface for building custom environments
- **Resource Collection**: Place multiple resources that the automaton must collect
- **Multi-Target Navigation**: Automaton finds optimal paths to collect all resources before reaching the final goal
- **Step-by-Step or Real-Time**: Watch the automaton move one step at a time or run the simulation
- **Keyboard Shortcuts**: Full keyboard support

## How It Works

### A* Algorithm

The pathfinding is powered by the A* algorithm implemented in `Automaton.js`:

- **Heuristic**: Manhattan distance (`|x1 - x2| + |y1 - y2|`)
- **Cost Function**: `f(n) = g(n) + h(n)` where `g` is the cost from start and `h` is estimated cost to goal
- **Multi-Target Pathfinding**: The automaton calculates paths to all resources, visiting them in order of proximity, then to the final goal

### Environment

- Grid (default: 20×20 cells)
- Each cell is 40×40 pixels
- Resources are single-cell collectibles

## Usage

### Setup

1. **Set Obstacles** [O]: Click two cells to define opposite corners of a rectangular obstacle
2. **Set Resources** [R]: Click cells to place resources (must place all, default=3)
3. **Set Start/Goal** [G]: Click two cells - first is the automaton's starting position, second is the goal

### Simulation

- **Step** [S]: Advance the simulation one step at a time
- **Start** [Spacebar]: Run the simulation automatically (100ms intervals)
- **Stop** [Spacebar]: Pause the automatic simulation
- **Reset** [Backspace]: Clear the environment and start over

### UI Elements

- **Resources Counter**: Shows collected resources (turns from gray to black when collected)
- **Completed Status**: Displays "yes" when the automaton reaches the goal after collecting all resources

## Code Architecture

### Core Classes

| Class | File | Purpose |
|-------|------|---------|
| `Environment` | `Environment.js` | Manages the grid, obstacles, and resources |
| `Obstacle` | `Obstacle.js` | Defines obstacle boundaries and collision detection |
| `State` | `State.js` | Represents a node (position, costs, parent) |
| `Automaton` | `Automaton.js` | Implements A* algorithm and multi-target pathfinding |
| `Component` | `Component.js` | Renders game objects on canvas and movement |
| `GameArea` | `GameArea.js` | Manages canvas, user interactions, and game loop |

## Running the Project

- Visit: https://azoto-liquido.github.io/Pathfinder-A-Star/

- Download the code and open `index.html` in any web browser. No build process or server required.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `O` | Set obstacles mode |
| `R` | Set resources mode |
| `G` | Set start/goal mode |
| `S` | Step forward |
| `Space` | Toggle start/stop |
| `Backspace` | Reset |

## Color Legend

- **Blue** - Obstacles (impassable)
- **Yellow** - Resources (collectible items)
- **Red** - Automaton (the pathfinding agent)
- **Green** - Goal position
- **Orange** - Temporary highlight during obstacle placement

## TODOs

- [X] Configurable parameters (grid size, resources number)
- [ ] Path visualization before simulation
- [ ] Cost assignment to each node
