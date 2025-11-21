'use client';

import { useMemo, useRef } from 'react';
import getPrize from '../../utils/getScore';
import AchievementDisplay from './components/AchievementDisplay';
import CardCorners from './components/CardCorners';
import PrizeDisplay from './components/PrizeDisplay';
import RestartButton from './components/RestartButton';
import ScoreDisplay from './components/ScoreDisplay';

export const PRIZE_THEMES = {
    MEGA_JACKPOT: {
        type: 'megaJackpot',
        label: '🎰 MEGA JACKPOT! 🎰',
        glow: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
        background: 'bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-red-900/30',
        border: 'border-purple-500',
        textColor: 'text-purple-300',
        iconGradient: 'bg-gradient-to-br from-purple-300 via-pink-500 to-red-600',
        amountGradient: 'bg-gradient-to-r from-purple-300 via-pink-400 to-red-500',
        dropShadow: 'drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]',
        cornerColor: 'border-purple-300',
    },
    JACKPOT: {
        type: 'jackpot',
        label: '🎯 JACKPOT! 🎯',
        glow: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500',
        background: 'bg-gradient-to-br from-yellow-900/30 via-orange-900/30 to-amber-900/30',
        border: 'border-orange-500',
        textColor: 'text-orange-300',
        iconGradient: 'bg-gradient-to-br from-yellow-300 via-orange-500 to-amber-600',
        amountGradient: 'bg-gradient-to-r from-yellow-300 via-orange-400 to-amber-500',
        dropShadow: 'drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]',
        cornerColor: 'border-orange-300',
    },
    REGULAR: {
        type: 'regular',
        label: null,
        glow: 'bg-gradient-to-r from-yellow-400 to-amber-500',
        background: 'bg-gradient-to-br from-yellow-900/30 via-amber-900/30 to-yellow-900/30',
        border: 'border-yellow-500',
        textColor: 'text-yellow-300',
        iconGradient: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600',
        amountGradient: 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500',
        dropShadow: 'drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]',
        cornerColor: 'border-yellow-300',
    },
};

const getPrizeTheme = (earnedMoney: number) => {
    if (earnedMoney === 1000) return PRIZE_THEMES.MEGA_JACKPOT;
    if (earnedMoney === 250) return PRIZE_THEMES.JACKPOT;
    return PRIZE_THEMES.REGULAR;
};

export default function GameOverPopup({ onRestart, score }: { onRestart: () => void; score: number }) {
    const earnedMoney = useMemo(() => getPrize(score), [score]);
    const gameOverSoundRef = useRef(null);
    const theme = useMemo(() => getPrizeTheme(earnedMoney), [earnedMoney]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <audio ref={gameOverSoundRef} src="/games/flappy_bird/game-over.mp3" />
            <div className="relative duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 blur-lg opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-red-500 rounded-sm p-4 shadow-2xl min-w-[260px] max-w-[300px]">
                    <CardCorners />
                    <div className="text-center mb-3">
                        <h1 className="text-2xl font-black bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] mb-1 animate-pulse">
                            GAME OVER
                        </h1>
                        <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                    </div>
                    <div className="space-y-2 mb-3">
                        <ScoreDisplay score={score} />
                        <PrizeDisplay earnedMoney={earnedMoney} theme={theme} />
                    </div>
                    <RestartButton onClick={onRestart} />
                    <AchievementDisplay score={score} />
                </div>
            </div>
        </div>
    );
}
