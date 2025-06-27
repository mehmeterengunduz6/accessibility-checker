import React, { useState } from 'react';
import { CourseContent } from '../types';

interface ContentInputProps {
  onSubmit: (content: CourseContent) => void;
  loading: boolean;
}

export const ContentInput: React.FC<ContentInputProps> = ({ onSubmit, loading }) => {
  const [inputType, setInputType] = useState<'url' | 'html'>('url');
  const [url, setUrl] = useState('');
  const [html, setHtml] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputType === 'url' && url.trim()) {
      onSubmit({ type: 'url', url: url.trim() });
    } else if (inputType === 'html' && html.trim()) {
      onSubmit({ type: 'html', html: html.trim() });
    }
  };

  const isValid = inputType === 'url' ? url.trim() : html.trim();

  return (
    <div className="card">
      <h2>Course Content Input</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Input Type:</label>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
              <input
                type="radio"
                value="url"
                checked={inputType === 'url'}
                onChange={(e) => setInputType(e.target.value as 'url')}
                style={{ marginRight: '8px' }}
              />
              Course URL
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
              <input
                type="radio"
                value="html"
                checked={inputType === 'html'}
                onChange={(e) => setInputType(e.target.value as 'html')}
                style={{ marginRight: '8px' }}
              />
              HTML Content
            </label>
          </div>
        </div>

        {inputType === 'url' ? (
          <div className="form-group">
            <label htmlFor="url-input">Course URL:</label>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/course"
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="html-input">HTML Content:</label>
            <textarea
              id="html-input"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="Paste your course HTML content here..."
              required
            />
          </div>
        )}

        <button 
          type="submit" 
          className="btn" 
          disabled={!isValid || loading}
        >
          {loading ? 'Checking Accessibility...' : 'Check Accessibility'}
        </button>
      </form>
    </div>
  );
};