import { useLayoutEffect } from "react";
import { getAddedPhrases } from "../utils/diffWords";
import { TailoringSuggestion } from "../types";

// Minimal ambient shape for the CSS Custom Highlight API - not yet in all TS DOM lib versions.
// This is a pure rendering overlay: it never mutates the DOM tree, so it can safely sit on top
// of the existing Resume renderer/templates without touching a single template file, and it can
// never show up in a server-rendered/print/PDF output since nothing but this JS registers it.
interface HighlightLike {
  new (...ranges: Range[]): unknown;
}
interface CssHighlightRegistry {
  set(name: string, highlight: unknown): void;
  delete(name: string): void;
}

const HIGHLIGHT_NAME = "tailor-added";
let styleInjected = false;

function ensureHighlightStyle() {
  if (styleInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = `::highlight(${HIGHLIGHT_NAME}) { background-color: rgba(16, 185, 129, 0.55); color: inherit; }`;
  document.head.appendChild(style);
  styleInjected = true;
}

function findRangesForPhrase(container: HTMLElement, phrase: string): Range[] {
  const ranges: Range[] = [];
  if (!phrase.trim()) return ranges;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.textContent || "";
    let fromIndex = 0;
    let idx = text.indexOf(phrase, fromIndex);
    while (idx !== -1) {
      const range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, idx + phrase.length);
      ranges.push(range);
      fromIndex = idx + phrase.length;
      idx = text.indexOf(phrase, fromIndex);
    }
  }
  return ranges;
}

/**
 * Highlights the added/changed portions of accepted suggestions directly inside an already
 * rendered Resume preview, using CSS.highlights (no DOM mutation, so it can't conflict with
 * React's reconciliation of the existing renderer). No-ops silently on unsupported browsers.
 */
export function usePreviewHighlight(
  containerRef: React.RefObject<HTMLElement | null>,
  suggestions: TailoringSuggestion[],
  showChanges: boolean,
  // Any value that changes whenever the preview's rendered text has actually updated (e.g. a
  // serialized snapshot of resume.content), so the effect re-scans only after the DOM repaints.
  contentVersion: unknown
) {
  useLayoutEffect(() => {
    const cssHighlights = (globalThis as unknown as { CSS?: { highlights?: CssHighlightRegistry; Highlight?: HighlightLike } })
      .CSS;
    if (!cssHighlights?.highlights || !cssHighlights.Highlight) {
      if (typeof console !== "undefined") {
        console.warn(
          "[usePreviewHighlight] CSS Custom Highlight API is not supported in this browser - the resume preview will still show the tailored text, just without the green overlay. Update to a recent Chrome/Edge/Safari to see it."
        );
      }
      return;
    }

    if (!showChanges || !containerRef.current) {
      cssHighlights.highlights.delete(HIGHLIGHT_NAME);
      return;
    }

    ensureHighlightStyle();

    const relevant = suggestions.filter((s) => s.status === "accepted" || s.status === "edited");
    const allRanges: Range[] = [];
    for (const suggestion of relevant) {
      const phrases = getAddedPhrases(suggestion.originalText, suggestion.proposedText);
      for (const phrase of phrases) {
        allRanges.push(...findRangesForPhrase(containerRef.current, phrase));
      }
    }

    if (allRanges.length === 0) {
      cssHighlights.highlights.delete(HIGHLIGHT_NAME);
      return;
    }

    const HighlightCtor = cssHighlights.Highlight;
    cssHighlights.highlights.set(HIGHLIGHT_NAME, new HighlightCtor(...allRanges));

    return () => {
      cssHighlights.highlights?.delete(HIGHLIGHT_NAME);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChanges, contentVersion, suggestions]);
}
