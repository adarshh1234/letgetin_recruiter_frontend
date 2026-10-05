"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, Bot } from "lucide-react";
import { useAiCoachStore } from "@/features/resume/store/useAiCoachStore";
import { EmbeddedAiChat } from "@/features/resume/components/ai/EmbeddedAiChat";
import { TailorChatPanel } from "./TailorChatPanel";

type CenterTab = "tailor" | "coach";

/**
 * The Resume Editor's own "Write with AI" / section AI buttons (reused unmodified in Column 1)
 * open the existing AI Coach chat (useAiCoachStore + EmbeddedAiChat) - that chat isn't otherwise
 * rendered anywhere in the Tailor Resume workspace, so those buttons appeared to do nothing.
 * This exposes it as a second tab and auto-switches to it whenever one of those buttons fires.
 */
export function TailorCenterColumn() {
  const [tab, setTab] = useState<CenterTab>("tailor");
  const coachMessageCount = useAiCoachStore((s) => s.messages.length);
  // useAiCoachStore.isOpen defaults to true ambiently (it's the normal builder's own default),
  // so it can't reliably signal "the user just clicked Write with AI". A new message being
  // appended can only happen from an actual trigger/send, so that's what we watch instead.
  const initialMessageCountRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialMessageCountRef.current === null) {
      initialMessageCountRef.current = coachMessageCount;
      return;
    }
    if (coachMessageCount > initialMessageCountRef.current) {
      setTab("coach");
      initialMessageCountRef.current = coachMessageCount;
    }
  }, [coachMessageCount]);

  return (
    <div className="h-full min-h-0 flex flex-col gap-2">
      <div className="flex items-center gap-1.5 bg-surface border border-border rounded-xl p-1 shrink-0">
        <button
          type="button"
          onClick={() => setTab("tailor")}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 rounded-lg transition cursor-pointer ${
            tab === "tailor" ? "bg-gradient-brand text-white" : "text-ink-soft hover:text-ink"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Tailoring Chat</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("coach")}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 rounded-lg transition cursor-pointer ${
            tab === "coach" ? "bg-gradient-brand text-white" : "text-ink-soft hover:text-ink"
          }`}
          title="Powers the Write with AI / section AI buttons in the editor below"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Coach</span>
        </button>
      </div>
      <div className="flex-1 min-h-0">{tab === "tailor" ? <TailorChatPanel /> : <EmbeddedAiChat />}</div>
    </div>
  );
}
