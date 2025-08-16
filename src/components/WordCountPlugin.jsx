import { useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';

export default function WordCountPlugin({ postType }) {
  const [editor] = useLexicalComposerContext();
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        
        // Count words
        const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
        const count = words.length;
        setWordCount(count);
        
        // Calculate reading time (average 200 words per minute)
        const minutes = Math.ceil(count / 200);
        setReadingTime(minutes);
      });
    });
  }, [editor]);

  // Only show for articles
  if (postType !== 'article') return null;

  return (
    <div className="flex items-center gap-4 px-3 py-2 text-sm text-muted-foreground border-t">
      <span>{wordCount} words</span>
      <span>•</span>
      <span>{readingTime} min read</span>
    </div>
  );
}