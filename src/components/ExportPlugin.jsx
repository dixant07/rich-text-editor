import { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Code, Hash } from 'lucide-react';

export default function ExportPlugin() {
  const [editor] = useLexicalComposerContext();

  const exportAsText = useCallback(() => {
    editor.getEditorState().read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      downloadFile(textContent, 'document.txt', 'text/plain');
    });
  }, [editor]);

  const exportAsHTML = useCallback(() => {
    editor.getEditorState().read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      downloadFile(htmlString, 'document.html', 'text/html');
    });
  }, [editor]);

  const exportAsJSON = useCallback(() => {
    const editorState = editor.getEditorState();
    const jsonString = JSON.stringify(editorState.toJSON(), null, 2);
    downloadFile(jsonString, 'document.json', 'application/json');
  }, [editor]);

  const exportAsMarkdown = useCallback(() => {
    editor.getEditorState().read(() => {
      const root = $getRoot();
      // Basic markdown conversion - you can enhance this
      let markdown = root.getTextContent();
      
      // This is a simplified markdown conversion
      // You would need a more sophisticated converter for full markdown support
      downloadFile(markdown, 'document.md', 'text/markdown');
    });
  }, [editor]);

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportAsText}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsHTML}>
          <Code className="h-4 w-4 mr-2" />
          Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsMarkdown}>
          <Hash className="h-4 w-4 mr-2" />
          Export as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsJSON}>
          <Code className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}