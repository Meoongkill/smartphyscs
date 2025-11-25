import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  $getRoot, 
  $getSelection, 
  $insertNodes,
  $createParagraphNode,
  $isRangeSelection,
  DecoratorNode,
  FORMAT_TEXT_COMMAND,
} from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingNode,
  QuoteNode,
} from '@lexical/rich-text';
import {
  $createListItemNode,
  $createListNode,
  $isListNode,
  ListItemNode,
  ListNode,
} from '@lexical/list';
import {
  $createLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
  LinkNode,
} from '@lexical/link';
import { $generateNodesFromDOM } from '@lexical/html';

// Simple Image Node
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

function $isImageNode(node) {
  return node instanceof ImageNode;
}

// Toolbar Component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [updateToolbar, editor]);

  const formatHeading = (headingSize) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' 
          ? anchorNode 
          : anchorNode.getTopLevelElementOrThrow();
        
        if ($isHeadingNode(element) && element.getTag() === headingSize) {
          const paragraph = $createParagraphNode();
          element.replace(paragraph);
        } else {
          const heading = $createHeadingNode(headingSize);
          element.replace(heading);
        }
      }
    });
  };

  const formatList = (listType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' 
          ? anchorNode 
          : anchorNode.getTopLevelElementOrThrow();
        
        if ($isListNode(element) && element.getListType() === listType) {
          const paragraph = $createParagraphNode();
          element.replace(paragraph);
        } else {
          const list = $createListNode(listType);
          const listItem = $createListItemNode();
          list.append(listItem);
          element.replace(list);
        }
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' 
          ? anchorNode 
          : anchorNode.getTopLevelElementOrThrow();
        
        const quote = $createQuoteNode();
        element.replace(quote);
      }
    });
  };

  const insertLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
  };

  const onImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const imageNode = $createImageNode(e.target.result, file.name);
            $insertNodes([imageNode]);
          }
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-gray-300 bg-gray-50">
      <button
        onClick={() => formatHeading('h1')}
        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
      >
        H1
      </button>
      <button
        onClick={() => formatHeading('h2')}
        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
      >
        H2
      </button>
      <button
        onClick={() => formatHeading('h3')}
        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
      >
        H3
      </button>
      
      <div className="border-l border-gray-300 mx-2"></div>
      
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
          isBold ? 'bg-blue-100 border-blue-300' : ''
        }`}
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
          isItalic ? 'bg-blue-100 border-blue-300' : ''
        }`}
      >
        <em>I</em>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
          isUnderline ? 'bg-blue-100 border-blue-300' : ''
        }`}
      >
        <u>U</u>
      </button>
      
      <div className="border-l border-gray-300 mx-2"></div>
      
      <button
        onClick={() => formatList('bullet')}
        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
      >
        • List
      </button>
      <button
        onClick={() => formatList('number')}
        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
      >
        1. List
      </button>
      <button
        onClick={formatQuote}
        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
      >
        Quote
      </button>
      <button
        onClick={insertLink}
        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
      >
        🔗 Link
      </button>
      
      <label className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
        📷 Image
      </label>
    </div>
  );
}

// Initialize content plugin
function InitializePlugin({ value }) {
  const [editor] = useLexicalComposerContext();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    if (value) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        try {
          const editorState = editor.parseEditorState(
            typeof value === 'string' ? value : JSON.stringify(value)
          );
          editor.setEditorState(editorState);
        } catch (e) {
          try {
            const parser = new DOMParser();
            const dom = parser.parseFromString(String(value), 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom.body);
            root.append(...nodes);
          } catch (err) {
            console.error('Failed to initialize Lexical content', err);
          }
        }
      });
    }
  }, [editor, value]);

  return null;
}

// Main LexicalEditor Component
export default function LexicalEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Enter some text...', 
  className = '',
  readOnly = false 
}) {
  const initialConfig = {
    namespace: 'LexicalEditor',
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
        nested: {
          listitem: 'list-none',
        },
        ol: 'list-decimal ml-6',
        ul: 'list-disc ml-6',
        listitem: 'mb-1',
      },
      link: 'text-blue-600 underline hover:text-blue-800',
      quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4',
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      LinkNode,
      ImageNode,
    ],
    onError(error) {
      console.error('Lexical Error:', error);
    },
    editable: !readOnly,
  };

  const handleChange = (editorState) => {
    try {
      const json = editorState.toJSON();
      onChange && onChange(JSON.stringify(json));
    } catch (e) {
      console.error('Failed to serialize editor state to JSON', e);
    }
  };

  return (
    <div className={`lexical-editor border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        {!readOnly && <ToolbarPlugin />}
        <div className="editor-container relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="editor-input min-h-[200px] p-4 outline-none resize-none overflow-auto focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                style={{ caretColor: 'rgb(5, 5, 5)' }}
              />
            }
            placeholder={
              <div className="editor-placeholder absolute top-4 left-4 text-gray-400 pointer-events-none select-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <InitializePlugin value={value} />
        </div>
      </LexicalComposer>
    </div>
  );
}