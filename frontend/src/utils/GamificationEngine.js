/**
 * GamificationEngine.js
 * Centralized logic for XP, Levels, and Badges.
 * Stores data in localStorage under 'NSGI_GAMIFICATION_DATA'.
 */

const STORAGE_KEY = 'NSGI_GAMIFICATION_DATA';

const DEFAULT_DATA = {
    xp: 3750,
    level: 12,
    nextLevelXp: 5000,
    badges: [
        { name: 'Early Bird', icon: '🌅' },
        { name: 'Math Wizard', icon: '🧙‍♂️' },
        { name: 'Perfect Week', icon: '📅' },
        { name: 'Top 5', icon: '🏆' }
    ],
    history: []
};

const GamificationEngine = {
    getStats() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : DEFAULT_DATA;
    },

    saveStats(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // Dispatch custom event for real-time reactivity
        window.dispatchEvent(new CustomEvent('gamificationUpdate', { detail: data }));
    },

    addXP(amount, reason = 'Activity Completion') {
        const stats = this.getStats();
        stats.xp += amount;
        stats.history.push({ amount, reason, timestamp: new Date().toISOString() });

        // Level up logic (1000 XP per level improvement for simplicity, or scale)
        // Let's use a scale: Level * 500 = XP required for next level
        while (stats.xp >= stats.nextLevelXp) {
            stats.level += 1;
            stats.nextLevelXp = stats.level * 500; // Scaling difficulty
            this.triggerLevelUpEffect(stats.level);
        }

        this.saveStats(stats);
        return stats;
    },

    awardBadge(name, icon) {
        const stats = this.getStats();
        if (!stats.badges.find(b => b.name === name)) {
            stats.badges.push({ name, icon });
            this.saveStats(stats);
            return true;
        }
        return false;
    },

    triggerLevelUpEffect(newLevel) {
        window.dispatchEvent(new CustomEvent('levelUp', { detail: { level: newLevel } }));
    }
};

export default GamificationEngine;
