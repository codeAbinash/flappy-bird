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
            className="fixed bottom-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 touch-manipulation"
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}>
            {/* {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />} */}
        </button>
    );
}
