import { getAssets } from '../../config/assetConfigs';
import { Bird } from '../entities/Bird';
import { Cloud } from '../entities/Cloud';
import { Hill } from '../entities/Hill';
import { Pipe } from '../entities/Pipe';
import { AudioManager } from './AudioManager';
import { InputManager } from './InputManager';

export enum GameState {
    TITLE = 'title',
    READY = 'ready',
    PLAYING = 'playing',
    DYING = 'dying',
    GAME_OVER = 'gameover',
}

export class GameStateManager {
    private currentState: GameState = GameState.TITLE;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private bird: Bird;
    private pipes: Pipe[] = [];
    private clouds: Cloud[] = [];
    private frontHills: Hill[] = [];
    private backHills: Hill[] = [];
    private inputManager: InputManager;
    private audioManager: AudioManager;
    private score: number = 0;
    private highScore: number = 0;
    private nextPipeSpawn: number = 0;
    private readonly pipeSpawnInterval: number = 1500;
    private groundOffset: number = 0;
    private readonly groundSpeed: number = 2;
    private readonly groundHeight: number = 50;
    private backgroundGradient: CanvasGradient;
    private assets: ReturnType<typeof getAssets>;
    private deathTime: number = 0;
    private explosionFrame: number = 0;
    private explosionTimer: number = 0;
    private readonly explosionDuration: number = 2000;
    private readonly explosionFrameInterval: number = 200;
    private deathPosition: { x: number; y: number } | null = null;
    private displayWidth: number;
    private displayHeight: number;
    private scale: number;
    private onStateChange?: (state: GameState) => void;
    private onScoreChange?: (score: number) => void;
    private onHighScoreChange?: (highScore: number) => void;

    constructor(
        canvas: HTMLCanvasElement,
        route: string = '/',
        displayWidth?: number,
        displayHeight?: number,
        onStateChange?: (state: GameState) => void,
        onScoreChange?: (score: number) => void,
        onHighScoreChange?: (highScore: number) => void
    ) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = context;
        this.assets = getAssets(route);
        this.onStateChange = onStateChange;
        this.onScoreChange = onScoreChange;
        this.onHighScoreChange = onHighScoreChange;

        // Use logical display size for game coordinates
        this.displayWidth = displayWidth || canvas.width;
        this.displayHeight = displayHeight || canvas.height;
        this.scale = canvas.width / this.displayWidth;

        this.ctx.scale(this.scale, this.scale);

        // Create background gradient
        this.backgroundGradient = this.ctx.createLinearGradient(0, 0, 0, this.displayHeight);
        this.backgroundGradient.addColorStop(0, this.assets.background.skyGradient[0]);
        this.backgroundGradient.addColorStop(1, this.assets.background.skyGradient[1]);

        // Initialize background elements
        this.initializeBackgroundElements();

        // Initialize managers
        this.bird = new Bird(this.displayWidth * 0.3, this.displayHeight * 0.5, this.assets);
        this.inputManager = new InputManager(canvas);
        this.audioManager = AudioManager.getInstance();

        // Load high score from localStorage
        const savedHighScore = localStorage.getItem('flappyBirdHighScore');
        if (savedHighScore) {
            this.highScore = parseInt(savedHighScore, 10);
        }

        this.setupInputHandlers();
        this.changeState(GameState.TITLE);

