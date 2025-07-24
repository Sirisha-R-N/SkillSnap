
import React, { useEffect, useState } from 'react';
import { ProfileAnalysis } from '../types';

interface ScoreDisplayProps {
  result: ProfileAnalysis;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ result }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    if (result.score === animatedScore) return;
    const interval = setInterval(() => {
      setAnimatedScore(prevScore => {
        if (prevScore < result.score) {
          return prevScore + 1;
        }
        clearInterval(interval);
        return prevScore;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [result.score, animatedScore]);

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-red-400';
    if (score < 75) return 'text-yellow-400';
    return 'text-green-400';
  }

  return (
    <div className="w-full text-center animate-fade-in space-y-6">
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            className="text-slate-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
          <circle
            className={getScoreColor(result.score) + " transition-all duration-1000 ease-out"}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
        </svg>
        <span className={`absolute text-4xl font-bold ${getScoreColor(result.score)}`}>
          {animatedScore}
        </span>
      </div>

      <div className="text-left space-y-4">
        <div>
          <h3 className="text-xl font-bold text-green-400">Strengths</h3>
          <p className="text-gray-300 mt-1">{result.strengths}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-yellow-400">Areas for Improvement</h3>
          <p className="text-gray-300 mt-1">{result.improvements}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
