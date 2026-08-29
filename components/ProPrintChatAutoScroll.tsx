'use client';

import { useEffect } from 'react';

export function ProPrintChatAutoScroll() {
  useEffect(() => {
    let frame = 0;

    const scrollToLatest = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const panel = document.querySelector<HTMLElement>('section[aria-label="ProPrint Assistant"]');
        if (!panel) return;

        const scroller = panel.querySelector<HTMLElement>('.overflow-y-auto');
        if (!scroller) return;

        scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
      });
    };

    const observer = new MutationObserver((mutations) => {
      const chatbotChanged = mutations.some((mutation) => {
        const target = mutation.target as HTMLElement;
        return target.closest?.('section[aria-label="ProPrint Assistant"]') ||
          Array.from(mutation.addedNodes).some((node) =>
            node instanceof HTMLElement &&
            (node.matches?.('section[aria-label="ProPrint Assistant"]') || node.querySelector?.('section[aria-label="ProPrint Assistant"]'))
          );
      });

      if (chatbotChanged) scrollToLatest();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
