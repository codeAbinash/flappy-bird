import { PRIZE_THEMES } from '../GameOverPopup';
import CornerDecoration from './CornerDecoration';

type PrizeDisplayProps = {
    earnedMoney: number;
    theme: (typeof PRIZE_THEMES)[keyof typeof PRIZE_THEMES];
};

const PrizeDisplay = ({ earnedMoney, theme }: PrizeDisplayProps) => (
    <div className="relative">
        <div className={`absolute inset-0 blur-md opacity-40 animate-pulse ${theme.glow}`} />
        <div className={`relative backdrop-blur-sm border-2 rounded p-2 ${theme.background} ${theme.border}`}>
            {theme.label && (
                <div className={`text-center mb-1 animate-bounce ${theme.textColor}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{theme.label}</span>
                </div>
            )}

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                    <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-sm text-gray-900 shadow-lg ${theme.iconGradient}`}>
                        $
                    </div>
                    <span className={`text-[11px] uppercase tracking-wide font-bold ${theme.textColor}`}>Earned</span>
                </div>
                <span
                    className={`text-2xl font-black bg-clip-text text-transparent ${theme.amountGradient} ${theme.dropShadow}`}>
                    ${earnedMoney.toFixed(2)}
                </span>
            </div>

            <CornerDecoration position="top-left" color={theme.cornerColor} />
            <CornerDecoration position="top-right" color={theme.cornerColor} />
            <CornerDecoration position="bottom-left" color={theme.cornerColor} />
            <CornerDecoration position="bottom-right" color={theme.cornerColor} />
        </div>
    </div>
);

export default PrizeDisplay;
