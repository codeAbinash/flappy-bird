import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GameLoop } from '../game/core/GameLoop';
import { GameState, GameStateManager } from '../game/core/StateManager';
import SoundToggle from './SoundToggle';

function GameComponent() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stateManager, setStateManager] = useState<GameStateManager | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (!canvasRef.current) return;

        // Prevent default touch behaviors
        const preventDefaultTouch = (e: TouchEvent) => {
            e.preventDefault();
        };

        // Prevent context menu
        const preventContextMenu = (e: Event) => {
            e.preventDefault();
        };

        // Prevent selection
        const preventSelection = (e: Event) => {
            e.preventDefault();
        };

        // Add touch event listeners with passive: false to prevent delay
        document.addEventListener('touchstart', preventDefaultTouch, { passive: false });
        document.addEventListener('touchmove', preventDefaultTouch, { passive: false });
        document.addEventListener('touchend', preventDefaultTouch, { passive: false });

        // Prevent context menu and selection
        canvasRef.current.addEventListener('contextmenu', preventContextMenu);
        canvasRef.current.addEventListener('selectstart', preventSelection);

        // Set canvas size to higher resolution (2x for sharper rendering)
        // const scale = window.devicePixelRatio || 1.5;
        const scale = 1.5;
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;

        canvasRef.current.width = displayWidth * scale;
        canvasRef.current.height = displayHeight * scale;
        canvasRef.current.style.width = `${displayWidth}px`;
        canvasRef.current.style.height = `${displayHeight}px`;

        // Initialize game with current route (pass logical size, not physical pixels)
        const manager = new GameStateManager(canvasRef.current, location.pathname, displayWidth, displayHeight);
        setStateManager(manager);

        const gameLoop = new GameLoop(manager);
        gameLoop.start();

        // Set initial state from URL hash if present
        const hash = window.location.hash.slice(1);
        if (hash && Object.values(GameState).includes(hash as GameState)) {
            manager.changeState(hash as GameState);
        }

        return () => {
            // Clean up event listeners
            document.removeEventListener('touchstart', preventDefaultTouch);
            document.removeEventListener('touchmove', preventDefaultTouch);
            document.removeEventListener('touchend', preventDefaultTouch);

            if (canvasRef.current) {
                canvasRef.current.removeEventListener('contextmenu', preventContextMenu);
                canvasRef.current.removeEventListener('selectstart', preventSelection);
            }

            manager.cleanup();
        };
    }, [location.pathname]);

    return (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center select-none overflow-hidden">
            <canvas
                ref={canvasRef}
                style={{
                    imageRendering: 'auto',
                    WebkitTapHighlightColor: 'transparent',
                }}
            />
            <SoundToggle />
        </div>
    );
}

export default GameComponent;
