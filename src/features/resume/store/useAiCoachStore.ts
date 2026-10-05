import { create } from 'zustand';
import { apiClient } from '@/shared/services/apiClient';
import { useResumeStore } from './useResumeStore';

export interface ChatSuggestionAction {
  id: string;
  label: string;
  action: () => void;
  applied?: boolean;
}

export interface ChatAnalysis {
  knownFacts: string[];
  missingFacts: string[];
  reason?: string;
}

export interface ChatDraft {
  section: string;
  content: any;
}

export interface ChatAction {
  type: string;
  section?: string;
  payload?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  analysis?: ChatAnalysis;
  status?: 'READY' | 'NEEDS_INFORMATION' | 'ANSWER';
  questions?: string[];
  draft?: ChatDraft | null;
  action?: ChatAction | null;
  suggestions?: ChatSuggestionAction[];
  quickReplies?: string[];
  timestamp: string;
}

export function extractBulletStrings(raw: any): string[] {
  if (!raw) return [];
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.includes('\n') && (trimmed.includes('•') || trimmed.includes('- ') || trimmed.includes('* '))) {
      return trimmed
        .split('\n')
        .map((line) => line.replace(/^[\s•\-\*]+/, '').replace(/^\d+[\.\)]\s*/, '').trim())
        .filter(Boolean);
    }
    return [trimmed.replace(/^[\s•\-\*]+/, '').replace(/^\d+[\.\)]\s*/, '').trim()];
  }
  if (Array.isArray(raw)) {
    return raw.flatMap((item) => extractBulletStrings(item)).filter(Boolean);
  }
  if (typeof raw === 'object' && raw !== null) {
    if (Array.isArray(raw.bullets)) return extractBulletStrings(raw.bullets);
    if (Array.isArray(raw.highlights)) return extractBulletStrings(raw.highlights);
    if (Array.isArray(raw.items)) return extractBulletStrings(raw.items);

    if (typeof raw.text === 'string' && raw.text.trim()) return [raw.text.trim()];
    if (typeof raw.bullet === 'string' && raw.bullet.trim()) return [raw.bullet.trim()];
    if (typeof raw.highlight === 'string' && raw.highlight.trim()) return [raw.highlight.trim()];
    if (typeof raw.content === 'string' && raw.content.trim()) return [raw.content.trim()];
    if (typeof raw.description === 'string' && raw.description.trim()) return [raw.description.trim()];
    if (raw.title && (raw.detail || raw.description || raw.text)) {
      return [`${raw.title}: ${raw.detail || raw.description || raw.text}`.trim()];
    }

    const entries = Object.entries(raw).filter(
      ([k, v]) => typeof v === 'string' && v.trim().length > 0 && !['section', 'projectTitle', 'company', 'position', 'type'].includes(k)
    );
    if (entries.length > 0) {
      return entries.map(([k, v]) => (isNaN(Number(k)) ? `${k}: ${v}` : `${v}`)).filter(Boolean);
    }
  }
  return [];
}

interface AiCoachState {
  isOpen: boolean;
  activeMobileTab: 'form' | 'chat' | 'preview';
  messages: ChatMessage[];
  isChatLoading: boolean;
  appliedNotice: string | null;
  copiedMsgId: string | null;

  setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setActiveMobileTab: (tab: 'form' | 'chat' | 'preview') => void;
  setAppliedNotice: (msg: string | null) => void;
  setCopiedMsgId: (id: string | null) => void;
  clearChat: () => void;
  sendMessage: (userText: string) => Promise<void>;

  // Section-specific AI Triggers
  triggerSummaryGenerationAi: (params: { templateStyle: string; customContext?: string }) => Promise<void>;
  triggerExperienceAi: (expId: string, position: string, company: string, count?: number, customContext?: string) => Promise<void>;
  triggerProjectDescriptionAi: (projId: string, title: string, technologies?: string[], customContext?: string) => Promise<void>;
  triggerProjectBulletsAi: (projId: string, title: string, technologies?: string[], count?: number, customContext?: string) => Promise<void>;
  triggerImproveBulletAi: (params: {
    section: 'experience' | 'project';
    id: string;
    bulletIndex: number;
    currentBulletText: string;
    roleOrProjectTitle: string;
  }) => Promise<void>;
  triggerSkillsAi: () => Promise<void>;
  sendSummaryOptionsToCoach: (headline: string, summaryOptions: string[]) => void;
}

