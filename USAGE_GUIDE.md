# Usage Guide: Adaptive Rich Text Editor

This guide provides detailed instructions on how to use and customize the Adaptive Rich Text Editor for your deep tech social media application.

## Quick Start

### 1. Basic Setup

```jsx
import RichTextEditor from './components/RichTextEditor';

function MyApp() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <RichTextEditor />
    </div>
  );
}
```

### 2. Understanding Post Types

The editor adapts its interface based on four distinct post types:

#### 💭 Micro-blog Mode (Default)
- **Purpose**: Quick thoughts, updates, announcements
- **Character Limit**: 280 characters
- **Features**: Basic formatting, emoji, media upload
- **Best For**: Twitter-like posts, status updates

#### 📝 Article Mode
- **Purpose**: Long-form content, technical articles, tutorials
- **Character Limit**: Unlimited
- **Features**: Full rich text editing, headings, lists, code blocks
- **Best For**: Blog posts, documentation, detailed explanations

#### 📊 Poll Mode
- **Purpose**: Community engagement, decision making
- **Features**: Question + multiple options, settings configuration
- **Best For**: Surveys, voting, community feedback

#### 📅 Event Mode
- **Purpose**: Event planning and announcements
- **Features**: Date/time, location, attendee management
- **Best For**: Meetups, conferences, workshops

## Feature Deep Dive

### Rich Text Formatting

#### Basic Formatting (All Modes)
```
Bold: Ctrl/Cmd + B or toolbar button
Italic: Ctrl/Cmd + I or toolbar button
Underline: Ctrl/Cmd + U or toolbar button
Strikethrough: Toolbar button only
```

#### Advanced Formatting (Article Mode Only)
- **Headings**: H1 and H2 support for document structure
- **Lists**: Bullet points and numbered lists
- **Quotes**: Block quotes for emphasis
- **Code**: Inline and block code formatting
- **Links**: URL insertion with validation

### Emoji Integration

The custom emoji picker includes 100+ commonly used emojis organized in a grid:

```jsx
// Emoji categories included:
- Faces and emotions (😀 😃 😄 😁 😆)
- Hand gestures (👍 👎 👌 ✌️ 🤞)
- Objects and symbols (🚀 💻 🔬 🧬 ⚡)
```

**Usage Tips:**
- Click the smile icon (😊) in the toolbar
- Click any emoji to insert it at cursor position
- Picker closes automatically after selection
- Click outside to close without selecting

### Media Upload

The media upload component supports:
- **File Types**: PNG, JPG, GIF
- **Size Limit**: 10MB per file
- **Max Files**: 4 files per post
- **Preview**: Thumbnail preview with remove option

**Upload Methods:**
1. Click the upload area
2. Drag and drop files
3. Use the "Add More Images" button

### Poll Creation

#### Basic Poll Setup
1. Switch to Poll mode (📊 button)
2. Enter your question (200 character limit)
3. Add 2-6 options (100 characters each)
4. Configure settings

#### Poll Settings
- **Multiple Choices**: Allow users to select multiple options
- **Duration**: 1 hour to 1 week
- **Preview**: Real-time preview of how poll will appear

#### Poll Validation
The poll creator validates:
- Question is not empty
- All options have content
- Minimum 2 options required

### Event Creation

#### Event Information
- **Title**: Event name (100 characters)
- **Description**: Detailed description (500 characters)
- **Tags**: Comma-separated tags for categorization

#### Date and Time
- **Start Date/Time**: Required fields
- **End Date/Time**: Optional fields
- **Timezone**: Uses browser's local timezone

#### Location Management
- **In-Person Events**: Venue address required
- **Virtual Events**: Meeting link required
- **Toggle**: Easy switching between modes

#### Additional Settings
- **Max Attendees**: Optional capacity limit
- **Visibility**: Public or private event
- **Preview**: Real-time event preview

## Customization Guide

### Styling Customization

The editor uses Tailwind CSS. Customize by modifying classes:

```jsx
// Example: Custom container styling
<div className="bg-gray-50 rounded-lg border-2 border-blue-200">
  <RichTextEditor />
</div>
```

### Character Limits

Modify character limits in `RichTextEditor.jsx`:

```jsx
const CHARACTER_LIMITS = {
  [POST_TYPES.MICROBLOG]: 280,  // Change micro-blog limit
  [POST_TYPES.ARTICLE]: null,   // null = unlimited
  // Add custom limits for new post types
};
```

### Custom Post Types

Add new post types by extending the system:

