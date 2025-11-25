import React, { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { $getRoot, DecoratorNode } from 'lexical';

function InitializeJSONPlugin({ value }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!value) return;
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      try {
        // Try to parse as JSON first
        const editorState = editor.parseEditorState(
          typeof value === 'string' ? value : JSON.stringify(value)
        );
        editor.setEditorState(editorState);
      } catch (e) {
        // If not JSON, treat as plain text/HTML and convert to Lexical format
        console.log('Value is not JSON, converting plain text to Lexical format');
        try {
          // Create a simple Lexical JSON structure from plain text
          const plainTextState = {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: typeof value === 'string' ? value : String(value),
                      type: "text",
                      version: 1
                    }
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "paragraph",
                  version: 1
                }
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "root",
              version: 1
            }
          };
          const editorState = editor.parseEditorState(JSON.stringify(plainTextState));
          editor.setEditorState(editorState);
        } catch (fallbackError) {
          console.error('Failed to convert plain text to Lexical format', fallbackError);
        }
      }
    });
  }, [editor, value]);

  return null;
}

// Simple Image Node (matches LexicalEditor implementation)
class ImageNode extends DecoratorNode {
  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  constructor(src, altText, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  createDOM() {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    return span;
  }

  updateDOM() {
    return false;
  }

  getSrc() {
    return this.__src;
  }

  getAltText() {
    return this.__altText;
  }

  exportJSON() {
    return {
      altText: this.getAltText(),
      src: this.getSrc(),
      type: 'image',
      version: 1,
    };
  }

  static importJSON(serializedNode) {
    const { altText, src } = serializedNode;
    return $createImageNode(src, altText);
  }

  exportDOM() {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    element.style.maxWidth = '100%';
    element.style.height = 'auto';
    return { element };
  }

  decorate() {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          margin: '10px 0',
        }}
      />
    );
  }
}

function $createImageNode(src, altText) {
  return new ImageNode(src, altText);
}

export default function LexicalViewer({ value, className = '' }) {
  const initialConfig = {
    namespace: 'LexicalViewer',
    editable: false,
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
      },
      heading: {
        h1: 'text-2xl font-bold mb-4 mt-2',
        h2: 'text-xl font-bold mb-3 mt-2',
        h3: 'text-lg font-bold mb-2 mt-2',
      },
      list: {
        nested: { listitem: 'list-none' },
        ol: 'list-decimal ml-6',
        ul: 'list-disc ml-6',
        listitem: 'mb-1',
      },
      link: 'text-blue-600 underline hover:text-blue-800',
      quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4',
    },
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode, ImageNode],
    onError(error) {
      console.error('Lexical Viewer Error:', error);
    },
  };

  return (
    <div className={`lexical-viewer ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input p-0 outline-none" />
            }
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ListPlugin />
          <LinkPlugin />
          <InitializeJSONPlugin value={value} />
        </div>
      </LexicalComposer>
    </div>
  );
}