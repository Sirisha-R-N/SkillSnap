
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center py-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                AI Candidate <span className="text-cyan-400">Profile Scorer</span>
            </h1>
            <p className="text-lg text-gray-300 mt-2 max-w-2xl mx-auto">
                Get an instant AI-powered analysis of your professional profile to identify strengths and areas for improvement.
            </p>
        </header>
    );
};

export default Header;
