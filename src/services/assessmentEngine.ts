import { Question, Answer, AccessibilityAssessment, Recommendation } from '../types';
import { accessibilityQuestions } from '../data/questions';

export class AccessibilityAssessmentEngine {
  private questions: Question[] = accessibilityQuestions;

  calculateScore(answers: Answer[]): AccessibilityAssessment {
    // Calculate category totals first
    const categoryMaxScores: Record<string, number> = {};
    const categoryScores: Record<string, number> = {};
    
    // Initialize all categories
    const categories = ['visual', 'auditory', 'motor', 'cognitive', 'general'];
    categories.forEach(cat => {
      categoryMaxScores[cat] = 0;
      categoryScores[cat] = 0;
    });
    
    // Calculate max scores for each category
    this.questions.forEach(question => {
      categoryMaxScores[question.category] += question.weight;
      console.log(`Question ${question.id} (${question.category}): adding ${question.weight}, total now: ${categoryMaxScores[question.category]}`);
    });

    console.log('Total questions:', this.questions.length);
    console.log('Total answers:', answers.length);
    console.log('Category max scores:', categoryMaxScores);
    
    // Debug: check total weight calculation
    const totalWeights = this.questions.reduce((sum, q) => sum + q.weight, 0);
    console.log('Sum of all question weights:', totalWeights);

    // Calculate scores based on answers
    answers.forEach(answer => {
      const question = this.questions.find(q => q.id === answer.questionId);
      if (!question) return;

      let score = 0;
      if (question.type === 'yes-no') {
        score = answer.value === 'yes' ? question.weight : 0;
      } else if (question.type === 'scale') {
        const scaleValue = Number(answer.value);
        const minScale = question.scaleMin || 1;
        const maxScale = question.scaleMax || 5;
        // Normalize to 0-1 range, then multiply by weight
        const normalizedValue = (scaleValue - minScale) / (maxScale - minScale);
        score = normalizedValue * question.weight;
        console.log(`Scale Q ${question.id}: ${scaleValue} (${minScale}-${maxScale}) -> ${normalizedValue} -> ${score}`);
      } else if (question.type === 'multiple-choice') {
        // Score based on option index (higher index = better score)
        const optionIndex = question.options?.indexOf(answer.value as string) || 0;
        const maxOptions = question.options?.length || 1;
        // Normalize to 0-1 range (0 for first option, 1 for last option)
        const normalizedValue = maxOptions > 1 ? optionIndex / (maxOptions - 1) : 0;
        score = normalizedValue * question.weight;
        console.log(`MC Q ${question.id}: option ${optionIndex}/${maxOptions-1} -> ${normalizedValue} -> ${score}`);
      }

      console.log(`Question ${question.id} (${question.type}): weight=${question.weight}, score=${score}`);
      categoryScores[question.category] += score;
    });

    console.log('Category actual scores:', categoryScores);

    // Calculate overall score first (before converting to percentages)
    const totalActualScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
    const totalMaxScore = Object.values(categoryMaxScores).reduce((sum, score) => sum + score, 0);
    
    console.log('Category max scores breakdown:', categoryMaxScores);
    console.log('Total actual score:', totalActualScore);
    console.log('Total max score calculated:', totalMaxScore);
    console.log('Should be total weights:', totalWeights);
    
    // Use the correct total max score
    const correctMaxScore = totalWeights;
    const overallScore = Math.round((totalActualScore / correctMaxScore) * 100);
    console.log('Corrected overall score:', overallScore);

    // Convert category scores to percentages
    Object.keys(categoryScores).forEach(category => {
      const percentage = Math.round(
        (categoryScores[category] / categoryMaxScores[category]) * 100
      );
      console.log(`Category ${category}: ${categoryScores[category]} / ${categoryMaxScores[category]} = ${percentage}%`);
      categoryScores[category] = percentage;
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations(answers, categoryScores);

    return {
      answers,
      overallScore,
      categoryScores,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }

  private generateRecommendations(answers: Answer[], categoryScores: Record<string, number>): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // High priority recommendations for low scores
    Object.entries(categoryScores).forEach(([category, score]) => {
      if (score < 60) {
        recommendations.push(...this.getCategoryRecommendations(category, 'high'));
      } else if (score < 80) {
        recommendations.push(...this.getCategoryRecommendations(category, 'medium'));
      }
    });

    // Specific recommendations based on individual answers
    answers.forEach(answer => {
      const question = this.questions.find(q => q.id === answer.questionId);
      if (!question) return;

      let shouldRecommend = false;
      if (question.type === 'yes-no' && answer.value === 'no') {
        shouldRecommend = true;
      } else if (question.type === 'scale' && Number(answer.value) < 3) {
        shouldRecommend = true;
      } else if (question.type === 'multiple-choice') {
        const optionIndex = question.options?.indexOf(answer.value as string) || 0;
        shouldRecommend = optionIndex < 2;
      }

      if (shouldRecommend) {
        recommendations.push(...this.getQuestionSpecificRecommendations(question.id));
      }
    });

    // Remove duplicates and sort by priority
    const uniqueRecommendations = recommendations.filter((rec, index, self) => 
      index === self.findIndex(r => r.title === rec.title)
    );

    return uniqueRecommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }).slice(0, 15); // Limit to top 15 recommendations
  }

