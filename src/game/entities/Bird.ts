import { GameAssets } from '../../config/assetConfigs';

export class Bird {
    private x: number;
    private y: number;
    private velocity: number = 0;
    private gravity: number = 0.5;
    private flapStrength: number = -10;
    private rotation: number = 0;
    private wingFrame: number = 0;
    private wingAnimationTimer: number = 0;
    private readonly wingAnimationSpeed: number = 100;
    private floatingOffset: number = 0;
    private floatingSpeed: number = 0.005;
    private assets: GameAssets;

    constructor(x: number, y: number, assets: GameAssets) {
        this.x = x;
        this.y = y;
        this.assets = assets;
    }

    public updateFloating(deltaTime: number): void {
        this.floatingOffset += this.floatingSpeed * deltaTime;
        this.y = this.y + Math.sin(this.floatingOffset) * 0.5;

        // Wing animation in title screen
        this.wingAnimationTimer += deltaTime;
        if (this.wingAnimationTimer >= this.wingAnimationSpeed) {
            this.wingFrame = (this.wingFrame + 1) % 3;
            this.wingAnimationTimer = 0;
        }
    }

    public update(deltaTime: number): void {
        // Apply gravity
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Update rotation based on velocity
        this.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, this.velocity * 0.1));

        // Update wing animation
        this.wingAnimationTimer += deltaTime;
        if (this.wingAnimationTimer >= this.wingAnimationSpeed) {
            this.wingFrame = (this.wingFrame + 1) % 3;
            this.wingAnimationTimer = 0;
        }
    }

    public flap(): void {
        this.velocity = this.flapStrength;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.assets.characterSprite.render(ctx, this.x, this.y, this.rotation, this.wingFrame);
    }

    public getPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    public getRadius(): number {
        return 15;
    }

    public reset(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.velocity = 0;
        this.rotation = 0;
        this.wingFrame = 0;
        this.wingAnimationTimer = 0;
    }
}
