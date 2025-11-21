import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GameLoop } from '../game/core/GameLoop';
import { GameStateManager, GameState } from '../game/core/StateManager';
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

        // Set canvas size
        canvasRef.current.width = 320;
        canvasRef.current.height = 480;

        // Initialize game with current route
        const manager = new GameStateManager(canvasRef.current, location.pathname);
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
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center touch-none select-none">
            <canvas
                ref={canvasRef}
                className="border border-gray-700 rounded-lg shadow-lg touch-none"
                style={{
                    imageRendering: 'pixelated',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'none',
                }}
            />
            <SoundToggle />
        </div>
    );
}

export default GameComponent;
