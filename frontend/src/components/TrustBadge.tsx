import React from 'react';
import { ShieldCheck, Target, Award } from 'lucide-react';

interface TrustBadgeProps {
  score: number;
  verified: boolean;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ score, verified }) => {
  let scoreColor = "text-green-600";
  let scoreBg = "bg-green-100";
  
  if (score < 50) {
    scoreColor = "text-red-600";
    scoreBg = "bg-red-100";
  } else if (score < 80) {
    scoreColor = "text-yellow-600";
    scoreBg = "bg-yellow-100";
  }

  return (
    <div className="flex items-center space-x-3 bg-white border border-gray-100 shadow-sm p-3 rounded-xl inline-flex group hover:shadow-md transition">
      <div className={`flex flex-col items-center justify-center h-12 w-12 rounded-full ${scoreBg} ${scoreColor}`}>
        <Award className="h-5 w-5 mb-0.5" />
        <span className="text-xs font-bold leading-none">{score}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900 flex items-center">
          Trust Score
          {verified && (
            <span title="ID Verified">
              <ShieldCheck className="w-4 h-4 ml-1 text-green-500" />
            </span>
          )}
        </p>
        <p className="text-xs text-gray-500">AI Verified Metrics</p>
      </div>
    </div>
  );
};

export default TrustBadge;
