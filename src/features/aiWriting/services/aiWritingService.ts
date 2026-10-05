import { apiClient } from '@/shared/services/apiClient';
import { AIWritingRequest } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const aiWritingService = {
  async generate(payload: AIWritingRequest): Promise<string> {
    const res = await apiClient.post<never, ApiResponse<{ result: string }>>('/ai/writing', payload);
    return res.data.result;
  },

  /**
   * Streams the response so the caller can render partial text as it arrives instead of waiting
   * for the full generation to finish — the single biggest lever on perceived latency, since a
   * short rewrite starts appearing within ~1s instead of only after 5-50s of silence.
   *
   * Uses raw fetch (needed for SSE), which bypasses apiClient's axios interceptor — so a 401 here
   * has to be refreshed-and-retried manually, mirroring what that interceptor does for every other
   * call. Access tokens are short-lived (15m), so without this an idle tab reliably 401s here.
   */
  async generateStream(
    payload: AIWritingRequest,
    onChunk: (accumulated: string) => void,
    signal?: AbortSignal
  ): Promise<string> {
    let response = await fetch(`${API_URL}/ai/writing`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify(payload),
      signal,
    });

    if (response.status === 401) {
      const refreshed = await fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include', signal });
      if (refreshed.ok) {
        response = await fetch(`${API_URL}/ai/writing`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
          body: JSON.stringify(payload),
          signal,
        });
      }
    }

    if (!response.ok || !response.body) {
      let message =
        response.status === 401
          ? 'Session expired. Please log in again.'
          : "AI couldn't generate a suggestion right now. Please try again.";
      try {
        const errJson = await response.json();
        message = errJson?.error?.message || message;
      } catch {
        // response wasn't JSON — keep the generic message
      }
      throw new Error(message);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let accumulated = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        let eventData: any;
        try {
          eventData = JSON.parse(trimmed.slice(6));
        } catch {
          continue;
        }
        if (eventData.type === 'chunk' && eventData.text) {
          accumulated += eventData.text;
          onChunk(accumulated);
        } else if (eventData.type === 'error') {
          throw new Error(eventData.error || "AI couldn't generate a suggestion right now. Please try again.");
        }
      }
    }

    return accumulated;
  },
};
