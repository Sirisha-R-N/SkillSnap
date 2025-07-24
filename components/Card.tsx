
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm shadow-2xl shadow-black/20 rounded-2xl p-6 border border-slate-700 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3">{title}</h2>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
