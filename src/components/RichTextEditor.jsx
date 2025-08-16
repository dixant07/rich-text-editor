import React, { useState, useCallback, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';

// Import transformers for markdown shortcuts
import { TRANSFORMERS } from '@lexical/markdown';

// Lexical nodes
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { MarkNode } from '@lexical/mark';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
// Note: HorizontalRuleNode might need to be implemented separately

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import Toolbar from './Toolbar';
import PollCreator from './PollCreator';
import EventCreator from './EventCreator';
import FloatingLinkEditor from './FloatingLinkEditor';
import TablePlugin from './TablePlugin';
import AutoLinkPlugin from './AutoLinkPlugin';
import ClickableLinkPlugin from './ClickableLinkPlugin';
import HorizontalRulePlugin from './HorizontalRulePlugin';
import KeyboardShortcutsPlugin from './KeyboardShortcutsPlugin';
import TextFormatPlugin from './TextFormatPlugin';
import DragDropPlugin from './DragDropPlugin';
import WordCountPlugin from './WordCountPlugin';
import SavePlugin from './SavePlugin';
import ExportPlugin from './ExportPlugin';
import StatusBar from './StatusBar';
import ReadOnlyPlugin from './ReadOnlyPlugin';
import PluginErrorBoundary from './PluginErrorBoundary';
import ErrorBoundary from './ErrorBoundary';


// Post types
const POST_TYPES = {
  MICROBLOG: 'microblog',
  ARTICLE: 'article', 
  POLL: 'poll',
  EVENT: 'event'
};

// Character limits
const CHARACTER_LIMITS = {
  [POST_TYPES.MICROBLOG]: 280,
  [POST_TYPES.ARTICLE]: null, // No limit
  [POST_TYPES.POLL]: 200,
  [POST_TYPES.EVENT]: 500,
};

// Character counter component
function CharacterCounter({ postType }) {
  const [editor] = useLexicalComposerContext();
  const [characterCount, setCharacterCount] = useState(0);
  const limit = CHARACTER_LIMITS[postType];

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        setCharacterCount(textContent.length);
      });
    });
  }, [editor]);

  if (!limit) return null;

  const isOverLimit = characterCount > limit;
  const remaining = limit - characterCount;

  return (
    <div className={`text-sm px-3 py-2 text-right ${
      isOverLimit ? 'text-destructive' : 'text-muted-foreground'
    }`}>
      <span className={isOverLimit ? 'font-bold' : ''}>
        {remaining < 0 ? `${Math.abs(remaining)} over limit` : `${remaining} remaining`}
      </span>
      <span className="ml-2 text-xs">
        {characterCount}/{limit}
      </span>
    </div>
  );
}

// Editor theme
const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    hashtag: 'editor-text-hashtag',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
};

// Initial editor config
function createEditorConfig(postType) {
  const baseNodes = [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    LinkNode,
    AutoLinkNode,
    MarkNode,
  ];

  // Add more nodes for article mode
  const articleNodes = postType === POST_TYPES.ARTICLE 
    ? [...baseNodes, TableNode, TableCellNode, TableRowNode]
    : baseNodes;

  return {
    namespace: 'RichTextEditor',
    theme,
    onError: (error) => {
      console.error('Lexical Error:', error);
    },
    nodes: articleNodes,
    editable: true,
  };
}

// Placeholder component
function Placeholder({ postType }) {
  const placeholders = {
    [POST_TYPES.MICROBLOG]: "What's on your mind?",
    [POST_TYPES.ARTICLE]: "Write your article...",
    [POST_TYPES.POLL]: "Ask a question...",
    [POST_TYPES.EVENT]: "Create an event..."
  };

  return (
    <div className="editor-placeholder absolute top-4 left-4 text-muted-foreground pointer-events-none">
      {placeholders[postType]}
    </div>
  );
}

// Post type selector component
function PostTypeSelector({ currentType, onTypeChange }) {
  const types = [
    { key: POST_TYPES.MICROBLOG, label: 'Micro-blog', icon: '💭' },
    { key: POST_TYPES.ARTICLE, label: 'Article', icon: '📝' },
    { key: POST_TYPES.POLL, label: 'Poll', icon: '📊' },
    { key: POST_TYPES.EVENT, label: 'Event', icon: '📅' },
  ];

  return (
    <div className="flex gap-2 p-2 border-b">
      {types.map((type) => (
        <Button
          key={type.key}
          variant={currentType === type.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange(type.key)}
          className="flex items-center gap-2"
        >
          <span>{type.icon}</span>
          {type.label}
        </Button>
      ))}
    </div>
  );
}

