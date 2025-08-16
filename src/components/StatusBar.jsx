import { useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';

export default function StatusBar() {
  const [editor] = useLexicalComposerContext();
  const [selectionInfo, setSelectionInfo] = useState({
    characters: 0,
    words: 0,
    lines: 1,
    selectedText: '',
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        
        if ($isRangeSelection(selection)) {
          const selectedText = selection.getTextContent();
          const selectedWords = selectedText.trim() ? selectedText.trim().split(/\s+/).length : 0;
          
          setSelectionInfo({
            characters: selectedText.length,
            words: selectedWords,
            lines: selectedText.split('\n').length,
            selectedText: selectedText,
          });
        } else {
          setSelectionInfo({
            characters: 0,
            words: 0,
            lines: 1,
            selectedText: '',
          });
        }
      });
    });
  }, [editor]);

  if (selectionInfo.selectedText.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 px-3 py-1 text-xs text-muted-foreground bg-muted/10 border-t">
      <span>Selected: {selectionInfo.characters} chars</span>
      <span>•</span>
      <span>{selectionInfo.words} words</span>
      {selectionInfo.lines > 1 && (
        <>
          <span>•</span>
          <span>{selectionInfo.lines} lines</span>
        </>
      )}
    </div>
  );
}