```jsx
// 1. Add to POST_TYPES enum
const POST_TYPES = {
  MICROBLOG: 'microblog',
  ARTICLE: 'article',
  POLL: 'poll',
  EVENT: 'event',
  RESEARCH: 'research',  // New type
};

// 2. Add button to PostTypeSelector
const POST_TYPE_CONFIG = {
  // ... existing types
  [POST_TYPES.RESEARCH]: {
    label: 'Research',
    icon: '🔬',
    description: 'Share research findings'
  }
};

// 3. Create custom component
function ResearchCreator() {
  // Your custom interface
}

// 4. Add to main editor conditional rendering
{postType === POST_TYPES.RESEARCH && <ResearchCreator />}
```

### Emoji Customization

Replace or extend the emoji set:

```jsx
// In EmojiPicker.jsx
const TECH_EMOJIS = [
  '🚀', '💻', '🔬', '🧬', '⚡', '🤖', '🔧', '⚙️', '📡', '🛰️'
];

const COMMON_EMOJIS = [
  ...TECH_EMOJIS,
  // ... other emojis
];
```

### Toolbar Customization

Add custom formatting buttons:

```jsx
// In Toolbar.jsx
const customButton = (
  <Button
    variant="ghost"
    size="sm"
    onClick={handleCustomFormat}
    className="h-8 w-8 p-0"
  >
    <CustomIcon className="h-4 w-4" />
  </Button>
);
```

## Integration Examples

### With Form Libraries

```jsx
import { useForm } from 'react-hook-form';

function PostForm() {
  const { register, handleSubmit, setValue } = useForm();
  
  const handleEditorChange = (content) => {
    setValue('content', content);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RichTextEditor onChange={handleEditorChange} />
      <button type="submit">Publish</button>
    </form>
  );
}
```

### With State Management

```jsx
import { useContext } from 'react';
import { PostContext } from './PostContext';

function ConnectedEditor() {
  const { updatePost } = useContext(PostContext);
  
  return (
    <RichTextEditor 
      onChange={(content) => updatePost({ content })}
    />
  );
}
```

### With API Integration

```jsx
function EditorWithSave() {
  const [content, setContent] = useState('');
  
  const handleSave = async () => {
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
    } catch (error) {
      console.error('Save failed:', error);
    }
  };
  
  return (
    <div>
      <RichTextEditor onChange={setContent} />
      <button onClick={handleSave}>Save Draft</button>
    </div>
  );
}
```

## Best Practices

### Performance
1. **Lazy Load**: Import components only when needed
2. **Memoization**: Use React.memo for static components
3. **Debouncing**: Implement debounced auto-save
4. **Bundle Splitting**: Code-split by post type

### Accessibility
1. **Keyboard Navigation**: Ensure all features work with keyboard
2. **Screen Readers**: Test with screen reader software
3. **Color Contrast**: Maintain WCAG AA compliance
4. **Focus Management**: Proper focus indicators

### User Experience
1. **Auto-save**: Implement draft saving
2. **Validation**: Provide clear error messages
3. **Loading States**: Show progress indicators
4. **Mobile Optimization**: Test on various screen sizes

### Security
1. **Input Sanitization**: Sanitize user content
2. **File Validation**: Validate uploaded files
3. **XSS Prevention**: Escape HTML output
4. **Content Security Policy**: Implement CSP headers

## Troubleshooting

### Common Issues

#### Editor Not Loading
- Check console for JavaScript errors
- Verify all dependencies are installed
- Ensure React version compatibility

#### Formatting Not Working
- Check if correct post type is selected
- Verify Lexical plugins are loaded
- Test with different browsers

#### Emoji Picker Not Appearing
- Check z-index conflicts
- Verify click event handlers
- Test on different devices

#### Media Upload Failing
- Check file size and type restrictions
- Verify upload endpoint configuration
- Test with different file formats

### Debug Mode

Enable debug mode for development:

```jsx
const editorConfig = {
  namespace: 'DeepTechEditor',
  onError: (error) => {
    console.error('Editor Error:', error);
    // Add your error reporting here
  },
  // Add debug flag
  debug: process.env.NODE_ENV === 'development'
};
```

## Migration Guide

### From Other Editors

#### From Draft.js
- Content state conversion required
- Plugin architecture differences
- Styling approach changes

#### From TinyMCE/CKEditor
- HTML to Lexical node conversion
- Plugin replacement mapping
- Configuration syntax differences

### Version Updates
- Check CHANGELOG.md for breaking changes
- Update dependencies gradually
- Test all functionality after updates

---

For additional support, refer to the main README.md or create an issue on GitHub.

