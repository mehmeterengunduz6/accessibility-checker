import React from 'react';
import { AccessibilityAssessment } from '../types';
import { AccessibilityAssessmentEngine } from '../services/assessmentEngine';

interface AssessmentResultsProps {
  assessment: AccessibilityAssessment;
  onRestart: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ assessment, onRestart }) => {
  const engine = new AccessibilityAssessmentEngine();
  const accessibilityLevel = engine.getAccessibilityLevel(assessment.overallScore);

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      visual: 'Visual Accessibility',
      auditory: 'Auditory Accessibility',
      motor: 'Motor/Mobility Accessibility',
      cognitive: 'Cognitive Accessibility',
      general: 'General Accessibility'
    };
    return names[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      visual: '👁️',
      auditory: '🔊',
      motor: '⌨️',
      cognitive: '🧠',
      general: '🎯'
    };
    return icons[category] || '📋';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#27ae60';
    if (score >= 70) return '#2ecc71';
    if (score >= 60) return '#f39c12';
    if (score >= 50) return '#e67e22';
    return '#e74c3c';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Your Accessibility Assessment Results</h1>
        <button onClick={onRestart} className="btn btn-secondary">
          Take New Assessment
        </button>
      </div>

      <div className="card" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          backgroundColor: accessibilityLevel.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: 'white',
          fontSize: '48px',
          fontWeight: 'bold'
        }}>
          {assessment.overallScore}
        </div>
        <h2 style={{ color: accessibilityLevel.color, marginBottom: '10px' }}>
          {accessibilityLevel.level}
        </h2>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          {accessibilityLevel.description}
        </p>
      </div>

      <div className="card">
        <h2>Category Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {Object.entries(assessment.categoryScores).map(([category, score]) => (
            <div key={category} style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              borderLeft: `4px solid ${getScoreColor(score)}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px', marginRight: '10px' }}>
                  {getCategoryIcon(category)}
                </span>
                <h3 style={{ margin: 0, fontSize: '16px' }}>
                  {getCategoryName(category)}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: getScoreColor(score),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {Math.min(score, 100)}
                </div>
                <div style={{ flex: 1, marginLeft: '15px' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(score, 100)}%`,
                      height: '100%',
                      backgroundColor: getScoreColor(score),
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {assessment.recommendations.length > 0 && (
        <div className="card">
          <h2>Personalized Recommendations</h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Based on your assessment, here are specific actions you can take to improve your course accessibility:
          </p>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            {assessment.recommendations.map((recommendation, index) => (
              <div key={index} style={{
                border: `1px solid ${getPriorityColor(recommendation.priority)}20`,
                borderLeft: `4px solid ${getPriorityColor(recommendation.priority)}`,
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>
                    {getPriorityIcon(recommendation.priority)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <h3 style={{ margin: 0, marginRight: '10px' }}>
                        {recommendation.title}
                      </h3>
                      <span style={{
                        backgroundColor: getPriorityColor(recommendation.priority),
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                      }}>
                        {recommendation.priority} priority
                      </span>
                    </div>
                    <p style={{ margin: '10px 0', lineHeight: '1.6' }}>
                      {recommendation.description}
                    </p>
                    <p style={{ 
                      margin: '10px 0', 
                      fontStyle: 'italic', 
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      <strong>Impact:</strong> {recommendation.impact}
                    </p>
                    {recommendation.resources.length > 0 && (
                      <div>
                        <strong style={{ fontSize: '14px' }}>Helpful Resources:</strong>
                        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                          {recommendation.resources.map((resource, resourceIndex) => (
                            <li key={resourceIndex} style={{ fontSize: '14px', color: '#666' }}>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ backgroundColor: '#e8f5e8', border: '1px solid #27ae60' }}>
        <h2 style={{ color: '#27ae60' }}>🚀 Next Steps</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h3>Immediate Actions</h3>
            <ul>
              <li>Address all high-priority recommendations first</li>
              <li>Focus on the lowest-scoring accessibility categories</li>
              <li>Test changes with real users when possible</li>
            </ul>
          </div>
          <div>
            <h3>Ongoing Improvement</h3>
            <ul>
              <li>Schedule regular accessibility reviews</li>
              <li>Train your team on accessibility best practices</li>
              <li>Consider getting a professional accessibility audit</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', color: '#666' }}>
        <p>Assessment completed on {new Date(assessment.timestamp).toLocaleDateString()}</p>
        <p style={{ fontSize: '14px' }}>Remember: This assessment provides guidance, but professional accessibility testing is recommended for critical applications.</p>
      </div>
    </div>
  );
};