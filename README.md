# Adaptive Rich Text Editor for Deep Tech Communities

A sophisticated, adaptive rich text editor component built with React and Lexical, specifically designed for social media applications in deep tech communities. The editor dynamically adapts its interface and functionality based on the selected post type.

## Features

### 🔄 Adaptive UI
- **Micro-blog Mode**: Streamlined interface with basic formatting and 280-character limit
- **Article Mode**: Full-featured editor with advanced formatting capabilities
- **Poll Mode**: Specialized interface for creating interactive polls
- **Event Mode**: Comprehensive event creation form with date/time and location management

### ✨ Rich Text Editing (Lexical-powered)
- **Basic Formatting**: Bold, Italic, Underline, Strikethrough
- **Advanced Features** (Article mode):
  - Headings (H1, H2)
  - Block quotes
  - Code blocks
  - Bullet and numbered lists
  - Link insertion
- **Real-time Character Counting**: Dynamic limits based on post type
- **History Support**: Undo/Redo functionality

### 🎨 Media & Interaction
- **Emoji Integration**: Custom emoji picker with 100+ common emojis
- **Media Upload**: Image upload interface with preview functionality
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📊 Specialized Post Types

#### Poll Creator
- Dynamic option management (2-6 options)
- Multiple choice vs single choice selection
- Configurable poll duration (1 hour to 1 week)
- Real-time preview
- Input validation

#### Event Creator
- Event title and description
- Date and time picker (start/end)
- Location management (in-person vs virtual)
- Attendee limits
- Tag system
- Public/private event toggle
- Comprehensive preview

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd rich-text-editor

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

## Dependencies

### Core Dependencies
- **React 18+**: Modern React with hooks
- **@lexical/react**: Lexical editor framework
- **@lexical/rich-text**: Rich text editing capabilities
- **@lexical/list**: List functionality
- **@lexical/link**: Link management
- **@lexical/code**: Code block support
- **@lexical/history**: Undo/redo functionality

### UI Components
- **@radix-ui/react-***: Accessible UI primitives
- **lucide-react**: Modern icon library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

## Usage

### Basic Implementation

```jsx
import RichTextEditor from './components/RichTextEditor';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1>Deep Tech Social Editor</h1>
      <RichTextEditor />
    </div>
  );
}
```

### Post Type Configuration

The editor automatically handles post type switching through the built-in navigation buttons:

- **💭 Micro-blog**: Character-limited posts with basic formatting
- **📝 Article**: Long-form content with advanced formatting
- **📊 Poll**: Interactive poll creation
- **📅 Event**: Event planning and management

### Customization

#### Extending Post Types

```jsx
// Add new post types in RichTextEditor.jsx
const POST_TYPES = {
  MICROBLOG: 'microblog',
  ARTICLE: 'article',
  POLL: 'poll',
  EVENT: 'event',
  // Add your custom type
  CUSTOM: 'custom'
};
```

#### Custom Emoji Sets

```jsx
// Modify COMMON_EMOJIS in EmojiPicker.jsx
const COMMON_EMOJIS = [
  // Add your preferred emojis
  '🚀', '💻', '🔬', '🧬', '⚡', '🤖'
];
```

#### Styling Customization

The editor uses Tailwind CSS classes. Customize the appearance by modifying the className props in the components.

## Component Architecture

### Core Components

1. **RichTextEditor**: Main container component
   - Manages post type state
   - Renders appropriate sub-components
   - Handles Lexical editor configuration

2. **Toolbar**: Adaptive formatting toolbar
   - Basic toolbar for micro-blogs
   - Extended toolbar for articles
   - Context-aware button states

3. **PollCreator**: Specialized poll creation interface
   - Dynamic option management
   - Settings configuration
   - Real-time preview

4. **EventCreator**: Comprehensive event creation form
   - Date/time management
   - Location handling
   - Attendee and visibility settings

5. **EmojiPicker**: Custom emoji selection interface
   - Grid-based emoji display
   - Click-outside handling
   - Smooth insertion

6. **MediaUpload**: File upload and preview component
   - Drag-and-drop interface
   - Image preview
   - File validation

### State Management

The editor uses React's built-in state management with hooks:

- `useState` for component-level state
- `useCallback` for performance optimization
- `useEffect` for side effects and cleanup

### Lexical Integration

The editor leverages Lexical's plugin architecture:

```jsx
const editorConfig = {
  namespace: 'DeepTechEditor',
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    // ... other nodes
  ],
  onError: (error) => console.error(error),
  theme: customTheme
};
```

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: ES2020+ support required

## Performance Considerations

### Optimization Features
- **Lazy Loading**: Components load on demand
- **Memoization**: Expensive operations are cached
- **Virtual Scrolling**: Efficient emoji picker rendering
- **Debounced Updates**: Character counting optimization

### Bundle Size
- Core editor: ~150KB (gzipped)
- With all features: ~200KB (gzipped)
- Tree-shaking friendly

## Accessibility

### ARIA Support
- Proper labeling for screen readers
- Keyboard navigation support
- Focus management
- High contrast mode compatibility

### Keyboard Shortcuts
- **Ctrl/Cmd + B**: Bold
- **Ctrl/Cmd + I**: Italic
- **Ctrl/Cmd + U**: Underline
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Y**: Redo

## Development

### Project Structure
```
src/
├── components/
│   ├── RichTextEditor.jsx    # Main editor component
│   ├── Toolbar.jsx           # Formatting toolbar
│   ├── PollCreator.jsx       # Poll creation interface
│   ├── EventCreator.jsx      # Event creation form
│   ├── EmojiPicker.jsx       # Emoji selection
│   └── MediaUpload.jsx       # File upload handling
├── App.jsx                   # Application root
└── main.jsx                  # Entry point
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Testing

The editor includes comprehensive testing for:
- Post type switching
- Text formatting functionality
- Emoji insertion
- Media upload interface
- Poll and event creation
- Character counting
- Responsive behavior

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use TypeScript for new features
- Follow React best practices
- Maintain accessibility standards
- Write comprehensive tests

## License

MIT License - see LICENSE file for details.

## Support

For issues, feature requests, or questions:
- Create an issue on GitHub
- Check existing documentation
- Review the component source code

---

Built with ❤️ for the deep tech community using React and Lexical.

