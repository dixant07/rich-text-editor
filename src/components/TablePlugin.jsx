import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, createCommand } from 'lexical';

export const INSERT_TABLE_COMMAND = createCommand('INSERT_TABLE_COMMAND');

export default function TablePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_TABLE_COMMAND,
      ({ columns = 3, rows = 3 }) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            // For now, just insert a simple table representation
            // In a full implementation, you'd create proper table nodes
            let tableText = '\n';
            for (let i = 0; i < rows; i++) {
              let row = '|';
              for (let j = 0; j < columns; j++) {
                row += ` Cell ${i + 1}-${j + 1} |`;
              }
              tableText += row + '\n';
              if (i === 0) {
                // Add separator row
                let separator = '|';
                for (let j = 0; j < columns; j++) {
                  separator += ' --- |';
                }
                tableText += separator + '\n';
              }
            }
            selection.insertText(tableText);
          }
        });
        return true;
      },
      1,
    );
  }, [editor]);

  return null;
}