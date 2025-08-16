import { useState, useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection, $isRangeSelection, $createTextNode } from 'lexical';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, X, ChevronUp, ChevronDown, Replace } from 'lucide-react';

export default function SearchPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [showReplace, setShowReplace] = useState(false);

  const findMatches = useCallback((term) => {
    if (!term) {
      setTotalMatches(0);
      setCurrentMatch(0);
      return [];
    }

    return editor.getEditorState().read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      const matches = [];
      let index = 0;
      
      while (index < textContent.length) {
        const foundIndex = textContent.toLowerCase().indexOf(term.toLowerCase(), index);
        if (foundIndex === -1) break;
        
        matches.push({
          start: foundIndex,
          end: foundIndex + term.length,
          text: textContent.substring(foundIndex, foundIndex + term.length)
        });
        
        index = foundIndex + 1;
      }
      
      setTotalMatches(matches.length);
      if (matches.length > 0 && currentMatch === 0) {
        setCurrentMatch(1);
      }
      
      return matches;
    });
  }, [editor, currentMatch]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    findMatches(term);
  }, [findMatches]);

  const navigateMatch = useCallback((direction) => {
    if (totalMatches === 0) return;
    
    let newMatch = currentMatch;
    if (direction === 'next') {
      newMatch = currentMatch >= totalMatches ? 1 : currentMatch + 1;
    } else {
      newMatch = currentMatch <= 1 ? totalMatches : currentMatch - 1;
    }
    
    setCurrentMatch(newMatch);
    // Here you would implement actual text selection/highlighting
  }, [currentMatch, totalMatches]);

  const replaceCurrentMatch = useCallback(() => {
    if (!searchTerm || !replaceTerm || totalMatches === 0) return;
    
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertText(replaceTerm);
      }
    });
    
    // Update search after replacement
    setTimeout(() => handleSearch(searchTerm), 100);
  }, [editor, searchTerm, replaceTerm, totalMatches, handleSearch]);

  const replaceAll = useCallback(() => {
    if (!searchTerm || !replaceTerm) return;
    
    editor.update(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      // Escape special regex characters
      const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const newContent = textContent.replace(
        new RegExp(escapedSearchTerm, 'gi'),
        replaceTerm
      );
      
      // This is a simplified replacement - in a real implementation,
      // you'd need to properly handle the lexical node structure
      root.clear();
      root.append($createTextNode(newContent));
    });
    
    handleSearch(searchTerm);
  }, [editor, searchTerm, replaceTerm, handleSearch]);

  // Keyboard shortcut for search (Ctrl+F)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        setIsSearchOpen(true);
      } else if (event.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  if (!isSearchOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsSearchOpen(true)}
        className="h-8 w-8 p-0"
        title="Search (Ctrl+F)"
      >
        <Search className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="absolute top-12 right-4 z-50 p-3 shadow-lg border bg-background min-w-[300px]">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplace(!showReplace)}
            className="h-8 w-8 p-0"
            title="Toggle Replace"
          >
            <Replace className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {showReplace && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Replace with..."
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={replaceCurrentMatch}
              disabled={totalMatches === 0}
            >
              Replace
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={replaceAll}
              disabled={totalMatches === 0}
            >
              All
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {totalMatches > 0 ? `${currentMatch} of ${totalMatches}` : 'No matches'}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMatch('prev')}
              disabled={totalMatches === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMatch('next')}
              disabled={totalMatches === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}