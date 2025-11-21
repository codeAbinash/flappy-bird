import { GameAssets } from '../../config/assetConfigs';

export class Pipe {
    private x: number;
    private gapY: number;
    private readonly gapHeight: number = 150;
    private readonly width: number;
    private readonly speed: number = 2;
    private scored: boolean = false;
    private readonly groundHeight: number = 100;
    private assets: GameAssets;

    constructor(canvasWidth: number, canvasHeight: number, assets: GameAssets) {
        this.x = canvasWidth;
        this.width = assets.obstacle.width;
        this.assets = assets;

        const minGapY = this.gapHeight;
        const maxGapY = canvasHeight - this.groundHeight - this.gapHeight / 2;
        this.gapY = Math.random() * (maxGapY - minGapY) + minGapY;
    }

    public update(): void {
        this.x -= this.speed;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // Top pipe
        this.assets.obstacle.render(ctx, this.x, 0, this.gapY - this.gapHeight / 2, true);

        // Bottom pipe
        const bottomPipeY = this.gapY + this.gapHeight / 2;
        const bottomPipeHeight = ctx.canvas.height - this.groundHeight - bottomPipeY;
        if (bottomPipeHeight > 0) {
            this.assets.obstacle.render(ctx, this.x, bottomPipeY, bottomPipeHeight, false);
        }
    }

    public isOffscreen(): boolean {
        return this.x + this.width < 0;
    }

    public checkCollision(birdX: number, birdY: number, birdRadius: number): boolean {
        if (birdX + birdRadius > this.x && birdX - birdRadius < this.x + this.width) {
            if (
                birdY - birdRadius < this.gapY - this.gapHeight / 2 ||
                birdY + birdRadius > this.gapY + this.gapHeight / 2
            ) {
                return true;
            }
        }
        return false;
    }

    public isPassed(birdX: number): boolean {
        return !this.scored && birdX > this.x + this.width;
    }

    public isScored(): boolean {
        return this.scored;
    }

    public setScored(): void {
        this.scored = true;
    }
}
