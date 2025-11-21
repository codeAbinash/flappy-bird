import { GameStateManager } from './StateManager';

export class GameLoop {
    private lastTime: number = 0;
    private accumulator: number = 0;
    private readonly timestep: number = 1000 / 60;
    private stateManager: GameStateManager;

    constructor(stateManager: GameStateManager) {
        this.stateManager = stateManager;
        this.update = this.update.bind(this);
    }

    public start(): void {
        requestAnimationFrame(this.update);
    }

    private update(currentTime: number): void {
        if (this.lastTime === 0) {
            this.lastTime = currentTime;
        }

        const deltaTime = currentTime - this.lastTime;
        this.accumulator += deltaTime;

        while (this.accumulator >= this.timestep) {
            this.stateManager.update(this.timestep);
            this.accumulator -= this.timestep;
        }

        this.stateManager.render();
        this.lastTime = currentTime;
        requestAnimationFrame(this.update);
    }
}
