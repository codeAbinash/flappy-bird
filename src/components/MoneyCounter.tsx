'use client';
import { useEffect, useMemo, useRef } from 'react';
import getPrize from '../utils/getScore';
export const dynamic = 'force-static';

function MoneyCounter({ score }: { score: number }) {
    const jackpotSoundRef = useRef<HTMLAudioElement>(null);

    const earnedMoney = useMemo(() => getPrize(score), [score]);

    const isJackpot = earnedMoney === 250 || earnedMoney === 1000;

    useEffect(() => {
        if (isJackpot && jackpotSoundRef.current) {
            jackpotSoundRef.current.play();
        }
    }, [isJackpot]);

    return (
        <>
            <audio ref={jackpotSoundRef} src="/games/flappy_bird/jackpot.mp3" />
            <div className="fixed top-4 right-4 z-50">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 blur-xl opacity-50 animate-pulse"></div>

                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-yellow-500 rounded-lg px-4 py-2 shadow-2xl">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span className="text-xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                                    ${earnedMoney.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-yellow-400"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-yellow-400"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-yellow-400"></div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-yellow-400"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MoneyCounter;
