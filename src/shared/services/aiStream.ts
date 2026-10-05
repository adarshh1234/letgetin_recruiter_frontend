/**
 * Shared SSE client for the backend's AI streaming endpoints (`/ai/chat`, `/ai/assistant`).
 * Both endpoints emit the same event protocol: `data: {"type":"chunk"|"done"|"error", ...}\n\n`,
 * where "chunk" carries a fragment of an in-progress JSON-mode token stream (not human-readable
 * prose), so a partial "reply" field is regex-extracted out of the accumulated buffer to show
 * live typing before the full object is complete.
 */

interface StreamEvent<T> {
  type: 'chunk' | 'done' | 'error';
  text?: string;
  data?: T;
  error?: string;
}

export interface StreamAiChatOptions {
  url: string;
  body: Record<string, unknown>;
  onPartialReply?: (partialText: string) => void;
}

export async function streamAiChat<T>(options: StreamAiChatOptions): Promise<T> {
  const { url, body, onPartialReply } = options;

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream, application/json',
    },
    body: JSON.stringify({ ...body, stream: true }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/event-stream') || !response.body) {
    const json = await response.json();
    return (json.data ?? json) as T;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let rawBuffer = '';
  let progressiveAccumulated = '';
  let result: T | null = null;
  let streamError: string | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    rawBuffer += decoder.decode(value, { stream: true });
    const lines = rawBuffer.split('\n\n');
    rawBuffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;

      try {
        const eventData = JSON.parse(trimmed.slice(6)) as StreamEvent<T>;
        if (eventData.type === 'chunk' && eventData.text) {
          progressiveAccumulated += eventData.text;
          if (onPartialReply) {
            const match = progressiveAccumulated.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)/);
            if (match && match[1]) {
              const extracted = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
              if (extracted.trim().length > 0) onPartialReply(extracted);
            }
          }
        } else if (eventData.type === 'done' && eventData.data) {
          result = eventData.data;
        } else if (eventData.type === 'error') {
          streamError = eventData.error || 'Stream error';
        }
      } catch {
        // Partial chunk parse error during streaming is expected; ignore and keep buffering.
      }
    }
  }

  if (streamError) {
    throw new Error(streamError);
  }
  if (result === null) {
    throw new Error('Stream ended without a completion event');
  }
  return result;
}
