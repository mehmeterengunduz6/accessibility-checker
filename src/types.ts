export interface Question {
  id: string;
  text: string;
  type: 'yes-no' | 'multiple-choice' | 'scale';
  category: 'visual' | 'auditory' | 'motor' | 'cognitive' | 'general';
  weight: number;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: string[];
}

export interface Answer {
  questionId: string;
  value: string | number;
}

export interface AccessibilityAssessment {
  answers: Answer[];
  overallScore: number;
  categoryScores: Record<string, number>;
  recommendations: Recommendation[];
  timestamp: string;
}

export interface Recommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  resources: string[];
  impact: string;
}