// Main RichTextEditor component
export default function RichTextEditor() {
  const [postType, setPostType] = useState(POST_TYPES.MICROBLOG);
  const [editorConfig, setEditorConfig] = useState(() => createEditorConfig(POST_TYPES.MICROBLOG));
  const [editorState, setEditorState] = useState(null);

  const handlePostTypeChange = useCallback((newType) => {
    setPostType(newType);
    setEditorConfig(createEditorConfig(newType));
  }, []);

  const handleEditorChange = useCallback((editorState) => {
    setEditorState(editorState);
  }, []);

  const handleFileUpload = useCallback((files) => {
    console.log('Files uploaded:', files);
    // Handle file upload logic here
  }, []);

  const handleSave = useCallback(async (content) => {
    console.log('Saving content:', content);
    // Implement your save logic here
    // This could be an API call to save to a database
    return new Promise((resolve) => {
      setTimeout(resolve, 1000); // Simulate API call
    });
  }, []);

  return (
    <ErrorBoundary>
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border border-border rounded-lg overflow-hidden">
          <PostTypeSelector 
            currentType={postType} 
            onTypeChange={handlePostTypeChange} 
          />
          
          <div className="p-0">
            {postType === POST_TYPES.POLL ? (
              <div className="p-4">
                <PollCreator />
              </div>
            ) : postType === POST_TYPES.EVENT ? (
              <div className="p-4">
                <EventCreator />
              </div>
            ) : (
              <ErrorBoundary>
                <LexicalComposer initialConfig={editorConfig}>
                  <div className="relative">
                    <Toolbar postType={postType} />
                    <RichTextPlugin
                      contentEditable={
                        <ContentEditable 
                          className="min-h-[200px] p-4 focus:outline-none resize-none"
                          style={{ outline: 'none' }}
                        />
                      }
                      placeholder={<Placeholder postType={postType} />}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    
                    {/* Core Plugins */}
                    <OnChangePlugin onChange={handleEditorChange} />
                    <HistoryPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <TabIndentationPlugin />
                    
                    {/* Enhanced Plugins for Article Mode */}
                    {postType === POST_TYPES.ARTICLE && (
                      <>
                        <PluginErrorBoundary pluginName="MarkdownShortcutPlugin">
                          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                        </PluginErrorBoundary>
                        <PluginErrorBoundary pluginName="TablePlugin">
                          <TablePlugin />
                        </PluginErrorBoundary>
                        <PluginErrorBoundary pluginName="HorizontalRulePlugin">
                          <HorizontalRulePlugin />
                        </PluginErrorBoundary>
                      </>
                    )}
                    
                    {/* Auto-link and Clickable Links */}
                    <PluginErrorBoundary pluginName="AutoLinkPlugin">
                      <AutoLinkPlugin />
                    </PluginErrorBoundary>
                    <PluginErrorBoundary pluginName="ClickableLinkPlugin">
                      <ClickableLinkPlugin />
                    </PluginErrorBoundary>
                    
                    {/* Keyboard Shortcuts */}
                    <KeyboardShortcutsPlugin />
                    
                    {/* Text Formatting */}
                    <TextFormatPlugin />
                    
                    {/* Drag and Drop */}
                    <DragDropPlugin onFileUpload={handleFileUpload} />
                    
                    {/* Floating Link Editor */}
                    <ErrorBoundary>
                      <FloatingLinkEditor />
                    </ErrorBoundary>
                    
                    <CharacterCounter postType={postType} />
                    <WordCountPlugin postType={postType} />
                    <StatusBar />
                    <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/20">
                      <div className="flex items-center gap-2">
                        <SavePlugin onSave={handleSave} />
                        <ReadOnlyPlugin />
                      </div>
                      <ExportPlugin />
                    </div>
                  </div>
                </LexicalComposer>
              </ErrorBoundary>
            )}
          </div>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

