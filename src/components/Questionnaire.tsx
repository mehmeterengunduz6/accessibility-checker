import React, { useState } from 'react';
import { Question, Answer } from '../types';

interface QuestionnaireProps {
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | number>('');

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: string | number) => {
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value: value
    };

    const updatedAnswers = [...answers.filter(a => a.questionId !== currentQuestion.id), newAnswer];
    setAnswers(updatedAnswers);

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentAnswer('');
      } else {
        onComplete(updatedAnswers);
      }
    }, 500); // 500ms delay for better UX
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousAnswer = answers.find(a => a.questionId === questions[currentQuestionIndex - 1].id);
      setCurrentAnswer(previousAnswer?.value || '');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      visual: '#3498db',
      auditory: '#9b59b6',
      motor: '#e67e22',
      cognitive: '#27ae60',
      general: '#34495e'
    };
    return colors[category] || '#95a5a6';
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

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'yes-no':
        return (
          <div style={{ width: '100%', minHeight: '120px', display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={() => handleAnswer('yes')}
              className={`btn ${currentAnswer === 'yes' ? 'btn-selected' : 'btn-secondary'}`}
              style={{ 
                padding: '15px 30px',
                fontSize: '18px',
                backgroundColor: currentAnswer === 'yes' ? '#27ae60' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: 1,
                transition: 'all 0.2s ease',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(39, 174, 96, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
            >
              ✓ Yes
            </button>
            <button
              onClick={() => handleAnswer('no')}
              className={`btn ${currentAnswer === 'no' ? 'btn-selected' : 'btn-secondary'}`}
              style={{ 
                padding: '15px 30px',
                fontSize: '18px',
                backgroundColor: currentAnswer === 'no' ? '#e74c3c' : '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: 1,
                transition: 'all 0.2s ease',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
            >
              ✗ No
            </button>
          </div>
        );

      case 'scale':
        return (
          <div style={{ width: '100%', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
              {currentQuestion.scaleLabels?.map((label, index) => (
                <span key={index} style={{ fontSize: '12px', textAlign: 'center', width: '60px' }}>
                  {label}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              {Array.from({ length: (currentQuestion.scaleMax || 5) - (currentQuestion.scaleMin || 1) + 1 }, (_, i) => {
                const value = (currentQuestion.scaleMin || 1) + i;
                return (
                  <button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className={`btn ${currentAnswer === value ? 'btn-selected' : 'btn-secondary'}`}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: currentAnswer === value ? '#3498db' : '#ecf0f1',
                      color: currentAnswer === value ? 'white' : '#2c3e50',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'multiple-choice':
        return (
          <div style={{ width: '100%', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`btn ${currentAnswer === option ? 'btn-selected' : 'btn-secondary'}`}
                style={{
                  display: 'block',
                  width: '100%',
                  marginBottom: '10px',
                  padding: '15px',
                  textAlign: 'left',
                  backgroundColor: currentAnswer === option ? '#3498db' : '#ecf0f1',
                  color: currentAnswer === option ? 'white' : '#2c3e50',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            backgroundColor: getCategoryColor(currentQuestion.category),
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            <span>{getCategoryIcon(currentQuestion.category)}</span>
            <span style={{ textTransform: 'capitalize' }}>{currentQuestion.category}</span>
          </div>
        </div>
        
        <div style={{ 
          width: '100%', 
          height: '8px', 
          backgroundColor: '#ecf0f1', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            backgroundColor: '#3498db',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ 
          fontSize: '24px', 
          lineHeight: '1.4', 
          marginBottom: '20px',
          color: '#2c3e50',
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {currentQuestion.text}
        </h2>

        <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderQuestion()}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #ecf0f1'
      }}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn btn-secondary"
          style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
        >
          ← Previous
        </button>

        <span style={{ color: '#666', fontSize: '14px' }}>
          {Math.round(progress)}% Complete
        </span>

        <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
          {currentQuestionIndex === questions.length - 1 
            ? 'Select an answer to complete' 
            : 'Select an answer to continue'
          }
        </div>
      </div>
    </div>
  );
};