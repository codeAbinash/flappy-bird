const ScoreDisplay = ({ score }: { score: number }) => (
    <div className="bg-gray-900/50 border border-cyan-500/50 rounded p-2 backdrop-blur-sm">
        <div className="flex justify-between items-center">
            <span className="text-cyan-300 text-[10px] uppercase tracking-wider font-mono">Score</span>
            <span className="text-2xl font-black text-white drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">{score}</span>
        </div>
    </div>
);

export default ScoreDisplay;
