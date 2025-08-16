import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createAutoLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
} from '@lexical/link';
import {
  $createTextNode,
  $isTextNode,
  TextNode,
} from 'lexical';

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const EMAIL_MATCHER =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const MATCHERS = [
  (text) => {
    const match = URL_MATCHER.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
    };
  },
  (text) => {
    const match = EMAIL_MATCHER.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: `mailto:${fullMatch}`,
    };
  },
];



function $createAutoLinkPlugin(node, matchers) {
  const textContent = node.getTextContent();
  let currentNode = node;
  let linkified = false;

  for (let i = 0; i < matchers.length; i++) {
    const match = matchers[i](textContent);
    if (match !== null) {
      const linkNode = $createAutoLinkNode(match.url);
      const linkTextNode = $createTextNode(match.text);
      linkNode.append(linkTextNode);
      
      if (match.index === 0) {
        currentNode.replace(linkNode);
      } else {
        const beforeText = textContent.slice(0, match.index);
        const afterText = textContent.slice(match.index + match.length);
        
        const beforeNode = $createTextNode(beforeText);
        currentNode.replace(beforeNode);
        beforeNode.insertAfter(linkNode);
        
        if (afterText) {
          const afterNode = $createTextNode(afterText);
          linkNode.insertAfter(afterNode);
        }
      }
      linkified = true;
      break;
    }
  }

  return linkified;
}

export default function AutoLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(
      TextNode,
      (node) => {
        if (!$isTextNode(node) || node.isSimpleText() === false) {
          return;
        }

        const parent = node.getParent();
        if ($isLinkNode(parent) || $isAutoLinkNode(parent)) {
          return;
        }

        $createAutoLinkPlugin(node, MATCHERS);
      }
    );
  }, [editor]);

  return null;
}