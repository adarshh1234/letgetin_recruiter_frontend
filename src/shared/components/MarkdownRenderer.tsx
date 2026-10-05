'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const copySnippet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Helper to render inline formatting: bold (**text**), inline code (`code`), links ([text](url))
  const renderInline = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="bg-sky-50 border border-sky-200 text-sky-700 px-1.5 py-0.5 rounded font-mono text-[11px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 underline hover:text-sky-800 font-medium inline-flex items-center gap-0.5"
          >
            {linkMatch[1]}
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      }
      return part;
    });
  };

  // Split content into blocks (code blocks, headings, lists, hr, paragraphs)
  const renderBlocks = (rawText: string) => {
    const lines = rawText.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeBlockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block start/end
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          const codeText = codeBuffer.join('\n');
          const idx = codeBlockIndex++;
          elements.push(
            <div
              key={`code-${idx}`}
              className="relative my-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 overflow-hidden font-mono text-[11px]"
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 border-b border-slate-700 text-[10px] text-slate-400">
                <span>Snippet</span>
                <button
                  type="button"
                  onClick={() => copySnippet(codeText, idx)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-700/60 hover:bg-slate-700 transition-all cursor-pointer"
                >
                  {copiedCodeIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 overflow-x-auto whitespace-pre-wrap">{codeText}</pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={`sp-${i}`} className="h-1.5" />);
        continue;
      }

      // Horizontal Rule
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        elements.push(<hr key={`hr-${i}`} className="my-3 border-t border-slate-200" />);
        continue;
      }

      // H1
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-sm font-extrabold text-slate-900 mt-3 mb-1.5 flex items-center gap-2">
            {renderInline(trimmed.slice(2))}
          </h1>
        );
        continue;
      }

      // H2
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className="text-xs font-bold text-slate-900 mt-3.5 mb-1.5 pb-1 border-b border-slate-200/80 flex items-center gap-1.5"
          >
            {renderInline(trimmed.slice(3))}
          </h2>
        );
        continue;
      }

      // H3
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-xs font-bold text-slate-800 mt-2.5 mb-1 flex items-center gap-1.5">
            {renderInline(trimmed.slice(4))}
          </h3>
        );
        continue;
      }

      // Unordered list
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={`li-${i}`} className="flex items-start gap-2 my-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
            <div className="text-xs text-slate-700 leading-relaxed flex-1">
              {renderInline(trimmed.slice(2))}
            </div>
          </div>
        );
        continue;
      }

      // Numbered list (e.g. "1. ", "2. ")
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        elements.push(
          <div key={`nli-${i}`} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-xs font-bold text-sky-600 shrink-0">{numMatch[1]}.</span>
            <div className="text-xs text-slate-700 leading-relaxed flex-1">
              {renderInline(numMatch[2])}
            </div>
          </div>
        );
        continue;
      }

      // Paragraph text
      elements.push(
        <div key={`p-${i}`} className="text-xs text-slate-700 leading-relaxed my-1">
          {renderInline(trimmed)}
        </div>
      );
    }

    return elements;
  };

  return <div className={`space-y-0.5 ${className}`}>{renderBlocks(content)}</div>;
};
