import { useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';

export default function ReadOnlyPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isReadOnly, setIsReadOnly] = useState(false);

  const toggleReadOnly = () => {
    const newReadOnlyState = !isReadOnly;
    setIsReadOnly(newReadOnlyState);
    editor.setEditable(!newReadOnlyState);
  };

  useEffect(() => {
    // Set initial editable state
    editor.setEditable(!isReadOnly);
  }, [editor, isReadOnly]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleReadOnly}
      className="flex items-center gap-2"
      title={isReadOnly ? 'Switch to Edit Mode' : 'Switch to Preview Mode'}
    >
      {isReadOnly ? (
        <>
          <Edit className="h-4 w-4" />
          Edit
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          Preview
        </>
      )}
    </Button>
  );
}