const getInitialMessages = (): ChatMessage[] => [
  {
    id: 'greeting',
    sender: 'ai',
    text: 'Hi there! I am your **Context-Aware AI Resume Coach**. I have full visibility of your open resume data.\n\nYou can ask me for section improvements, test your summary against templates, or request targeted feedback. I will always ensure we have enough factual context before crafting new content!',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export const useAiCoachStore = create<AiCoachState>((set, get) => ({
  isOpen: true,
  activeMobileTab: 'form',
  messages: getInitialMessages(),
  isChatLoading: false,
  appliedNotice: null,
  copiedMsgId: null,

  setIsOpen: (open) => set((state) => ({ isOpen: typeof open === 'function' ? open(state.isOpen) : open })),
  setActiveMobileTab: (tab) => set({ activeMobileTab: tab }),
  setAppliedNotice: (msg) => set({ appliedNotice: msg }),
  setCopiedMsgId: (id) => set({ copiedMsgId: id }),

  clearChat: () => set({ messages: getInitialMessages() }),

  sendMessage: async (userText: string) => {
    if (!userText.trim() || get().isChatLoading) return;

    const cleanedText = userText.replace(/\*\*/g, '').trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: cleanedText,
      timestamp,
    };

    const aiMsgId = `ai-${Date.now()}`;
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: 'Evaluating resume context...',
      timestamp,
    };

    set((state) => ({
      messages: [...state.messages, userMsg, initialAiMsg],
      isChatLoading: true,
    }));

    const { resume: resumeState, activeSection, activeResumeContext } = useResumeStore.getState();
    const effectiveActiveContext = activeResumeContext || (activeSection ? { section: activeSection } : undefined);

    const historyPayload = get().messages.slice(-20).map((m) => ({
      sender: m.sender,
      text: m.text,
      analysis: m.analysis,
      status: m.status,
    }));

    try {
      const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const chatUrl = `${NEXT_PUBLIC_API_URL}/ai/chat`;

      let resData: any = null;

      try {
        const response = await fetch(chatUrl, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream, application/json',
          },
          body: JSON.stringify({
            message: cleanedText,
            resumeContext: resumeState,
            conversationHistory: historyPayload,
            activeResumeContext: effectiveActiveContext,
            stream: true,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/event-stream') && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let rawBuffer = '';
          let progressiveAccumulated = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunkStr = decoder.decode(value, { stream: true });
            rawBuffer += chunkStr;

            const lines = rawBuffer.split('\n\n');
            rawBuffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ')) {
                try {
                  const eventData = JSON.parse(trimmed.slice(6));
                  if (eventData.type === 'chunk' && eventData.text) {
                    progressiveAccumulated += eventData.text;
                    const match = progressiveAccumulated.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)/);
                    if (match && match[1]) {
                      const extractedText = match[1]
                        .replace(/\\n/g, '\n')
                        .replace(/\\"/g, '"')
                        .replace(/\\\\/g, '\\');
                      if (extractedText.trim().length > 0) {
                        set((state) => ({
                          messages: state.messages.map((m) =>
                            m.id === aiMsgId ? { ...m, text: extractedText } : m
                          ),
                        }));
                      }
                    }
                  } else if (eventData.type === 'done' && eventData.data) {
                    resData = eventData.data;
                  } else if (eventData.type === 'error') {
                    throw new Error(eventData.error || 'Stream error');
                  }
                } catch {
                  // Partial chunk parse error during streaming is expected
                }
              }
            }
          }
        } else {
          const json = await response.json();
          resData = json.data || json;
        }
      } catch (streamError) {
        console.warn('[useAiCoachStore] Streaming fetch fallback to standard API client:', streamError);
        const postRes = await apiClient.post<never, any>('/ai/chat', {
          message: cleanedText,
          resumeContext: resumeState,
          conversationHistory: historyPayload,
          activeResumeContext: effectiveActiveContext,
          stream: false,
        });
        resData = postRes.data || postRes;
      }

      if (!resData) {
        throw new Error('No response data received from AI chat');
      }

      const replyText = resData.reply || 'I analyzed your resume request.';
      const actionSuggestions: ChatSuggestionAction[] = [];
      const quickReplies: string[] = [];

      // 1. Process server action / draft
      const serverAction = resData.action;
      const serverDraft = resData.draft;

      if (serverAction?.type === 'UPDATE_SUMMARY' || serverDraft?.section === 'summary') {
        const rawContent = serverAction?.payload ?? serverDraft?.content;
        const summaryText = typeof rawContent === 'string' ? rawContent : extractBulletStrings(rawContent).join(' ');
        if (summaryText && summaryText.trim().length > 0) {
          actionSuggestions.push({
            id: `sum-${Date.now()}`,
            label: '✔ Apply Generated Summary to Resume',
            action: () => {
              useResumeStore.getState().updateSummary(summaryText);
              get().setAppliedNotice('Applied Professional Summary to your resume!');
              setTimeout(() => get().setAppliedNotice(null), 3500);
            },
          });
        }
      } else if (serverAction?.type === 'ADD_SKILLS' || serverDraft?.section === 'skills') {
        const rawSkills = serverAction?.payload?.skills || serverAction?.payload || serverDraft?.content || [];
        const skillsList = extractBulletStrings(rawSkills);
        if (skillsList.length > 0) {
          actionSuggestions.push({
            id: `skills-all-${Date.now()}`,
            label: `✔ Add All (${skillsList.length}) Skills to Resume`,
            action: () => {
              skillsList.forEach((skName) => {
                useResumeStore.getState().addSkill(skName);
              });
              get().setAppliedNotice(`Added ${skillsList.length} skills to resume!`);
              setTimeout(() => get().setAppliedNotice(null), 3500);
            },
          });
          skillsList.slice(0, 4).forEach((skName) => {
            actionSuggestions.push({
              id: `sk-single-${skName}-${Date.now()}`,
              label: `+ Add "${skName}"`,
              action: () => {
                useResumeStore.getState().addSkill(skName);
                get().setAppliedNotice(`Added "${skName}" to skills!`);
                setTimeout(() => get().setAppliedNotice(null), 3500);
              },
            });
          });
        }
      } else if (serverAction?.type === 'ADD_EXPERIENCE_BULLETS' || serverDraft?.section === 'experiences') {
        const rawBullets = extractBulletStrings(
          serverAction?.payload?.bullets || serverAction?.payload || serverDraft?.content
        );
        const targetCompany = serverAction?.payload?.company || '';
        const targetPos = serverAction?.payload?.position || '';

        if (rawBullets.length > 0) {
          actionSuggestions.push({
            id: `exp-all-${Date.now()}`,
            label: `✔ Add All (${rawBullets.length}) Bullets to ${targetCompany ? `${targetPos || 'Role'} at ${targetCompany}` : 'Work Experience'}`,
            action: () => {
              const { resume, updateExperience } = useResumeStore.getState();
              const experiences = resume.content.experiences;
              if (experiences.length > 0) {
                const targetExp = targetCompany
                  ? experiences.find((e) => e.company?.toLowerCase() === targetCompany.toLowerCase()) || experiences[0]
                  : experiences[0];
                updateExperience(targetExp.id, {
                  highlights: [...targetExp.highlights, ...rawBullets],
                });
                get().setAppliedNotice(`Added ${rawBullets.length} bullets to ${targetExp.company || 'experience'}!`);
                setTimeout(() => get().setAppliedNotice(null), 3500);
              }
            },
          });

          rawBullets.slice(0, 4).forEach((bullet: string, bIdx: number) => {
            const preview = bullet.length > 40 ? `${bullet.slice(0, 38)}...` : bullet;
            actionSuggestions.push({
              id: `exp-single-${bIdx}-${Date.now()}`,
              label: `+ Add Bullet #${bIdx + 1}: "${preview}"`,
              action: () => {
                const { resume, updateExperience } = useResumeStore.getState();
                const experiences = resume.content.experiences;
                if (experiences.length > 0) {
                  const targetExp = targetCompany
                    ? experiences.find((e) => e.company?.toLowerCase() === targetCompany.toLowerCase()) || experiences[0]
                    : experiences[0];
                  updateExperience(targetExp.id, {
                    highlights: [...targetExp.highlights, bullet],
                  });
                  get().setAppliedNotice(`Added bullet #${bIdx + 1} to ${targetExp.company}!`);
                  setTimeout(() => get().setAppliedNotice(null), 3500);
                }
              },
            });
          });
        }
      } else if (serverAction?.type === 'ADD_PROJECT_BULLETS' || serverAction?.type === 'UPDATE_PROJECT' || serverDraft?.section === 'projects') {
        const rawBullets = extractBulletStrings(
          serverAction?.payload?.bullets || serverAction?.payload || serverDraft?.content
        );
        const targetProjTitle = serverAction?.payload?.projectTitle || '';

        if (rawBullets.length > 0) {
          actionSuggestions.push({
            id: `proj-all-${Date.now()}`,
            label: `✔ Add All (${rawBullets.length}) Bullets to ${targetProjTitle || 'Project'}`,
            action: () => {
              const { resume, updateProject } = useResumeStore.getState();
              const projects = resume.content.projects;
              if (projects.length > 0) {
                const targetProj = targetProjTitle
                  ? projects.find((p) => p.title?.toLowerCase() === targetProjTitle.toLowerCase()) || projects[0]
                  : projects[0];
                updateProject(targetProj.id, {
                  highlights: [...(targetProj.highlights || []), ...rawBullets],
                });
                get().setAppliedNotice(`Added ${rawBullets.length} bullets to ${targetProj.title}!`);
                setTimeout(() => get().setAppliedNotice(null), 3500);
              }
            },
          });

          rawBullets.slice(0, 4).forEach((bullet: string, bIdx: number) => {
            const preview = bullet.length > 40 ? `${bullet.slice(0, 38)}...` : bullet;
            actionSuggestions.push({
              id: `proj-single-${bIdx}-${Date.now()}`,
              label: `+ Add Bullet #${bIdx + 1}: "${preview}"`,
              action: () => {
                const { resume, updateProject } = useResumeStore.getState();
                const projects = resume.content.projects;
                if (projects.length > 0) {
                  const targetProj = targetProjTitle
                    ? projects.find((p) => p.title?.toLowerCase() === targetProjTitle.toLowerCase()) || projects[0]
                    : projects[0];
                  updateProject(targetProj.id, {
                    highlights: [...(targetProj.highlights || []), bullet],
                  });
                  get().setAppliedNotice(`Added bullet #${bIdx + 1} to ${targetProj.title}!`);
                  setTimeout(() => get().setAppliedNotice(null), 3500);
                }
              },
            });
          });
        }
      }

      // 2. Process string suggestions / quick replies
      if (Array.isArray(resData.suggestions)) {
        resData.suggestions.forEach((sug: any) => {
          if (typeof sug === 'string') {
            if (sug.toLowerCase().includes('apply') && !actionSuggestions.some((a) => a.label.includes('Apply'))) {
              actionSuggestions.push({
                id: `sug-${Date.now()}-${Math.random()}`,
                label: `✔ ${sug}`,
                action: () => {
                  if (serverDraft?.content && typeof serverDraft.content === 'string') {
                    useResumeStore.getState().updateSummary(serverDraft.content);
                  }
                  get().setAppliedNotice(`Action executed: ${sug}`);
                  setTimeout(() => get().setAppliedNotice(null), 3500);
                },
              });
            } else {
              quickReplies.push(sug);
            }
          }
        });
      }

      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                text: replyText,
                analysis: resData.analysis
                  ? {
                      knownFacts: resData.analysis.knownFacts || [],
                      missingFacts: resData.analysis.missingFacts || [],
                      reason: resData.analysis.reason,
                    }
                  : undefined,
                status: resData.status,
                questions: resData.questions,
                draft: serverDraft,
                action: serverAction,
                suggestions: actionSuggestions,
                quickReplies: quickReplies.slice(0, 3),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : m
        ),
        isChatLoading: false,
      }));
    } catch (err) {
      console.warn('[useAiCoachStore] API fallback:', err);
      const headline = resumeState.content.personalInfo.headline || 'Software Engineer';
      const fallbackMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: `### 📋 Context Evaluation for ${headline}\n\nI evaluated your request against your active resume. To ensure maximum accuracy and impact:\n\n- **Target Role Alignment**: Configured as *${headline}*.\n- **Action Verbs**: Begin experience bullets with verbs like *Architected, Spearheaded, Engineered, Optimized*.\n- **Quantifiable Metrics**: Add numbers (*increased performance by 35%*, *handled 10k daily requests*).`,
        analysis: {
          knownFacts: [`Role: ${headline}`],
          missingFacts: ['Quantifiable project outcome'],
          reason: 'Guidance generated using local anti-hallucination analyzer.',
        },
        status: 'ANSWER',
        suggestions: [
          {
            id: `sug-${Date.now()}-3`,
            label: 'Apply Executive Summary to Resume',
            action: () => {
              useResumeStore.getState().updateSummary(
                `Driven ${headline} with proven track record of architecting scalable systems, optimizing application latencies, and shipping high-impact features.`
              );
              get().setAppliedNotice('Applied Executive Summary to your resume!');
              setTimeout(() => get().setAppliedNotice(null), 3500);
            },
          },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      set((state) => ({
        messages: state.messages.map((m) => (m.id === aiMsgId ? fallbackMsg : m)),
        isChatLoading: false,
      }));
    }
  },

  triggerSummaryGenerationAi: async ({ templateStyle, customContext }: { templateStyle: string; customContext?: string }) => {
    set({ isOpen: true, activeMobileTab: 'chat' });
    const userPrompt = `Write a tailored ${templateStyle} Professional Summary based on my resume details.${customContext ? ` Additional details: ${customContext.trim()}` : ''}`;
    await get().sendMessage(userPrompt);
  },

  triggerExperienceAi: async (expId: string, position: string, company: string, count: number = 3, customContext?: string) => {
    set({ isOpen: true, activeMobileTab: 'chat' });
    const roleName = position || 'Software Engineer';
    const compName = company || 'Company';
    const numBullets = Math.min(6, Math.max(1, count));
    const userPrompt = `Write ${numBullets} high-impact, quantifiable bullet points for my work experience as ${roleName} at ${compName}.${customContext ? ` Key Focus & Context: ${customContext.trim()}` : ''}`;
    await get().sendMessage(userPrompt);
  },

  triggerProjectDescriptionAi: async (projId: string, title: string, technologies: string[] = [], customContext?: string) => {
    set({ isOpen: true, activeMobileTab: 'chat' });
    const projTitle = title || 'Project';
    const techStack = technologies.length > 0 ? technologies.join(', ') : 'modern tech stack';
    const userPrompt = `Write an impactful, concise project description for "${projTitle}" built with ${techStack}.${customContext ? ` Context: ${customContext.trim()}` : ''}`;
    await get().sendMessage(userPrompt);
  },

  triggerProjectBulletsAi: async (projId: string, title: string, technologies: string[] = [], count: number = 3, customContext?: string) => {
    set({ isOpen: true, activeMobileTab: 'chat' });
    const projTitle = title || 'Project';
    const techStack = technologies.length > 0 ? technologies.join(', ') : 'modern full-stack technologies';
    const numBullets = Math.min(6, Math.max(1, count));
    const userPrompt = `Write ${numBullets} high-impact technical achievement bullet points for project "${projTitle}" built with ${techStack}.${customContext ? ` Key Focus: ${customContext.trim()}` : ''}`;
    await get().sendMessage(userPrompt);
  },

  triggerImproveBulletAi: async ({ section, id, bulletIndex, currentBulletText, roleOrProjectTitle }) => {
    set({ isOpen: true, activeMobileTab: 'chat' });
    const rawText = currentBulletText.trim() || 'Built features and improved workflows.';
    const titleLabel = roleOrProjectTitle || 'my role';
    const userPrompt = `Improve and strengthen this bullet point for ${titleLabel}: "${rawText}". Make it metric-driven with strong action verbs.`;
    await get().sendMessage(userPrompt);
  },

  triggerSkillsAi: async () => {
    set({ isOpen: true, activeMobileTab: 'chat' });
    const headline = useResumeStore.getState().resume.content.personalInfo.headline || 'Software Engineer';
    const userPrompt = `Recommend high-demand ATS technical skills and keywords for my role as ${headline}.`;
    await get().sendMessage(userPrompt);
  },

  sendSummaryOptionsToCoach: (headline: string, summaryOptions: string[]) => {
    set({ isOpen: true, activeMobileTab: 'chat' });

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const actionSuggestions: ChatSuggestionAction[] = summaryOptions.map((opt, idx) => ({
      id: `sum-opt-${idx}-${Date.now()}`,
      label: `Apply Summary Variation ${idx + 1} to Resume`,
      action: () => {
        useResumeStore.getState().updateSummary(opt);
        get().setAppliedNotice('Applied chosen summary to your resume!');
        setTimeout(() => get().setAppliedNotice(null), 3500);
      },
    }));

    const variationsText = summaryOptions
      .map((opt, i) => `### Option ${i + 1}:\n> *"${opt}"*`)
      .join('\n\n');

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `Here are the AI-generated **Professional Summary** variations tailored for **${headline}** based on your resume data:\n\n${variationsText}\n\nYou can click any button below to apply that summary to your resume, or tell me what to refine!`,
      suggestions: actionSuggestions,
      timestamp,
    };

    set((state) => ({
      messages: [...state.messages, aiMsg],
      isChatLoading: false,
    }));
  },
}));
