import { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Check, X, ExternalLink } from 'lucide-react';

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
    return focus.getNode();
  } else {
    return anchor.getNode();
  }
}

export default function FloatingLinkEditor() {
  const [editor] = useLexicalComposerContext();
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const updateLinkEditor = useCallback(() => {
    try {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        if ($isLinkNode(parent)) {
          setLinkUrl(parent.getURL());
          setIsVisible(true);
        } else if ($isLinkNode(node)) {
          setLinkUrl(node.getURL());
          setIsVisible(true);
        } else {
          setLinkUrl('');
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }

      // Position the floating editor
      const editorElem = editorRef.current;
      if (!editorElem || !isVisible) {
        if (editorElem) {
          editorElem.style.opacity = '0';
          editorElem.style.top = '-1000px';
          editorElem.style.left = '-1000px';
        }
        return;
      }

      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        nativeSelection &&
        !nativeSelection.isCollapsed &&
        rootElement &&
        nativeSelection.anchorNode &&
        rootElement.contains(nativeSelection.anchorNode)
      ) {
        try {
          const domRange = nativeSelection.getRangeAt(0);
          const rect = domRange.getBoundingClientRect();

          editorElem.style.opacity = '1';
          editorElem.style.top = `${rect.bottom + window.scrollY + 10}px`;
          editorElem.style.left = `${rect.left + window.scrollX}px`;
        } catch (error) {
          console.warn('Error positioning floating link editor:', error);
        }
      }
    } catch (error) {
      console.warn('Error in updateLinkEditor:', error);
    }
  }, [editor, isVisible]);

  useEffect(() => {
    try {
      return mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          try {
            editorState.read(() => {
              updateLinkEditor();
            });
          } catch (error) {
            console.warn('Error in editor update listener:', error);
          }
        }),

        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            try {
              updateLinkEditor();
            } catch (error) {
              console.warn('Error in selection change command:', error);
            }
            return false;
          },
          1,
        ),
      );
    } catch (error) {
      console.warn('Error registering link editor listeners:', error);
      return () => {};
    }
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  const handleLinkSubmission = useCallback(() => {
    try {
      if (linkUrl !== '') {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
      }
      setEditMode(false);
    } catch (error) {
      console.warn('Error submitting link:', error);
    }
  }, [editor, linkUrl]);

  const handleLinkEdit = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleLinkRemove = useCallback(() => {
    try {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      setIsVisible(false);
    } catch (error) {
      console.warn('Error removing link:', error);
    }
  }, [editor]);

  // Don't render if not visible
  if (!isVisible && !isEditMode) {
    return null;
  }

  return (
    <Card
      ref={editorRef}
      className="absolute z-50 p-2 shadow-lg border bg-background"
      style={{
        opacity: 0,
        top: '-1000px',
        left: '-1000px',
        transition: 'opacity 0.1s',
        pointerEvents: 'auto',
      }}
    >
      {isEditMode ? (
        <div className="flex items-center gap-2 min-w-[300px]">
          <Input
            ref={inputRef}
            className="flex-1"
            value={linkUrl}
            onChange={(event) => {
              setLinkUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleLinkSubmission();
              } else if (event.key === 'Escape') {
                event.preventDefault();
                setEditMode(false);
              }
            }}
            placeholder="Enter URL"
          />
          <Button
            size="sm"
            onClick={handleLinkSubmission}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditMode(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline max-w-[200px] truncate"
          >
            {linkUrl || 'Link'}
          </a>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLinkEdit}
            className="h-8 w-8 p-0"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLinkRemove}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}