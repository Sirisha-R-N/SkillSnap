export interface CandidateProfile {
  projects: string;
  academics: string;
  achievements: string;
  softSkills: string[];
  targetJobRole: string;
}

export interface ProfileAnalysis {
  score: number;
  strengths: string;
  improvements: string;
  skillGaps: string[];
  learningPath: {
    step: string;
    description: string;
  }[];
  jobRecommendations: {
    role: string;
    reason: string;
  }[];
}
