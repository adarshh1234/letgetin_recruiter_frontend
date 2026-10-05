import { IResumeContent } from "@/features/resume/types";
import { TailoringSuggestion } from "../types";

/**
 * Rebuilds working resume content from a pristine snapshot + the currently accepted/edited
 * suggestions. Always recomputed from the original rather than mutated incrementally, so
 * declining a suggestion trivially restores the original text with no separate undo logic.
 * Mirrors the authoritative apply logic in the backend's TailoringService.finalizeSession.
 */
export function applyAcceptedSuggestions(
  originalContent: IResumeContent,
  suggestions: TailoringSuggestion[]
): IResumeContent {
  const content: IResumeContent = JSON.parse(JSON.stringify(originalContent));
  const accepted = suggestions.filter((s) => s.status === "accepted" || s.status === "edited");

  for (const suggestion of accepted) {
    if (suggestion.section === "summary") {
      content.summary = suggestion.proposedText;
    } else if (suggestion.section === "experience" && suggestion.itemId) {
      const exp = content.experiences?.find((e) => e.id === suggestion.itemId);
      if (exp) {
        const highlights = Array.isArray(exp.highlights) ? [...exp.highlights] : [];
        const idx = highlights.findIndex((h) => h === suggestion.originalText);
        if (idx >= 0) {
          highlights[idx] = suggestion.proposedText;
        } else if (suggestion.changeType === "addition") {
          highlights.push(suggestion.proposedText);
        }
        exp.highlights = highlights;
      }
    } else if (suggestion.section === "projects" && suggestion.itemId) {
      const proj = content.projects?.find((p) => p.id === suggestion.itemId);
      if (proj) {
        const highlights = Array.isArray(proj.highlights) ? [...proj.highlights] : [];
        const idx = highlights.findIndex((h) => h === suggestion.originalText);
        if (idx >= 0) {
          highlights[idx] = suggestion.proposedText;
        } else if (suggestion.changeType === "addition") {
          highlights.push(suggestion.proposedText);
        }
        proj.highlights = highlights;
      }
    } else if (suggestion.section === "skills") {
      const skills = Array.isArray(content.skills) ? [...content.skills] : [];
      const already = skills.some(
        (sk) => (typeof sk === "string" ? sk : sk.name)?.trim().toLowerCase() === suggestion.proposedText.trim().toLowerCase()
      );
      if (!already) {
        skills.push({ id: `tailor-skill-${suggestion.id}`, name: suggestion.proposedText, category: "General", level: 3 });
      }
      content.skills = skills;
    }
  }

  return content;
}
