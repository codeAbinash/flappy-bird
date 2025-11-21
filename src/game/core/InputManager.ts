export class InputManager {
    private handlers: Map<string, () => void> = new Map();
    private enabled: boolean = true;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.handleInput = this.handleInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleTouch = this.handleTouch.bind(this);

        // Add event listeners with passive: false to prevent delay
        this.canvas.addEventListener('mousedown', this.handleInput);
        this.canvas.addEventListener('touchstart', this.handleTouch, { passive: false });
        window.addEventListener('keydown', this.handleKeyDown);
    }

    public addHandler(state: string, handler: () => void): void {
        const normalizedState = state.toLowerCase();
        this.handlers.set(normalizedState, handler);
    }

    public removeHandler(state: string): void {
        const normalizedState = state.toLowerCase();
        this.handlers.delete(normalizedState);
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    private handleKeyDown(e: KeyboardEvent): void {
        // Always allow input in game over state
        const currentState = (window.location.hash.slice(1) || 'title').toLowerCase();
        if (!this.enabled && currentState !== 'gameover') return;

        if (e.code === 'Space' || e.code === 'Tab') {
            e.preventDefault();
            this.triggerHandler();
        }
    }

    private handleTouch(e: TouchEvent): void {
        e.preventDefault(); // Prevent default touch behaviors

        // Always allow input in game over state
        const currentState = (window.location.hash.slice(1) || 'title').toLowerCase();
        if (!this.enabled && currentState !== 'gameover') return;

        this.triggerHandler();
    }

    private handleInput(e?: Event): void {
        // Always allow input in game over state
        const currentState = (window.location.hash.slice(1) || 'title').toLowerCase();
        if (!this.enabled && currentState !== 'gameover') return;

        if (e) {
            e.preventDefault();
        }

        this.triggerHandler();
    }

    private triggerHandler(): void {
        const currentState = (window.location.hash.slice(1) || 'title').toLowerCase();
        const handler = this.handlers.get(currentState);

        if (handler) {
            handler();
        }
    }

    public cleanup(): void {
        this.canvas.removeEventListener('mousedown', this.handleInput);
        this.canvas.removeEventListener('touchstart', this.handleTouch);
        window.removeEventListener('keydown', this.handleKeyDown);
    }
}
