import { Question } from '../types';

export const accessibilityQuestions: Question[] = [
  // Visual Accessibility
  {
    id: 'color-contrast',
    text: 'Do you ensure sufficient color contrast between text and background colors?',
    type: 'yes-no',
    category: 'visual',
    weight: 10
  },
  {
    id: 'color-only-info',
    text: 'Do you avoid using color as the only way to convey important information?',
    type: 'yes-no',
    category: 'visual',
    weight: 8
  },
  {
    id: 'text-size',
    text: 'Can users resize text up to 200% without losing functionality?',
    type: 'yes-no',
    category: 'visual',
    weight: 7
  },
  {
    id: 'font-readability',
    text: 'How readable are the fonts used in your course?',
    type: 'scale',
    category: 'visual',
    weight: 6,
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ['Very difficult', 'Difficult', 'Moderate', 'Easy', 'Very easy']
  },
  {
    id: 'images-alt-text',
    text: 'Do all images have descriptive alternative text?',
    type: 'yes-no',
    category: 'visual',
    weight: 9
  },
  {
    id: 'complex-images',
    text: 'For complex images (charts, graphs), do you provide detailed descriptions?',
    type: 'yes-no',
    category: 'visual',
    weight: 8
  },

  // Auditory Accessibility
  {
    id: 'video-captions',
    text: 'Do all videos have accurate captions?',
    type: 'yes-no',
    category: 'auditory',
    weight: 10
  },
  {
    id: 'audio-transcripts',
    text: 'Do you provide transcripts for audio content?',
    type: 'yes-no',
    category: 'auditory',
    weight: 9
  },
  {
    id: 'audio-descriptions',
    text: 'Do videos with important visual information have audio descriptions?',
    type: 'yes-no',
    category: 'auditory',
    weight: 8
  },
  {
    id: 'audio-controls',
    text: 'Can users control audio playback (play, pause, volume)?',
    type: 'yes-no',
    category: 'auditory',
    weight: 7
  },
  {
    id: 'background-audio',
    text: 'Do you avoid or provide controls for background audio?',
    type: 'yes-no',
    category: 'auditory',
    weight: 6
  },

  // Motor/Mobility Accessibility
  {
    id: 'keyboard-navigation',
    text: 'Can users navigate your entire course using only a keyboard?',
    type: 'yes-no',
    category: 'motor',
    weight: 10
  },
  {
    id: 'focus-indicators',
    text: 'Are focus indicators visible when navigating with keyboard?',
    type: 'yes-no',
    category: 'motor',
    weight: 9
  },
  {
    id: 'click-targets',
    text: 'Are interactive elements large enough to be easily clicked/tapped?',
    type: 'yes-no',
    category: 'motor',
    weight: 8
  },
  {
    id: 'time-limits',
    text: 'Do you provide options to extend or disable time limits?',
    type: 'yes-no',
    category: 'motor',
    weight: 7
  },
  {
    id: 'drag-drop-alternatives',
    text: 'Do drag-and-drop interactions have keyboard alternatives?',
    type: 'yes-no',
    category: 'motor',
    weight: 6
  },

  // Cognitive Accessibility
  {
    id: 'clear-navigation',
    text: 'Is your course navigation clear and consistent?',
    type: 'scale',
    category: 'cognitive',
    weight: 9,
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ['Very confusing', 'Confusing', 'Moderate', 'Clear', 'Very clear']
  },
  {
    id: 'content-structure',
    text: 'Do you use proper headings to structure your content?',
    type: 'yes-no',
    category: 'cognitive',
    weight: 8
  },
  {
    id: 'plain-language',
    text: 'Do you use clear, simple language appropriate for your audience?',
    type: 'scale',
    category: 'cognitive',
    weight: 7,
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ['Very complex', 'Complex', 'Moderate', 'Simple', 'Very simple']
  },
  {
    id: 'instructions-clarity',
    text: 'Are instructions for activities and assignments clear?',
    type: 'scale',
    category: 'cognitive',
    weight: 8,
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ['Very unclear', 'Unclear', 'Moderate', 'Clear', 'Very clear']
  },
  {
    id: 'error-messages',
    text: 'Do you provide clear, helpful error messages?',
    type: 'yes-no',
    category: 'cognitive',
    weight: 6
  },
  {
    id: 'progress-indicators',
    text: 'Do you show students their progress through the course?',
    type: 'yes-no',
    category: 'cognitive',
    weight: 5
  },

  // General Accessibility
  {
    id: 'forms-labels',
    text: 'Do all form fields have clear labels?',
    type: 'yes-no',
    category: 'general',
    weight: 9
  },
  {
    id: 'links-descriptive',
    text: 'Are your links descriptive (not just "click here")?',
    type: 'yes-no',
    category: 'general',
    weight: 7
  },
  {
    id: 'page-titles',
    text: 'Do your course pages have descriptive titles?',
    type: 'yes-no',
    category: 'general',
    weight: 6
  },
  {
    id: 'skip-links',
    text: 'Do you provide skip links for navigation?',
    type: 'yes-no',
    category: 'general',
    weight: 5
  },
  {
    id: 'mobile-friendly',
    text: 'Is your course mobile-friendly and responsive?',
    type: 'yes-no',
    category: 'general',
    weight: 8
  },
  {
    id: 'assistive-tech-testing',
    text: 'Have you tested your course with assistive technologies?',
    type: 'multiple-choice',
    category: 'general',
    weight: 7,
    options: ['Yes, extensively', 'Yes, basic testing', 'Planning to test', 'No, not yet']
  }
];