import { useEffect, useCallback, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { Button } from '@/components/ui/button';
import { Save, Check } from 'lucide-react';

export default function SavePlugin({ onSave, autoSave = true, autoSaveInterval = 30000 }) {
  const [editor] = useLexicalComposerContext();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const saveContent = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const editorState = editor.getEditorState();
      const content = editorState.read(() => {
        const root = $getRoot();
        return {
          text: root.getTextContent(),
          html: root.getTextContent(), // You can implement HTML serialization here
          json: JSON.stringify(editorState.toJSON()),
        };
      });

      if (onSave) {
        await onSave(content);
      }
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editor, onSave, isSaving]);

  // Track changes
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      setHasUnsavedChanges(true);
    });
  }, [editor]);

  // Auto-save
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      saveContent();
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [autoSave, autoSaveInterval, hasUnsavedChanges, saveContent]);

  // Keyboard shortcut for save (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveContent();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveContent]);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={saveContent}
        disabled={isSaving || !hasUnsavedChanges}
        className="flex items-center gap-2"
      >
        {isSaving ? (
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : hasUnsavedChanges ? (
          <Save className="h-4 w-4" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save' : 'Saved'}
      </Button>
      
      {lastSaved && (
        <span className="text-xs text-muted-foreground">
          Last saved: {lastSaved.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}