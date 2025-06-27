import React from 'react';
import { AccessibilityResults } from '../types';

interface ResultsSummaryProps {
  results: AccessibilityResults;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ results }) => {
  const violationCounts = results.violations.reduce((acc, violation) => {
    acc[violation.impact] = (acc[violation.impact] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalViolations = results.violations.length;
  const totalPasses = results.passes.length;

  return (
    <div>
      <h2>Accessibility Results Summary</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Checked: {results.url} | {new Date(results.timestamp).toLocaleString()}
      </p>
      
      <div className="summary">
        <div className="summary-item critical">
          <h3>{violationCounts.critical || 0}</h3>
          <p>Critical Issues</p>
        </div>
        <div className="summary-item serious">
          <h3>{violationCounts.serious || 0}</h3>
          <p>Serious Issues</p>
        </div>
        <div className="summary-item moderate">
          <h3>{violationCounts.moderate || 0}</h3>
          <p>Moderate Issues</p>
        </div>
        <div className="summary-item minor">
          <h3>{violationCounts.minor || 0}</h3>
          <p>Minor Issues</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="card">
          <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>Total Violations</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#e74c3c' }}>{totalViolations}</p>
        </div>
        <div className="card">
          <h3 style={{ color: '#27ae60', marginBottom: '10px' }}>Passed Tests</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#27ae60' }}>{totalPasses}</p>
        </div>
      </div>

      {results.incomplete.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid #f39c12' }}>
          <h3>Incomplete Tests ({results.incomplete.length})</h3>
          <p>These tests require manual verification:</p>
          <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
            {results.incomplete.map((item, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>{item.description}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};