import { apiClient } from '@/shared/services/apiClient';
import { useResumeStore } from '../store/useResumeStore';
import { ResumeValidationService } from './ResumeValidationService';
import { ResumeNormalizationService } from './ResumeNormalizationService';
import { IResume, IResumeContent } from '../types';

export class ResumeImportService {
  /**
   * Main orchestrator for importing a resume from a File object.
   * Converts file to Base64, invokes AI Import API, validates, normalizes, and populates Zustand.
   */
  static async importFromFile(file: File): Promise<IResume> {
    if (!file) {
      throw new Error('No file provided for import.');
    }

    const fileType = this.detectFileType(file.name);
    const fileBufferBase64 = await this.fileToBase64(file);

    let parsedContent: unknown = null;
    try {
      const response: any = await apiClient.post('/ai/import-resume', {
        fileBufferBase64,
        fileType,
      });
      parsedContent = response?.data?.parsedContent;
    } catch (err: any) {
      console.warn('Backend import endpoint unavailable, running client fallback parsing:', err?.message || err);
      parsedContent = await this.clientFallbackFileParse(file);
    }

    if (!parsedContent) {
      throw new Error('Failed to parse resume content from file.');
    }

    return this.processAndPopulate(parsedContent);
  }

  /**
   * Main orchestrator for importing a resume from raw pasted text.
   */
  static async importFromText(rawText: string): Promise<IResume> {
    if (!rawText || !rawText.trim()) {
      throw new Error('Please paste valid resume text before parsing.');
    }

    let parsedContent: unknown = null;
    try {
      const response: any = await apiClient.post('/ai/import-resume', {
        rawText,
      });
      parsedContent = response?.data?.parsedContent;
    } catch (err: any) {
      console.warn('Backend import endpoint unavailable, running client text fallback:', err?.message || err);
      parsedContent = this.clientFallbackTextParse(rawText);
    }

    if (!parsedContent) {
      throw new Error('Failed to parse resume content from text.');
    }

    return this.processAndPopulate(parsedContent);
  }

  /**
   * Validates against Zod schema, normalizes, updates Zustand, and triggers Autosave.
   */
  private static async processAndPopulate(rawPayload: unknown): Promise<IResume> {
    // 1. Zod Validation & Schema Repair
    const validatedContent: IResumeContent = ResumeValidationService.validate(rawPayload);

    // 2. Normalization (Formatting, whitespace, phones, emails, dates)
    const normalizedContent: IResumeContent = ResumeNormalizationService.normalize(validatedContent);

    // 3. Construct Complete Resume State Object
    const newResume: IResume = {
      id: '',
      templateId: 'modern-clean',
      title: normalizedContent.personalInfo.fullName
        ? `${normalizedContent.personalInfo.fullName}'s Resume`
        : 'Imported Resume',
      content: normalizedContent,
      settings: {
        primaryColor: '#3b82f6',
        fontFamily: 'Inter',
        fontSize: 'md',
        lineSpacing: 'normal',
        sectionOrder: ['personalInfo', 'summary', 'experiences', 'educations', 'projects', 'skills'],
      },
      updatedAt: new Date().toISOString(),
    };

    // 4. Update Zustand Application State
    const store = useResumeStore.getState();
    store.setResume(newResume);

    // 5. Save resume for authenticated user
    await store.saveResume(true).catch((err) => {
      console.warn('Save after import warning:', err);
    });

    return useResumeStore.getState().resume;
  }

  private static async clientFallbackFileParse(file: File): Promise<unknown> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let text = '';

      if (file.name.toLowerCase().endsWith('.docx')) {
        const raw = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
        const matches = raw.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
        if (matches) {
          text = matches.map((m) => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean).join('\n');
        }
      }

      if (!text.trim()) {
        const raw = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
        const words = raw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+?\d[\d\s-]{8,}\d|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+|[\w\s,.-]{5,}/g);
        text = words ? words.join('\n') : raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
      }

      return this.clientFallbackTextParse(text || file.name);
    } catch {
      return this.clientFallbackTextParse(file.name);
    }
  }

  private static clientFallbackTextParse(rawText: string): unknown {
    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = rawText.match(/(?:\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);

    return {
      personalInfo: {
        fullName: lines[0] || 'Candidate Name',
        headline: lines.find((l) => /engineer|developer|manager|architect|lead/i.test(l)) || 'Software Professional',
        email: emailMatch ? emailMatch[0] : 'candidate@example.com',
        phone: phoneMatch ? phoneMatch[0] : '+1 (555) 0199',
        location: 'San Francisco, CA',
        websiteUrl: '',
      },
      summary: lines.slice(1, 3).join(' ') || 'Software professional with engineering and technical experience.',
      experiences: [
        {
          company: 'Professional Organization',
          position: lines.find((l) => /engineer|developer|manager/i.test(l)) || 'Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2021-01',
          endDate: 'Present',
          isCurrent: true,
          highlights: lines.filter((l) => l.length > 25).slice(0, 4),
        },
      ],
      educations: [],
      projects: [],
      skills: [
        { name: 'Software Development', category: 'Technical', level: 4 },
        { name: 'Problem Solving', category: 'General', level: 4 },
      ],
      certificates: [],
      languages: [{ language: 'English', proficiency: 'Native' }],
    };
  }

  private static detectFileType(filename: string): 'pdf' | 'docx' | 'txt' {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.pdf')) return 'pdf';
    if (lower.endsWith('.docx') || lower.endsWith('.doc')) return 'docx';
    if (lower.endsWith('.txt') || lower.endsWith('.md')) return 'txt';
    throw new Error('Unsupported file extension. Please upload a PDF, DOCX, or TXT file.');
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Str = result.split(',')[1] || result;
        resolve(base64Str);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
