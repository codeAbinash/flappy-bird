import React from 'react';
import { AudioManager } from '../game/core/AudioManager';

export default function SoundToggle() {
    const [isMuted, setIsMuted] = React.useState(() => {
        const savedMute = localStorage.getItem('flappyBirdMuted');
        return savedMute ? savedMute === 'true' : false;
    });

    const toggleSound = () => {
        const audioManager = AudioManager.getInstance();
        audioManager.toggleMute();
        setIsMuted(audioManager.isMuted());
    };

    return (
        <button
            onClick={toggleSound}
            className="fixed bottom-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 touch-manipulation z-50"
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}>
            {isMuted ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-white">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-white">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
            )}
        </button>
    );
}
