import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  KEY_DOWN_COMMAND,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode } from '@lexical/rich-text';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';

export default function KeyboardShortcutsPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        const { ctrlKey, metaKey, key, shiftKey } = event;
        const isModifier = ctrlKey || metaKey;

        if (!isModifier) {
          return false;
        }

        switch (key) {
          case 'b': {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            return true;
          }
          case 'i': {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            return true;
          }
          case 'u': {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            return true;
          }
          case 'k': {
            event.preventDefault();
            const url = prompt('Enter URL:');
            if (url) {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
            }
            return true;
          }
          case '1':
          case '2':
          case '3': {
            if (shiftKey) {
              event.preventDefault();
              const headingLevel = `h${key}`;
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode(headingLevel));
                }
              });
              return true;
            }
            break;
          }
        }

        return false;
      },
      1,
    );
  }, [editor]);

  return null;
}