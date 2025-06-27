import axe from 'axe-core';
import { AccessibilityResults, AccessibilityViolation, CourseContent } from '../types';

export class AccessibilityChecker {
  private async loadContentIntoDOM(content: CourseContent): Promise<Document> {
    if (content.type === 'url') {
      try {
        const response = await fetch(content.url!);
        const html = await response.text();
        const parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
      } catch (error) {
        throw new Error(`Failed to load URL: ${error}`);
      }
    } else {
      const parser = new DOMParser();
      return parser.parseFromString(content.html!, 'text/html');
    }
  }

  private createIframe(document: Document): Promise<HTMLIFrameElement> {
    return new Promise((resolve, reject) => {
      const iframe = window.document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      
      iframe.onload = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) {
            reject(new Error('Unable to access iframe document'));
            return;
          }
          
          iframeDoc.open();
          iframeDoc.write(document.documentElement.outerHTML);
          iframeDoc.close();
          
          resolve(iframe);
        } catch (error) {
          reject(error);
        }
      };
      
      iframe.onerror = () => reject(new Error('Failed to load iframe'));
      window.document.body.appendChild(iframe);
    });
  }

  async checkAccessibility(content: CourseContent): Promise<AccessibilityResults> {
    try {
      const document = await this.loadContentIntoDOM(content);
      const iframe = await this.createIframe(document);
      
      const iframeWindow = iframe.contentWindow;
      const iframeDocument = iframe.contentDocument;
      
      if (!iframeWindow || !iframeDocument) {
        throw new Error('Unable to access iframe content');
      }

      const axeResults = await axe.run(iframeDocument, {
        rules: {
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'focus-management': { enabled: true },
          'image-alt': { enabled: true },
          'heading-order': { enabled: true },
          'link-purpose': { enabled: true },
          'form-labels': { enabled: true },
          'aria-labels': { enabled: true },
          'landmark-roles': { enabled: true },
          'video-captions': { enabled: true }
        }
      });

      window.document.body.removeChild(iframe);

      const violations: AccessibilityViolation[] = axeResults.violations.map(violation => ({
        id: violation.id,
        impact: violation.impact as 'minor' | 'moderate' | 'serious' | 'critical',
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map(node => ({
          target: node.target,
          html: node.html,
          failureSummary: node.failureSummary || ''
        }))
      }));

      return {
        violations,
        passes: axeResults.passes.map(pass => ({
          id: pass.id,
          description: pass.description
        })),
        incomplete: axeResults.incomplete.map(incomplete => ({
          id: incomplete.id,
          description: incomplete.description
        })),
        url: content.url || 'HTML Content',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Accessibility check failed: ${error}`);
    }
  }

  getCourseFocusedRules() {
    return {
      'video-captions': {
        name: 'Video Captions',
        description: 'Ensure videos have captions for accessibility'
      },
      'audio-descriptions': {
        name: 'Audio Descriptions',
        description: 'Provide audio descriptions for visual content'
      },
      'reading-level': {
        name: 'Reading Level',
        description: 'Content should be appropriate reading level'
      },
      'navigation-consistency': {
        name: 'Navigation Consistency',
        description: 'Navigation should be consistent across course pages'
      },
      'progress-indicators': {
        name: 'Progress Indicators',
        description: 'Course progress should be clearly indicated'
      }
    };
  }
}