        // Notify initial states
        if (this.onHighScoreChange) {
            this.onHighScoreChange(this.highScore);
        }
        if (this.onScoreChange) {
            this.onScoreChange(this.score);
        }
    }

    private initializeBackgroundElements(): void {
        // Create more clouds for better coverage across the 5x width
        for (let i = 0; i < 12; i++) {
            this.clouds.push(new Cloud(this.displayWidth, this.displayHeight));
        }

        // Create hills (back layer)
        this.backHills = [new Hill(this.displayWidth, this.displayHeight, true)];

        // Create hills (front layer)
        this.frontHills = [new Hill(this.displayWidth, this.displayHeight, false)];
    }

    public cleanup(): void {
        this.inputManager.cleanup();
    }

    private setupInputHandlers(): void {
        // Remove any existing handlers first
        Object.values(GameState).forEach((state) => {
            this.inputManager.removeHandler(state);
        });

        // Add new handlers
        this.inputManager.addHandler(GameState.TITLE, () => {
            this.changeState(GameState.READY);
            this.audioManager.play('swoosh');
        });

        this.inputManager.addHandler(GameState.READY, () => {
            this.changeState(GameState.PLAYING);
            this.bird.flap();
            this.audioManager.play('swoosh');
        });

        this.inputManager.addHandler(GameState.PLAYING, () => {
            this.bird.flap();
            this.audioManager.play('flap');
        });

        this.inputManager.addHandler(GameState.GAME_OVER, () => {
            this.resetGame();
            this.audioManager.play('swoosh');
            this.changeState(GameState.READY);
        });
    }

    private resetGame(): void {
        this.bird.reset(this.displayWidth * 0.3, this.displayHeight * 0.5);
        this.pipes = [];
        this.score = 0;
        this.nextPipeSpawn = 0;
        this.groundOffset = 0;
        this.inputManager.setEnabled(true);
        this.deathPosition = null;
        this.explosionFrame = 0;
        this.explosionTimer = 0;
    }

    private updateHighScore(): void {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('flappyBirdHighScore', this.highScore.toString());

            // Notify high score change
            if (this.onHighScoreChange) {
                this.onHighScoreChange(this.highScore);
            }
        }
    }

    public restart(): void {
        this.resetGame();
        this.changeState(GameState.READY);
        this.audioManager.play('swoosh');
    }

    public changeState(newState: GameState): void {
        this.currentState = newState;
        window.location.hash = newState;

        if (newState === GameState.DYING) {
            this.deathTime = Date.now();
            this.deathPosition = this.bird.getPosition();
            this.inputManager.setEnabled(false);
        } else if (newState === GameState.GAME_OVER) {
            this.inputManager.setEnabled(false);
        } else if (newState === GameState.PLAYING) {
            this.inputManager.setEnabled(true);
        }

        // Notify state change
        if (this.onStateChange) {
            this.onStateChange(newState);
        }
    }

    public update(deltaTime: number): void {
        // Update parallax elements even in title screen
        if (this.currentState !== GameState.GAME_OVER) {
            // Update clouds
            this.clouds.forEach((cloud) => cloud.update());

            // Update hills
            this.backHills.forEach((hill) => hill.update());
            this.frontHills.forEach((hill) => hill.update());

            // Update ground
            this.groundOffset = (this.groundOffset - this.groundSpeed) % 20;
        }

        switch (this.currentState) {
            case GameState.TITLE:
            case GameState.READY:
                this.updateTitle(deltaTime);
                break;
            case GameState.PLAYING:
                this.updatePlaying(deltaTime);
                break;
            case GameState.DYING:
                this.updateDying(deltaTime);
                break;
            case GameState.GAME_OVER:
                // No updates in game over state
                break;
        }
    }

    private updateTitle(deltaTime: number): void {
        this.bird.updateFloating(deltaTime);
    }

    private updatePlaying(deltaTime: number): void {
        this.bird.update(deltaTime);

        // Spawn new pipes
        this.nextPipeSpawn -= deltaTime;
        if (this.nextPipeSpawn <= 0) {
            this.pipes.push(new Pipe(this.displayWidth, this.displayHeight, this.assets));
            this.nextPipeSpawn = this.pipeSpawnInterval;
        }

        // Update pipes and check collisions
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.update();

            if (pipe.isOffscreen()) {
                this.pipes.splice(i, 1);
                continue;
            }

            const birdPos = this.bird.getPosition();
            if (pipe.checkCollision(birdPos.x, birdPos.y, this.bird.getRadius())) {
                this.audioManager.play('hit');
                this.updateHighScore();
                if (window.location.pathname === '/black-humor') {
                    this.changeState(GameState.DYING);
                } else {
                    this.changeState(GameState.GAME_OVER);
                }
                return;
            }

            if (pipe.isPassed(birdPos.x) && !pipe.isScored()) {
                this.score++;
                pipe.setScored();
                this.audioManager.play('score');

                // Notify score change
                if (this.onScoreChange) {
                    this.onScoreChange(this.score);
                }
            }
        }

        // Check ground collision
        const birdPos = this.bird.getPosition();
        if (birdPos.y > this.displayHeight - this.groundHeight - this.bird.getRadius()) {
            this.audioManager.play('hit');
            this.updateHighScore();
            if (window.location.pathname === '/black-humor') {
                this.changeState(GameState.DYING);
            } else {
                this.changeState(GameState.GAME_OVER);
            }
        }
    }

    private updateDying(deltaTime: number): void {
        this.explosionTimer += deltaTime;
        if (this.explosionTimer >= this.explosionFrameInterval) {
            this.explosionFrame = (this.explosionFrame + 1) % 2;
            this.explosionTimer = 0;
        }

        if (Date.now() - this.deathTime >= this.explosionDuration) {
            this.changeState(GameState.GAME_OVER);
        }
    }

    private renderBackground(): void {
        // Draw sky gradient
        this.ctx.fillStyle = this.backgroundGradient;
        this.ctx.fillRect(0, 0, this.displayWidth, this.displayHeight);

        // Draw clouds
        this.clouds.forEach((cloud) => cloud.render(this.ctx));

        // Draw back hills
        this.backHills.forEach((hill) => hill.render(this.ctx, this.displayHeight - this.groundHeight));

        // Draw front hills
        this.frontHills.forEach((hill) => hill.render(this.ctx, this.displayHeight - this.groundHeight));

        // Draw animated ground pattern
        this.ctx.fillStyle = this.assets.background.groundColor;
        this.ctx.fillRect(0, this.displayHeight - this.groundHeight, this.displayWidth, this.groundHeight);

        // Draw ground pattern
        this.ctx.fillStyle = this.assets.background.groundPatternColor;
        for (let x = this.groundOffset; x < this.displayWidth; x += 20) {
            this.ctx.fillRect(x, this.displayHeight - this.groundHeight, 10, this.groundHeight);
        }
    }

    public render(): void {
        this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);
        this.renderBackground();

        switch (this.currentState) {
            case GameState.TITLE:
                this.renderTitle();
                break;
            case GameState.READY:
                this.renderReady();
                break;
            case GameState.PLAYING:
                this.renderPlaying();
                break;
            case GameState.DYING:
                this.renderDying();
                break;
            case GameState.GAME_OVER:
                this.renderGameOver();
                break;
        }
    }

    private renderTitle(): void {
        // Title text with shadow
        this.ctx.fillStyle = window.location.pathname === '/black-humor' ? '#FFF' : '#000';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Flappy Bird', this.displayWidth / 2, this.displayHeight / 2 - 40);

        this.ctx.font = '20px Arial';
        this.ctx.fillText('Click to Start', this.displayWidth / 2, this.displayHeight / 2 + 20);

        // High score display
        if (this.highScore > 0) {
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`High Score: ${this.highScore}`, this.displayWidth / 2, this.displayHeight / 2 + 60);
        }

        this.bird.render(this.ctx);
    }

    private renderReady(): void {
        this.bird.render(this.ctx);

        // Ready text
        this.ctx.fillStyle = window.location.pathname === '/black-humor' ? '#FFF' : '#000';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Ready!', this.displayWidth / 2, this.displayHeight / 2 - 40);

        this.ctx.font = '20px Arial';
        this.ctx.fillText('Click to Begin', this.displayWidth / 2, this.displayHeight / 2 + 20);
    }

    private renderPlaying(): void {
        for (const pipe of this.pipes) {
            pipe.render(this.ctx);
        }

        this.bird.render(this.ctx);
    }

    private renderDying(): void {
        for (const pipe of this.pipes) {
            pipe.render(this.ctx);
        }

        if (this.deathPosition && this.assets.explosion) {
            if (this.explosionFrame === 0) {
                this.assets.explosion.renderFrame1(this.ctx, this.deathPosition.x, this.deathPosition.y);
            } else {
                this.assets.explosion.renderFrame2(this.ctx, this.deathPosition.x, this.deathPosition.y);
            }
        }
    }

    private renderGameOver(): void {
        for (const pipe of this.pipes) {
            pipe.render(this.ctx);
        }

        if (this.deathPosition && this.assets.explosion && window.location.pathname === '/black-humor') {
            if (this.explosionFrame === 0) {
                this.assets.explosion.renderFrame1(this.ctx, this.deathPosition.x, this.deathPosition.y);
            } else {
                this.assets.explosion.renderFrame2(this.ctx, this.deathPosition.x, this.deathPosition.y);
            }
        } else {
            this.bird.render(this.ctx);
        }
    }
}
