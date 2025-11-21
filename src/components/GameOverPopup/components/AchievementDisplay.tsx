const ACHIEVEMENTS = [
    { minScore: 30, text: '🏆 LEGENDARY! 🏆', color: 'text-yellow-400' },
    { minScore: 20, text: '⭐ EPIC! ⭐', color: 'text-purple-400' },
    { minScore: 10, text: '💎 GREAT! 💎', color: 'text-blue-400' },
];

const getAchievement = (score: number) => {
    return ACHIEVEMENTS.find((achievement) => score >= achievement.minScore);
};

const AchievementDisplay = ({ score }: { score: number }) => {
    const achievement = getAchievement(score);

    if (score === 0) return null;

    return (
        <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="text-center text-[10px] text-gray-400 font-mono">
                {achievement && <p className={`${achievement.color} font-bold mb-0.5`}>{achievement.text}</p>}
            </div>
        </div>
    );
};

export default AchievementDisplay;
