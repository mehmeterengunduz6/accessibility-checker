import React, { useState } from 'react';
import { Questionnaire } from './components/Questionnaire';
import { AssessmentResults } from './components/AssessmentResults';
import { AccessibilityAssessmentEngine } from './services/assessmentEngine';
import { accessibilityQuestions } from './data/questions';
import { Answer, AccessibilityAssessment } from './types';

function App() {
  const [assessment, setAssessment] = useState<AccessibilityAssessment | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  
  const engine = new AccessibilityAssessmentEngine();

  const handleStartAssessment = () => {
    setIsAssessing(true);
    setAssessment(null);
  };

  const handleAssessmentComplete = (answers: Answer[]) => {
    const result = engine.calculateScore(answers);
    setAssessment(result);
    setIsAssessing(false);
  };

  const handleRestart = () => {
    setAssessment(null);
    setIsAssessing(false);
  };

  if (assessment) {
    return (
      <div>
        <header className="header">
          <div className="container">
            <h1>Course Accessibility Assessment</h1>
            <p>Complete results and personalized recommendations</p>
          </div>
        </header>
        <div className="container">
          <AssessmentResults assessment={assessment} onRestart={handleRestart} />
        </div>
      </div>
    );
  }

  if (isAssessing) {
    return (
      <div>
        <header className="header">
          <div className="container">
            <h1>Course Accessibility Assessment</h1>
            <p>Answer questions about your course to get personalized recommendations</p>
          </div>
        </header>
        <div className="container">
          <Questionnaire 
            questions={accessibilityQuestions} 
            onComplete={handleAssessmentComplete} 
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>Course Accessibility Assessment</h1>
          <p>Evaluate how accessible your online course is to all learners</p>
        </div>
      </header>

      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '30px' }}>🎯</div>
          <h2 style={{ marginBottom: '20px' }}>Ready to Check Your Course Accessibility?</h2>
          <p style={{ 
            fontSize: '18px', 
            lineHeight: '1.6', 
            marginBottom: '40px', 
            maxWidth: '600px', 
            margin: '0 auto 40px' 
          }}>
            Take our comprehensive assessment to discover how accessible your course is and get personalized recommendations for improvement.
          </p>
          
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>👁️</div>
                <h4>Visual</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>Color contrast, images, text size</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔊</div>
                <h4>Auditory</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>Captions, transcripts, audio</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>⌨️</div>
                <h4>Motor</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>Keyboard navigation, controls</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🧠</div>
                <h4>Cognitive</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>Navigation, language, structure</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleStartAssessment}
            className="btn"
            style={{ 
              fontSize: '20px', 
              padding: '20px 40px',
              backgroundColor: '#27ae60',
              boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)'
            }}
          >
            🚀 Start Assessment (5-10 minutes)
          </button>
        </div>

        <div className="card">
          <h3>What You'll Get</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '20px' }}>
            <div>
              <h4>📊 Accessibility Score</h4>
              <p>Get an overall accessibility rating and category-specific scores to understand your course's current state.</p>
            </div>
            <div>
              <h4>🎯 Personalized Recommendations</h4>
              <p>Receive specific, actionable suggestions tailored to your course's needs and current accessibility level.</p>
            </div>
            <div>
              <h4>📚 Learning Resources</h4>
              <p>Access curated resources and tools to help you implement accessibility improvements effectively.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;