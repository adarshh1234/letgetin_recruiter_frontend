import { useResumeStore } from '../store/useResumeStore';
import { useAuthStore } from '../../auth/store/useAuthStore';

/**
 * Generates a clean, professional resume file name starting with the user's name:
 * e.g. "John_Doe_Resume" (saved by browsers as "John_Doe_Resume.pdf")
 */
export const getResumeFileName = (): string => {
  const resumeState = useResumeStore.getState();
  const authState = useAuthStore.getState();

  // 1. Highest priority: Full Name from Resume Personal Details
  let rawName: string | undefined = resumeState.resume?.content?.personalInfo?.fullName?.trim();

  // 2. Fallback: Full Name or Username from Logged-in User Account
  if (!rawName) {
    rawName = authState.user?.fullName?.trim() || authState.user?.username?.trim() || undefined;
  }

  // 3. Fallback: Custom Resume Title if distinct from default
  if (!rawName && resumeState.resume?.title && resumeState.resume.title !== 'Untitled Resume') {
    rawName = resumeState.resume.title.trim();
  }

  // Clean and sanitize string (remove unsafe filename symbols, normalize spaces to underscores)
  const sanitized = (rawName || 'User')
    .replace(/[\\/:*?"<>|#%&{}\\$!'@+`=.,;()[\]]/g, '')
    .trim()
    .replace(/[\s\-_]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const baseName = sanitized || 'User';

  if (baseName.toLowerCase().endsWith('_resume')) {
    return baseName;
  }
  if (baseName.toLowerCase() === 'resume') {
    return 'My_Resume';
  }

  return `${baseName}_Resume`;
};

export const triggerPdfDownload = () => {
  if (typeof window === 'undefined') return;

  const pdfFileName = getResumeFileName();
  const originalDocumentTitle = document.title;

  // Set document title so browsers using parent window title for print dialog use the clean name
  document.title = pdfFileName;

  const resumeElement = document.querySelector('.resume-paper') as HTMLElement;

  if (!resumeElement) {
    window.print();
    setTimeout(() => {
      document.title = originalDocumentTitle;
    }, 1000);
    return;
  }

  // Create or reuse isolated hidden iframe for 100% clean PDF print export of ONLY the resume
  let printFrame = document.getElementById('resume-pdf-print-iframe') as HTMLIFrameElement;
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'resume-pdf-print-iframe';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.style.visibility = 'hidden';
    document.body.appendChild(printFrame);
  }

  const doc = printFrame.contentWindow?.document;
  if (!doc) {
    window.print();
    setTimeout(() => {
      document.title = originalDocumentTitle;
    }, 1000);
    return;
  }

  // Collect all active stylesheets and link tags from main app
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((s) => s.outerHTML)
    .join('\n');

  // Strip inline scale transforms from cloned resume paper
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = resumeElement.outerHTML;
  const clonedPaper = tempDiv.querySelector('.resume-paper') as HTMLElement;
  if (clonedPaper) {
    clonedPaper.style.transform = 'none';
    clonedPaper.style.boxShadow = 'none';
    clonedPaper.style.margin = '0';
  }

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${pdfFileName}</title>
        <meta charset="utf-8">
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .resume-paper {
            transform: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        ${tempDiv.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Wait 300ms for web fonts & styles to resolve before opening print dialog
  setTimeout(() => {
    printFrame.contentWindow?.focus();
    printFrame.contentWindow?.print();

    // Restore original tab title after print dialog triggers
    setTimeout(() => {
      document.title = originalDocumentTitle;
    }, 1500);
  }, 300);
};
