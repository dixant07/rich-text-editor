import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  createCommand,
} from 'lexical';

export const INSERT_HORIZONTAL_RULE_COMMAND = createCommand('INSERT_HORIZONTAL_RULE_COMMAND');

export default function HorizontalRulePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_HORIZONTAL_RULE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const focusNode = selection.focus.getNode();
          
          // Create a paragraph with horizontal rule text
          const hrParagraph = $createParagraphNode();
          hrParagraph.append($createTextNode('---'));
          
          // Insert after current node
          focusNode.getTopLevelElementOrThrow().insertAfter(hrParagraph);
          
          // Create new paragraph after HR
          const newParagraph = $createParagraphNode();
          hrParagraph.insertAfter(newParagraph);
          newParagraph.select();
        }
        return true;
      },
      1,
    );
  }, [editor]);

  return null;
}