'use client';

interface StampProgressProps {
  current: number;
  needed: number;
  redeemed?: boolean;
  rewardText?: string;
}

export function StampProgress({ current, needed, redeemed = false, rewardText = 'Free Coffee' }: StampProgressProps) {
  const percentage = Math.min((current / needed) * 100, 100);
  
  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
          {current} / {needed}
        </div>
      </div>
      
      {/* Stamp grid */}
      <div className={`grid gap-3 ${needed <= 10 ? 'grid-cols-5' : 'grid-cols-6'}`}>
        {Array.from({ length: needed }).map((_, i) => {
          const isFilled = i < current;
          const isNext = i === current && !redeemed;
          
          return (
            <div
              key={i}
              className={`
                aspect-square rounded-xl border-2 flex items-center justify-center text-3xl
                transition-all duration-300 transform
                ${isFilled 
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-700 text-white scale-100 shadow-lg' 
                  : isNext
                  ? 'bg-amber-50 border-amber-300 text-amber-400 scale-95 animate-pulse'
                  : 'bg-white border-gray-300 text-gray-300 scale-90'
                }
              `}
            >
              {isFilled ? '☕' : '○'}
            </div>
          );
        })}
      </div>
      
      {redeemed ? (
        <div className="text-center py-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
          <p className="text-3xl font-bold text-green-700 mb-2">🎉 Reward Unlocked!</p>
          <p className="text-xl text-green-600 font-semibold mb-2">{rewardText}</p>
          <p className="text-sm text-green-600">Show this screen to the cashier</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">
            {needed - current} {needed - current === 1 ? 'stamp' : 'stamps'} until your {rewardText.toLowerCase()}!
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {current} of {needed} stamps collected
          </p>
        </div>
      )}
    </div>
  );
}
