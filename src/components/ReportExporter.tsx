import React from 'react';
import jsPDF from 'jspdf';
import { AccessibilityResults } from '../types';

interface ReportExporterProps {
  results: AccessibilityResults | null;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({ results }) => {
  if (!results) return null;

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    doc.setFontSize(20);
    doc.text('Accessibility Report', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.text(`URL: ${results.url}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Generated: ${new Date(results.timestamp).toLocaleString()}`, margin, yPosition);
    yPosition += 20;

    doc.setFontSize(16);
    doc.text('Summary', margin, yPosition);
    yPosition += 15;

    const violationCounts = results.violations.reduce((acc, violation) => {
      acc[violation.impact] = (acc[violation.impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    doc.setFontSize(12);
    doc.text(`Total Violations: ${results.violations.length}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Critical: ${violationCounts.critical || 0}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Serious: ${violationCounts.serious || 0}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Moderate: ${violationCounts.moderate || 0}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Minor: ${violationCounts.minor || 0}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Passed Tests: ${results.passes.length}`, margin, yPosition);
    yPosition += 20;

    if (results.violations.length > 0) {
      doc.setFontSize(16);
      doc.text('Violations', margin, yPosition);
      yPosition += 15;

      results.violations.forEach((violation, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFontSize(14);
        const title = `${index + 1}. ${violation.description}`;
        const splitTitle = doc.splitTextToSize(title, pageWidth - 2 * margin);
        doc.text(splitTitle, margin, yPosition);
        yPosition += splitTitle.length * 7;

        doc.setFontSize(10);
        doc.text(`Impact: ${violation.impact.toUpperCase()}`, margin, yPosition);
        yPosition += 8;

        const helpText = doc.splitTextToSize(`Help: ${violation.help}`, pageWidth - 2 * margin);
        doc.text(helpText, margin, yPosition);
        yPosition += helpText.length * 5 + 5;

        doc.text(`Elements affected: ${violation.nodes.length}`, margin, yPosition);
        yPosition += 15;
      });
    }

    doc.save(`accessibility-report-${new Date().getTime()}.pdf`);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accessibility-report-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Type', 'Impact', 'Description', 'Help', 'Elements Count', 'Help URL'].join(','),
      ...results.violations.map(violation => [
        'Violation',
        violation.impact,
        `"${violation.description.replace(/"/g, '""')}"`,
        `"${violation.help.replace(/"/g, '""')}"`,
        violation.nodes.length,
        violation.helpUrl
      ].join(',')),
      ...results.passes.map(pass => [
        'Pass',
        'N/A',
        `"${pass.description.replace(/"/g, '""')}"`,
        'N/A',
        'N/A',
        'N/A'
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accessibility-report-${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h3>Export Report</h3>
      <p style={{ marginBottom: '20px' }}>
        Download your accessibility report in different formats:
      </p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={exportToPDF} className="btn">
          📄 Export as PDF
        </button>
        <button onClick={exportToJSON} className="btn btn-secondary">
          📋 Export as JSON
        </button>
        <button onClick={exportToCSV} className="btn btn-secondary">
          📊 Export as CSV
        </button>
      </div>
    </div>
  );
};