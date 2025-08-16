import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, $getSelection } from 'lexical';
import { $createParagraphNode, $createTextNode } from 'lexical';

export default function DragDropPlugin({ onFileUpload }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement !== null) {
        prevRootElement.removeEventListener('dragover', onDragOver);
        prevRootElement.removeEventListener('drop', onDrop);
      }
      if (rootElement !== null) {
        rootElement.addEventListener('dragover', onDragOver);
        rootElement.addEventListener('drop', onDrop);
      }
    });

    function onDragOver(event) {
      event.preventDefault();
    }

    function onDrop(event) {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);
      
      if (files.length > 0) {
        handleFiles(files);
      }
    }

    function handleFiles(files) {
      files.forEach((file) => {
        if (file.type.startsWith('image/')) {
          handleImageFile(file);
        } else {
          handleGenericFile(file);
        }
      });
    }

    function handleImageFile(file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target.result;
        editor.update(() => {
          const selection = $getSelection();
          const paragraph = $createParagraphNode();
          const textNode = $createTextNode(`![${file.name}](${src})`);
          paragraph.append(textNode);
          $insertNodes([paragraph]);
        });
      };
      reader.readAsDataURL(file);
      
      // Call the upload handler if provided
      if (onFileUpload) {
        onFileUpload([file]);
      }
    }

    function handleGenericFile(file) {
      editor.update(() => {
        const selection = $getSelection();
        const paragraph = $createParagraphNode();
        const textNode = $createTextNode(`[${file.name}]`);
        paragraph.append(textNode);
        $insertNodes([paragraph]);
      });
      
      // Call the upload handler if provided
      if (onFileUpload) {
        onFileUpload([file]);
      }
    }
  }, [editor, onFileUpload]);

  return null;
}