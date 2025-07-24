import { GoogleGenAI, Type } from "@google/genai";
import { CandidateProfile, ProfileAnalysis } from "../types";

// The Gemini API client is initialized here.
// As per the requirements, the API key is expected to be available in the
// `process.env.API_KEY` environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 representing the strength of the candidate profile for their target role.",
    },
    strengths: {
      type: Type.STRING,
      description: "A concise paragraph (2-3 sentences) highlighting the candidate's key strengths.",
    },
    improvements: {
      type: Type.STRING,
      description: "A concise paragraph (2-3 sentences) with constructive feedback on areas for improvement.",
    },
    skillGaps: {
        type: Type.ARRAY,
        description: "A list of 3-5 specific skills the candidate is lacking for their target job role.",
        items: { type: Type.STRING }
    },
    learningPath: {
        type: Type.ARRAY,
        description: "A step-by-step learning path to address the skill gaps. Provide 3-4 concrete steps.",
        items: {
            type: Type.OBJECT,
            properties: {
                step: { type: Type.STRING, description: "A short title for the learning step (e.g., 'Master React Hooks')." },
                description: { type: Type.STRING, description: "A 1-2 sentence description of what to do for this step." }
            },
            required: ["step", "description"]
        }
    },
    jobRecommendations: {
        type: Type.ARRAY,
        description: "A list of 2-3 suitable job roles based on the candidate's current profile.",
        items: {
            type: Type.OBJECT,
            properties: {
                role: { type: Type.STRING, description: "The job title (e.g., 'Frontend Developer')." },
                reason: { type: Type.STRING, description: "A 1-2 sentence explanation for why this role is a good fit." }
            },
            required: ["role", "reason"]
        }
    }
  },
  required: ["score", "strengths", "improvements", "skillGaps", "learningPath", "jobRecommendations"],
};

export const calculateProfileScore = async (profile: CandidateProfile): Promise<ProfileAnalysis> => {
  const prompt = `
    Act as an expert career coach and tech recruiter. Analyze the following candidate profile and provide a comprehensive evaluation for a tech role, specifically tailored to their stated career goal.

    **Candidate Information:**

    **1. Target Job Role / Career Goal:**
    ${profile.targetJobRole}

    **2. Academic Record:**
    ${profile.academics}

    **3. Key Projects:**
    ${profile.projects}

    **4. Achievements:**
    ${profile.achievements}

    **5. Soft Skills:**
    ${profile.softSkills.join(', ')}

    **Your Tasks:**
    1.  **Score Profile:** Assign an overall score from 0-100, reflecting the candidate's readiness for their target role.
    2.  **Analyze Strengths & Weaknesses:** Write concise paragraphs on strengths and areas for improvement.
    3.  **Identify Skill Gaps:** List the most critical skills the candidate is missing for their target role.
    4.  **Create a Learning Pathway:** Suggest a concrete, step-by-step plan to fill these gaps.
    5.  **Recommend Jobs:** Suggest a few job roles that fit the candidate's current skillset, including a rationale for each.

    Generate the entire analysis in the provided JSON schema format. Be insightful, constructive, and encouraging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation
    if (
        typeof parsedJson.score !== 'number' || 
        typeof parsedJson.strengths !== 'string' || 
        typeof parsedJson.improvements !== 'string' ||
        !Array.isArray(parsedJson.skillGaps) ||
        !Array.isArray(parsedJson.learningPath) ||
        !Array.isArray(parsedJson.jobRecommendations)
    ) {
        throw new Error('Invalid JSON structure received from API.');
    }

    return parsedJson as ProfileAnalysis;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI service.");
  }
};