  private getCategoryRecommendations(category: string, priority: 'high' | 'medium' | 'low'): Recommendation[] {
    const categoryRecommendations: Record<string, Recommendation[]> = {
      visual: [
        {
          category: 'visual',
          priority: 'high',
          title: 'Improve Color Contrast',
          description: 'Ensure text has sufficient contrast against background colors. Use contrast checking tools to verify compliance.',
          resources: ['WebAIM Contrast Checker', 'WCAG Color Contrast Guidelines'],
          impact: 'Critical for users with visual impairments and low vision'
        },
        {
          category: 'visual',
          priority: 'high',
          title: 'Add Alternative Text to Images',
          description: 'Provide descriptive alt text for all images. For decorative images, use empty alt attributes.',
          resources: ['Alt Text Best Practices Guide', 'WebAIM Alternative Text'],
          impact: 'Essential for screen reader users'
        }
      ],
      auditory: [
        {
          category: 'auditory',
          priority: 'high',
          title: 'Add Video Captions',
          description: 'Provide accurate, synchronized captions for all video content.',
          resources: ['How to Create Video Captions', 'Caption Quality Guidelines'],
          impact: 'Critical for deaf and hard-of-hearing learners'
        },
        {
          category: 'auditory',
          priority: 'medium',
          title: 'Provide Audio Transcripts',
          description: 'Create text transcripts for audio-only content like podcasts or lectures.',
          resources: ['Transcript Creation Guide', 'Audio Accessibility Standards'],
          impact: 'Helps deaf users and improves SEO'
        }
      ],
      motor: [
        {
          category: 'motor',
          priority: 'high',
          title: 'Ensure Keyboard Navigation',
          description: 'Make sure all interactive elements can be accessed and operated using only the keyboard.',
          resources: ['Keyboard Navigation Testing', 'WCAG Keyboard Guidelines'],
          impact: 'Essential for users who cannot use a mouse'
        },
        {
          category: 'motor',
          priority: 'medium',
          title: 'Improve Focus Indicators',
          description: 'Ensure visible focus indicators for all interactive elements when navigating with keyboard.',
          resources: ['Focus Indicator Design', 'CSS Focus Styles'],
          impact: 'Helps keyboard users know where they are'
        }
      ],
      cognitive: [
        {
          category: 'cognitive',
          priority: 'high',
          title: 'Simplify Navigation Structure',
          description: 'Create clear, consistent navigation that helps users understand where they are and where they can go.',
          resources: ['Navigation Design Principles', 'Cognitive Load Theory'],
          impact: 'Reduces confusion for all users, especially those with cognitive disabilities'
        },
        {
          category: 'cognitive',
          priority: 'medium',
          title: 'Use Clear Language',
          description: 'Write content using plain language principles. Avoid jargon and explain complex terms.',
          resources: ['Plain Language Guidelines', 'Writing for Accessibility'],
          impact: 'Makes content understandable for broader audience'
        }
      ],
      general: [
        {
          category: 'general',
          priority: 'medium',
          title: 'Test with Assistive Technologies',
          description: 'Regularly test your course with screen readers and other assistive technologies.',
          resources: ['Screen Reader Testing Guide', 'Assistive Technology Overview'],
          impact: 'Identifies real-world accessibility barriers'
        }
      ]
    };

    return categoryRecommendations[category] || [];
  }

  private getQuestionSpecificRecommendations(questionId: string): Recommendation[] {
    const specificRecommendations: Record<string, Recommendation[]> = {
      'color-contrast': [
        {
          category: 'visual',
          priority: 'high',
          title: 'Fix Color Contrast Issues',
          description: 'Use tools like WebAIM Contrast Checker to ensure text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text).',
          resources: ['WebAIM Contrast Checker', 'Color Universal Design'],
          impact: 'Makes text readable for users with low vision'
        }
      ],
      'video-captions': [
        {
          category: 'auditory',
          priority: 'high',
          title: 'Add Professional Captions',
          description: 'Create accurate, properly timed captions for all video content. Consider professional captioning services for important content.',
          resources: ['Rev.com Captioning', 'YouTube Auto-Captions', 'Caption Quality Standards'],
          impact: 'Makes video content accessible to deaf and hard-of-hearing users'
        }
      ],
      'keyboard-navigation': [
        {
          category: 'motor',
          priority: 'high',
          title: 'Implement Full Keyboard Support',
          description: 'Ensure all interactive elements can be reached and activated using only the Tab, Enter, Space, and arrow keys.',
          resources: ['Keyboard Navigation Patterns', 'ARIA Authoring Practices'],
          impact: 'Essential for users with motor disabilities'
        }
      ]
    };

    return specificRecommendations[questionId] || [];
  }

  getAccessibilityLevel(score: number): { level: string; description: string; color: string } {
    if (score >= 90) {
      return {
        level: 'Excellent',
        description: 'Your course demonstrates outstanding accessibility practices',
        color: '#27ae60'
      };
    } else if (score >= 80) {
      return {
        level: 'Good',
        description: 'Your course meets most accessibility standards with room for minor improvements',
        color: '#2ecc71'
      };
    } else if (score >= 70) {
      return {
        level: 'Fair',
        description: 'Your course has basic accessibility features but needs significant improvements',
        color: '#f39c12'
      };
    } else if (score >= 60) {
      return {
        level: 'Poor',
        description: 'Your course has major accessibility barriers that need immediate attention',
        color: '#e67e22'
      };
    } else {
      return {
        level: 'Critical',
        description: 'Your course has severe accessibility issues that prevent many users from accessing content',
        color: '#e74c3c'
      };
    }
  }
}