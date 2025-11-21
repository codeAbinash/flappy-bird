export class Cloud {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private speed: number;
    private opacity: number;
    private cloudShape: number;
    private readonly repeatWidth: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.repeatWidth = canvasWidth * 5; // Match hill repeat width
        this.width = Math.random() * 60 + 40;
        this.height = this.width * 0.6;
        this.x = Math.random() * this.repeatWidth;
        this.y = Math.random() * (canvasHeight * 0.3);
        this.speed = 0.2 + Math.random() * 0.2; // Varied speeds for more natural movement
        this.opacity = 0.6 + Math.random() * 0.4; // Varied opacity
        this.cloudShape = Math.random(); // Random shape variation
    }

    public update(): void {
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.x = this.repeatWidth;
            this.y = Math.random() * (window.innerHeight * 0.3);
            this.width = Math.random() * 60 + 40;
            this.height = this.width * 0.6;
            this.opacity = 0.6 + Math.random() * 0.4;
            this.cloudShape = Math.random();
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#FFFFFF';

        // Draw varied cloud shapes
        const centerX = this.x + this.width * 0.5;
        const centerY = this.y + this.height * 0.5;

        // Base cloud shape
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width * 0.3, 0, Math.PI * 2);

        // Varied additional circles based on cloudShape
        if (this.cloudShape < 0.33) {
            // More rounded cloud
            ctx.arc(centerX - this.width * 0.2, centerY, this.width * 0.25, 0, Math.PI * 2);
            ctx.arc(centerX + this.width * 0.2, centerY, this.width * 0.25, 0, Math.PI * 2);
        } else if (this.cloudShape < 0.66) {
            // Elongated cloud
            ctx.arc(centerX - this.width * 0.3, centerY, this.width * 0.2, 0, Math.PI * 2);
            ctx.arc(centerX + this.width * 0.3, centerY, this.width * 0.2, 0, Math.PI * 2);
            ctx.arc(centerX, centerY - this.height * 0.1, this.width * 0.25, 0, Math.PI * 2);
        } else {
            // Clustered cloud
            ctx.arc(centerX - this.width * 0.25, centerY - this.height * 0.1, this.width * 0.2, 0, Math.PI * 2);
            ctx.arc(centerX + this.width * 0.25, centerY - this.height * 0.1, this.width * 0.2, 0, Math.PI * 2);
            ctx.arc(centerX, centerY + this.height * 0.1, this.width * 0.25, 0, Math.PI * 2);
        }

        ctx.fill();
        ctx.restore();
    }
}
