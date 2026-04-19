import { useEffect } from "react";

/**
 * Sets document title and optional meta description for the current view.
 */
export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const previousDescription = meta?.content;
    if (description && meta) {
      meta.content = description;
    }
    return () => {
      document.title = previousTitle;
      if (meta && description !== undefined && previousDescription !== undefined) {
        meta.content = previousDescription;
      }
    };
  }, [title, description]);
}
