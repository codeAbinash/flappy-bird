import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GameLoop } from '../game/core/GameLoop';
import { GameState, GameStateManager } from '../game/core/StateManager';
import SoundToggle from './SoundToggle';

function GameComponent() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stateManager, setStateManager] = useState<GameStateManager | null>(null);
    const [gameState, setGameState] = useState<GameState>(GameState.TITLE);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const location = useLocation();

    const handleRestart = () => {
        if (stateManager) {
            stateManager.restart();
        }
    };

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
        const manager = new GameStateManager(
            canvasRef.current,
            location.pathname,
            displayWidth,
            displayHeight,
            (state: GameState) => setGameState(state),
            (currentScore: number) => setScore(currentScore),
            (best: number) => setHighScore(best)
        );
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

            {/* Score Display - Top Right */}
            {gameState === GameState.PLAYING && (
                <div className="absolute top-8 right-8 text-white text-5xl font-bold drop-shadow-lg">{score}</div>
            )}

            {/* Game Over Overlay */}
            {gameState === GameState.GAME_OVER && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4">
                        <h1 className="text-5xl font-bold text-white mb-6">Game Over</h1>
                        <div className="space-y-4 mb-8">
                            <div className="text-3xl text-gray-300">
                                Score: <span className="text-white font-bold">{score}</span>
                            </div>
                            <div className="text-3xl text-gray-300">
                                High Score: <span className="text-yellow-400 font-bold">{highScore}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleRestart}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl py-4 px-8 rounded-lg transition-colors duration-200">
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            <SoundToggle />
        </div>
    );
}

export default GameComponent;
