import React, { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isAtNodeEnd } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from '@lexical/rich-text';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from './TablePlugin';
import { INSERT_HORIZONTAL_RULE_COMMAND } from './HorizontalRulePlugin';
import { UNDO_COMMAND, REDO_COMMAND, CAN_UNDO_COMMAND, CAN_REDO_COMMAND } from 'lexical';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import EmojiPicker from './EmojiPicker';
import MediaUpload from './MediaUpload';
import SearchPlugin from './SearchPlugin';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  Table,
  Minus,
  Undo,
  Redo
} from 'lucide-react';

const LowPriority = 1;

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

export default function Toolbar({ postType }) {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      // Update block type
      if ($isHeadingNode(element)) {
        setBlockType(`h${element.getTag()}`);
      } else if ($isQuoteNode(element)) {
        setBlockType('quote');
      } else if ($isCodeNode(element)) {
        setBlockType('code');
        setIsCode(true);
      } else if ($isListNode(element)) {
        if (element.getListType() === 'bullet') {
          setBlockType('ul');
        } else {
          setBlockType('ol');
        }
      } else {
        setBlockType('paragraph');
        setIsCode(false);
      }

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [activeEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          setActiveEditor(newEditor);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const formatText = useCallback(
    (format) => {
      activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [activeEditor],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      const url = prompt('Enter URL:');
      if (url) {
        activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    } else {
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isLink]);

  const formatHeading = useCallback((headingSize) => {
    if (blockType !== headingSize) {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  }, [activeEditor, blockType]);

  const formatQuote = useCallback(() => {
    if (blockType !== 'quote') {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  }, [activeEditor, blockType]);

  const formatCode = useCallback(() => {
    if (blockType !== 'code') {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
  }, [activeEditor, blockType]);

  const formatBulletList = useCallback(() => {
    if (blockType !== 'ul') {
      activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      activeEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  }, [activeEditor, blockType]);

  const formatNumberedList = useCallback(() => {
    if (blockType !== 'ol') {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      activeEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  }, [activeEditor, blockType]);

  const insertEmoji = useCallback((emoji) => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertText(emoji);
      }
    });
  }, [activeEditor]);

  const handleMediaUpload = useCallback((files) => {
    // For now, just log the files - in a real app, you'd upload them to a server
    console.log('Media files selected:', files);
    // TODO: Implement actual media upload and insertion into editor
  }, []);

  const formatHeading3 = useCallback(() => {
    if (blockType !== 'h3') {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode('h3'));
        }
      });
    }
  }, [activeEditor, blockType]);

  const insertTable = useCallback(() => {
    activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: 3,
      rows: 3,
    });
  }, [activeEditor]);

  const insertHorizontalRule = useCallback(() => {
    activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  }, [activeEditor]);

  const handleUndo = useCallback(() => {
    activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [activeEditor]);

  const handleRedo = useCallback(() => {
    activeEditor.dispatchCommand(REDO_COMMAND, undefined);
  }, [activeEditor]);

  // Basic toolbar for micro-blog
  const renderBasicToolbar = () => (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/20">
      <Button
        variant={isBold ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText('bold')}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant={isItalic ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText('italic')}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant={isUnderline ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText('underline')}
        className="h-8 w-8 p-0"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Button
        variant={isStrikethrough ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText('strikethrough')}
        className="h-8 w-8 p-0"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        variant={isLink ? "default" : "ghost"}
        size="sm"
        onClick={insertLink}
        className="h-8 w-8 p-0"
      >
        <Link className="h-4 w-4" />
      </Button>

      <MediaUpload onMediaSelect={handleMediaUpload} />

      <EmojiPicker onEmojiSelect={insertEmoji} />

      <SearchPlugin />
    </div>
  );

  // Extended toolbar for articles
  const renderExtendedToolbar = () => (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/20 flex-wrap">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          disabled={!canUndo}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRedo}
          disabled={!canRedo}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text formatting */}
      <div className="flex items-center gap-1">
        <Button
          variant={isBold ? "default" : "ghost"}
          size="sm"
          onClick={() => formatText('bold')}
          className="h-8 w-8 p-0"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant={isItalic ? "default" : "ghost"}
          size="sm"
          onClick={() => formatText('italic')}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant={isUnderline ? "default" : "ghost"}
          size="sm"
          onClick={() => formatText('underline')}
          className="h-8 w-8 p-0"
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          variant={isStrikethrough ? "default" : "ghost"}
          size="sm"
          onClick={() => formatText('strikethrough')}
          className="h-8 w-8 p-0"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <Button
          variant={blockType === 'h1' ? "default" : "ghost"}
          size="sm"
          onClick={() => formatHeading('h1')}
          className="h-8 w-8 p-0"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant={blockType === 'h2' ? "default" : "ghost"}
          size="sm"
          onClick={() => formatHeading('h2')}
          className="h-8 w-8 p-0"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant={blockType === 'h3' ? "default" : "ghost"}
          size="sm"
          onClick={formatHeading3}
          className="h-8 w-8 p-0"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Block elements */}
      <div className="flex items-center gap-1">
        <Button
          variant={blockType === 'quote' ? "default" : "ghost"}
          size="sm"
          onClick={formatQuote}
          className="h-8 w-8 p-0"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          variant={blockType === 'code' ? "default" : "ghost"}
          size="sm"
          onClick={formatCode}
          className="h-8 w-8 p-0"
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          variant={blockType === 'ul' ? "default" : "ghost"}
          size="sm"
          onClick={formatBulletList}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant={blockType === 'ol' ? "default" : "ghost"}
          size="sm"
          onClick={formatNumberedList}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Advanced elements */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={insertTable}
          className="h-8 w-8 p-0"
          title="Insert Table"
        >
          <Table className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={insertHorizontalRule}
          className="h-8 w-8 p-0"
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Media and links */}
      <div className="flex items-center gap-1">
        <Button
          variant={isLink ? "default" : "ghost"}
          size="sm"
          onClick={insertLink}
          className="h-8 w-8 p-0"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>

        <MediaUpload onMediaSelect={handleMediaUpload} />

        <EmojiPicker onEmojiSelect={insertEmoji} />

        <SearchPlugin />
      </div>
    </div>
  );

  // Render different toolbars based on post type
  if (postType === 'article') {
    return renderExtendedToolbar();
  }

  return renderBasicToolbar();
}

