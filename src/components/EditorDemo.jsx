import React from 'react';
import RichTextEditor from './RichTextEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditorDemo() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Advanced Rich Text Editor</h1>
        <p className="text-muted-foreground">
          A comprehensive Lexical-based editor with all advanced features
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Features Overview</CardTitle>
          <CardDescription>
            This editor includes all the advanced Lexical features you requested
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Core Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Rich text formatting (Bold, Italic, Underline, Strikethrough)</li>
                <li>• Multiple post types (Microblog, Article, Poll, Event)</li>
                <li>• Character limits per post type</li>
                <li>• Undo/Redo functionality</li>
                <li>• Auto-save with manual save</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Advanced Formatting</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Headings (H1, H2, H3)</li>
                <li>• Block quotes</li>
                <li>• Code blocks with syntax highlighting</li>
                <li>• Ordered and unordered lists</li>
                <li>• Tables (Article mode)</li>
                <li>• Horizontal rules</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Interactive Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Auto-link detection</li>
                <li>• Clickable links</li>
                <li>• Floating link editor</li>
                <li>• Emoji picker</li>
                <li>• Media upload support</li>
                <li>• Drag & drop file handling</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Productivity</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Markdown shortcuts (Article mode)</li>
                <li>• Keyboard shortcuts (Ctrl+B, Ctrl+I, etc.)</li>
                <li>• Search and replace (Ctrl+F)</li>
                <li>• Word count and reading time</li>
                <li>• Selection status</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Export & Modes</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Export as Text, HTML, JSON, Markdown</li>
                <li>• Preview/Read-only mode</li>
                <li>• Real-time character counting</li>
                <li>• Auto-save with status indicator</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Keyboard Shortcuts</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Ctrl+B: Bold</li>
                <li>• Ctrl+I: Italic</li>
                <li>• Ctrl+U: Underline</li>
                <li>• Ctrl+K: Insert Link</li>
                <li>• Ctrl+F: Search</li>
                <li>• Ctrl+S: Save</li>
                <li>• Ctrl+Shift+1/2/3: Headings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <RichTextEditor />
    </div>
  );
}