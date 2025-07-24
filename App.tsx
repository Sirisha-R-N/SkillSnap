import React, { useState, useCallback } from 'react';
import { CandidateProfile, ProfileAnalysis } from './types';
import { calculateProfileScore } from './services/geminiService';
import Header from './components/Header';
import Card from './components/Card';
import TagInput from './components/TagInput';
import ScoreDisplay from './components/ScoreDisplay';
import Loader from './components/Loader';

type ActiveTab = 'analysis' | 'learning' | 'jobs';

const App: React.FC = () => {
  const [profile, setProfile] = useState<Omit<CandidateProfile, 'softSkills'>>({
    projects: '',
    academics: '',
    achievements: '',
    targetJobRole: '',
  });
  const [softSkills, setSoftSkills] = useState<string[]>(['Communication', 'Teamwork']);
  const [analysisResult, setAnalysisResult] = useState<ProfileAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('analysis');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async () => {
    if (!profile.projects || !profile.academics || !profile.achievements || !profile.targetJobRole || softSkills.length === 0) {
      setError('Please fill out all fields and add at least one soft skill.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setActiveTab('analysis');

    const fullProfile: CandidateProfile = { ...profile, softSkills };

    try {
      const result = await calculateProfileScore(fullProfile);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('Failed to get analysis. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [profile, softSkills]);

  const TabButton: React.FC<{ tabName: ActiveTab; currentTab: ActiveTab; onClick: (tab: ActiveTab) => void; children: React.ReactNode; }> = ({ tabName, currentTab, onClick, children }) => (
    <button
      onClick={() => onClick(tabName)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
        currentTab === tabName
          ? 'border-b-2 border-cyan-400 text-cyan-300'
          : 'text-gray-400 hover:text-white'
      }`}
      aria-current={currentTab === tabName ? 'page' : undefined}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-sky-900 text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main className="mt-10 grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          {/* Input Form Section */}
          <div className="space-y-8">
            <Card title="Academic & Professional Background">
              <div className="space-y-4">
                <div>
                  <label htmlFor="targetJobRole" className="block text-sm font-medium text-gray-300 mb-1">Target Job Role</label>
                   <input
                    id="targetJobRole"
                    name="targetJobRole"
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                    placeholder="e.g., Senior Frontend Developer, Data Scientist..."
                    value={profile.targetJobRole}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="academics" className="block text-sm font-medium text-gray-300 mb-1">Academic Record</label>
                  <textarea
                    id="academics"
                    name="academics"
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                    placeholder="e.g., M.S. in Computer Science from XYZ University"
                    value={profile.academics}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="achievements" className="block text-sm font-medium text-gray-300 mb-1">Key Achievements</label>
                  <textarea
                    id="achievements"
                    name="achievements"
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                    placeholder="e.g., Won 'Best Project' award at University Codefest 2023"
                    value={profile.achievements}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </Card>
            <Card title="Projects & Skills">
              <div className="space-y-4">
                <div>
                  <label htmlFor="projects" className="block text-sm font-medium text-gray-300 mb-1">Projects</label>
                  <textarea
                    id="projects"
                    name="projects"
                    rows={6}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                    placeholder="Describe 1-2 key projects. What was the goal and outcome?"
                    value={profile.projects}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="softSkills" className="block text-sm font-medium text-gray-300 mb-1">Soft Skills</label>
                  <TagInput tags={softSkills} setTags={setSoftSkills} />
                </div>
              </div>
            </Card>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full lg:w-auto bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? 'Analyzing...' : 'Calculate Score'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="mt-10 lg:mt-0">
            <Card title="AI Analysis Result">
              <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
                {isLoading ? (
                  <Loader />
                ) : error ? (
                  <div className="text-center text-red-400">
                    <p><strong>Error</strong></p>
                    <p>{error}</p>
                  </div>
                ) : analysisResult ? (
                  <div className="w-full animate-fade-in">
                    <div className="border-b border-slate-700">
                        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                            <TabButton tabName="analysis" currentTab={activeTab} onClick={setActiveTab}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                                <span>Analysis</span>
                            </TabButton>
                            <TabButton tabName="learning" currentTab={activeTab} onClick={setActiveTab}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.002 1.788l7 3.5a1 1 0 00.786 0l7-3.5a1 1 0 00.002-1.788l-7-3.5zM3 9.333V14a1 1 0 001 1h12a1 1 0 001-1V9.333l-7 3.5-7-3.5z" /></svg>
                                <span>Learning Path</span>
                            </TabButton>
                             <TabButton tabName="jobs" currentTab={activeTab} onClick={setActiveTab}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v1.5a.5.5 0 01-1 0V4a4 4 0 018 0v1.5a.5.5 0 01-1 0V4a2 2 0 00-2-2z" clipRule="evenodd" /><path d="M3 6.5A1.5 1.5 0 014.5 5h11A1.5 1.5 0 0117 6.5v10A1.5 1.5 0 0115.5 18h-11A1.5 1.5 0 013 16.5v-10zM5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" /></svg>
                                <span>Job Matches</span>
                            </TabButton>
                        </nav>
                    </div>
                    <div className="pt-6">
                        {activeTab === 'analysis' && <ScoreDisplay result={analysisResult} />}
                        {activeTab === 'learning' && (
                           <div className="space-y-6 text-left">
                                <div>
                                    <h3 className="text-xl font-bold text-cyan-400">Skill Gaps</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {analysisResult.skillGaps.map(skill => (
                                            <span key={skill} className="bg-yellow-500/20 text-yellow-300 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-cyan-400 mt-4">Recommended Learning Path</h3>
                                    <ol className="relative border-l border-slate-700 mt-4 ml-2">
                                        {analysisResult.learningPath.map((item, index) => (
                                            <li key={index} className="mb-6 ml-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 bg-cyan-900 rounded-full -left-3 ring-8 ring-slate-800/50 text-cyan-300">{index + 1}</span>
                                                <h4 className="font-semibold text-white">{item.step}</h4>
                                                <p className="text-sm text-gray-400">{item.description}</p>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                           </div>
                        )}
                        {activeTab === 'jobs' && (
                             <div className="space-y-4 text-left">
                                <h3 className="text-xl font-bold text-cyan-400">Suitable Job Roles</h3>
                                {analysisResult.jobRecommendations.map((job, index) => (
                                    <div key={index} className="bg-slate-800/70 p-4 rounded-lg border border-slate-700">
                                        <h4 className="font-semibold text-white">{job.role}</h4>
                                        <p className="text-sm text-gray-400 mt-1">{job.reason}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p>Your profile analysis will appear here.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
