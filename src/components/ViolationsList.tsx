import React from 'react';
import { AccessibilityViolation } from '../types';

interface ViolationsListProps {
  violations: AccessibilityViolation[];
}

export const ViolationsList: React.FC<ViolationsListProps> = ({ violations }) => {
  if (violations.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <h3 style={{ color: '#27ae60', marginBottom: '10px' }}>🎉 No Accessibility Violations Found!</h3>
        <p>Your course content passes all accessibility checks.</p>
      </div>
    );
  }

  const sortedViolations = [...violations].sort((a, b) => {
    const impactOrder = { critical: 4, serious: 3, moderate: 2, minor: 1 };
    return impactOrder[b.impact] - impactOrder[a.impact];
  });

  return (
    <div>
      <h2>Accessibility Violations ({violations.length})</h2>
      {sortedViolations.map((violation, index) => (
        <div key={index} className={`violation violation-${violation.impact}`}>
          <h3>
            {violation.description}
            <span style={{ 
              fontSize: '0.8em', 
              textTransform: 'uppercase', 
              marginLeft: '10px',
              padding: '2px 8px',
              borderRadius: '3px',
              background: getImpactColor(violation.impact),
              color: 'white'
            }}>
              {violation.impact}
            </span>
          </h3>
          
          <p><strong>Issue:</strong> {violation.help}</p>
          
          <p>
            <strong>Learn more:</strong>{' '}
            <a 
              href={violation.helpUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#3498db' }}
            >
              {violation.helpUrl}
            </a>
          </p>

          {violation.nodes.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <strong>Affected Elements ({violation.nodes.length}):</strong>
              {violation.nodes.slice(0, 3).map((node, nodeIndex) => (
                <div key={nodeIndex} style={{ 
                  marginTop: '10px', 
                  padding: '10px', 
                  background: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <p><strong>Element:</strong> <code>{node.target.join(', ')}</code></p>
                  {node.html && (
                    <p><strong>HTML:</strong> <code>{node.html.substring(0, 100)}...</code></p>
                  )}
                  {node.failureSummary && (
                    <p><strong>Issue:</strong> {node.failureSummary}</p>
                  )}
                </div>
              ))}
              {violation.nodes.length > 3 && (
                <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
                  ... and {violation.nodes.length - 3} more elements
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

function getImpactColor(impact: string): string {
  switch (impact) {
    case 'critical': return '#c0392b';
    case 'serious': return '#e74c3c';
    case 'moderate': return '#f39c12';
    case 'minor': return '#f1c40f';
    default: return '#95a5a6';
  }
}