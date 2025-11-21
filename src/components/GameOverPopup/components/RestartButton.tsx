const RestartButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="w-full relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-2 border-green-400 rounded py-2 px-4 transition-all duration-300 transform group-hover:scale-105">
            <span className="text-base font-black text-white uppercase tracking-wider drop-shadow-lg flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                </svg>
                Play Again
            </span>
        </div>
    </button>
);

export default RestartButton;
