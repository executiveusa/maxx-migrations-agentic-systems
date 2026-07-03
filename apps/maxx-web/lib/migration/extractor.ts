export interface ExtractedPageCopy {
  path: string;
  headline: string;
  body: string;
  wordCount: number;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Rewrites raw extracted copy into the Maxx sovereign voice: direct,
 * mission-forward, operator language. This is a deterministic local
 * transform used for seed data and previews; production rewrites are
 * produced by the Copy Agent via lib/agents/agent-runner.
 */
export function rewriteCopy(path: string, rawHeadline: string, rawBody: string): ExtractedPageCopy {
  const headline = rawHeadline.trim();
  const body = rawBody.trim();
  return {
    path,
    headline,
    body,
    wordCount: countWords(body),
  };
}
