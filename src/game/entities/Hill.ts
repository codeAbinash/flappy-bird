export class Hill {
    private x: number;
    private controlPoints: { x: number; y: number }[];
    private speed: number;
    private color: string;
    private readonly segmentWidth: number = 160;
    private readonly numPoints: number = 4;
    private readonly repeatWidth: number;
    private readonly heightOffset: number = 50; // Offset to raise mountains

    constructor(canvasWidth: number, canvasHeight: number, isBackLayer: boolean = false) {
        this.x = 0;
        this.speed = isBackLayer ? 0.5 : 0.7;
        this.color = isBackLayer ? '#1A8C4A' : '#19b35a';
        this.repeatWidth = canvasWidth * 5;

        // Initialize control points for smooth mountain generation
        this.controlPoints = this.generateControlPoints(canvasWidth, canvasHeight);
    }

    private generateControlPoints(canvasWidth: number, groundY: number): { x: number; y: number }[] {
        const points: { x: number; y: number }[] = [];
        const numSegments = Math.ceil(this.repeatWidth / this.segmentWidth) + 2;

        // Generate initial point with increased base height
        points.push({
            x: 0,
            y: groundY - this.heightOffset - (Math.random() * 80 + 60),
        });

        // Generate varied mountain heights using multiple sine waves
        for (let i = 1; i <= numSegments * this.numPoints; i++) {
            const x = (i * this.segmentWidth) / this.numPoints;

            // Use multiple sine waves with different frequencies and amplitudes
            const variation1 = Math.sin(x * 0.003) * 40;
            const variation2 = Math.sin(x * 0.007) * 30;
            const variation3 = Math.sin(x * 0.02) * 15;

            // Combine variations with random element and raised base height
            const baseHeight = groundY - this.heightOffset - 100;
            const heightVariation = variation1 + variation2 + variation3 + (Math.random() * 20 - 10);

            const y = Math.max(
                groundY - this.heightOffset - 200, // Increased maximum height
                Math.min(
                    groundY - this.heightOffset - 60, // Increased minimum height
                    baseHeight + heightVariation
                )
            );

            points.push({ x, y });
        }

        // Ensure smooth transition at the repeat point
        const lastPoint = points[points.length - 1];
        const firstPoint = points[0];
        const transitionPoints = 4;

        for (let i = 0; i < transitionPoints; i++) {
            const ratio = i / transitionPoints;
            const y = lastPoint.y * (1 - ratio) + firstPoint.y * ratio;
            points.push({
                x: lastPoint.x + (this.segmentWidth / this.numPoints) * (i + 1),
                y,
            });
        }

        return points;
    }

    public update(): void {
        this.x -= this.speed;

        // Reset position when the entire pattern has scrolled
        if (this.x <= -this.repeatWidth) {
            this.x = 0;
        }
    }

    public render(ctx: CanvasRenderingContext2D, groundY: number): void {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, groundY);

        // Start from the first visible segment
        const startIndex = Math.floor(-this.x / (this.segmentWidth / this.numPoints));

        // Draw using bezier curves for smooth mountains
        ctx.lineTo(0, this.controlPoints[startIndex].y);

        for (let i = startIndex; i < startIndex + this.numPoints * 6; i++) {
            if (i + 1 >= this.controlPoints.length) break;

            const p1 = this.controlPoints[i];
            const p2 = this.controlPoints[i + 1];

            // Calculate control points for smooth curve
            const cp1x = p1.x + (p2.x - p1.x) / 3;
            const cp1y = p1.y;
            const cp2x = p1.x + ((p2.x - p1.x) * 2) / 3;
            const cp2y = p2.y;

            // Draw the curve segment
            ctx.bezierCurveTo(cp1x + this.x, cp1y, cp2x + this.x, cp2y, p2.x + this.x, p2.y);
        }

        // Complete the path
        ctx.lineTo(ctx.canvas.width, groundY);
        ctx.lineTo(0, groundY);
        ctx.fill();
    }
}
