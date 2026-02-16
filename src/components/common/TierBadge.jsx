import React from 'react';

const TierBadge = ({ totalIncentive, rank }) => {
    let tier = "Bronze";
    let color = "from-amber-700 to-amber-900"; // Bronze
    let nextThreshold = 50000;

    if (totalIncentive >= 500000) {
        tier = "Platinum";
        color = "from-slate-300 via-slate-100 to-slate-400"; // Platinum/White
        nextThreshold = null;
    } else if (totalIncentive >= 200000) {
        tier = "Gold";
        color = "from-yellow-400 to-yellow-600"; // Gold
        nextThreshold = 500000;
    } else if (totalIncentive >= 50000) {
        tier = "Silver";
        color = "from-slate-300 to-slate-500"; // Silver
        nextThreshold = 200000;
    }

    const progress = nextThreshold
        ? Math.min((totalIncentive / nextThreshold) * 100, 100)
        : 100;

    return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${color} p-4 shadow-lg text-white w-full h-full min-h-[140px] flex flex-col justify-between`}>
            {rank && (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg shadow-md z-20">
                    #{rank} GLOBAL
                </div>
            )}
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-80 font-semibold">Club Status</p>
                    <h3 className="text-2xl font-bold mt-0.5 tracking-wide text-white drop-shadow-md">{tier}</h3>
                </div>
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm shadow-inner">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                </div>
            </div>

            {nextThreshold && (
                <div className="mt-3 z-10 relative">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1 opacity-90 font-medium">
                        <span>To {tier === 'Bronze' ? 'Silver' : tier === 'Silver' ? 'Gold' : 'Platinum'}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className='h-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out' style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className='text-[10px] mt-1 opacity-80 text-right'>
                        +₹{(nextThreshold - totalIncentive).toLocaleString()} needed
                    </p>
                </div>
            )}

            {/* Decorative Shine */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default TierBadge;
