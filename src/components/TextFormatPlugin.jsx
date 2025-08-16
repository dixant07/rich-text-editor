import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  createCommand,
} from 'lexical';

export const FORMAT_SUBSCRIPT_COMMAND = createCommand('FORMAT_SUBSCRIPT_COMMAND');
export const FORMAT_SUPERSCRIPT_COMMAND = createCommand('FORMAT_SUPERSCRIPT_COMMAND');
export const FORMAT_HIGHLIGHT_COMMAND = createCommand('FORMAT_HIGHLIGHT_COMMAND');

export default function TextFormatPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregisterSubscript = editor.registerCommand(
      FORMAT_SUBSCRIPT_COMMAND,
      () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        return true;
      },
      1,
    );

    const unregisterSuperscript = editor.registerCommand(
      FORMAT_SUPERSCRIPT_COMMAND,
      () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
        return true;
      },
      1,
    );

    const unregisterHighlight = editor.registerCommand(
      FORMAT_HIGHLIGHT_COMMAND,
      () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight');
        return true;
      },
      1,
    );

    return () => {
      unregisterSubscript();
      unregisterSuperscript();
      unregisterHighlight();
    };
  }, [editor]);

  return null;
}