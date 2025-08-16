import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isLinkNode } from '@lexical/link';
import { $getNearestNodeFromDOMNode } from 'lexical';

export default function ClickableLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const onClick = (event) => {
      const linkDomNode = event.target.closest('a');
      
      if (linkDomNode === null) {
        return;
      }

      const href = linkDomNode.getAttribute('href');
      
      if (
        linkDomNode.getAttribute('contenteditable') === 'false' ||
        href === undefined ||
        href === null ||
        href === ''
      ) {
        return;
      }

      // Let the user open the link in a new tab with Ctrl/Cmd + Click
      if (event.metaKey || event.ctrlKey) {
        window.open(href, '_blank');
        return;
      }

      // Prevent default link behavior in editor
      event.preventDefault();
      
      // Optional: You can add custom link handling here
      // For now, we'll just open in the same tab
      window.open(href, '_blank');
    };

    const onMouseEnter = (event) => {
      const linkDomNode = event.target.closest('a');
      if (linkDomNode !== null) {
        linkDomNode.style.cursor = 'pointer';
      }
    };

    const onMouseLeave = (event) => {
      const linkDomNode = event.target.closest('a');
      if (linkDomNode !== null) {
        linkDomNode.style.cursor = 'text';
      }
    };

    return editor.registerRootListener(
      (
        rootElement,
        prevRootElement,
      ) => {
        if (prevRootElement !== null) {
          prevRootElement.removeEventListener('click', onClick);
          prevRootElement.removeEventListener('mouseenter', onMouseEnter);
          prevRootElement.removeEventListener('mouseleave', onMouseLeave);
        }
        if (rootElement !== null) {
          rootElement.addEventListener('click', onClick);
          rootElement.addEventListener('mouseenter', onMouseEnter);
          rootElement.addEventListener('mouseleave', onMouseLeave);
        }
      },
    );
  }, [editor]);

  return null;
}