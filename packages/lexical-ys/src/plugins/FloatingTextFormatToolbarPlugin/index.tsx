/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './index.css';

import {$isCodeHighlightNode} from '@lexical/code';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {$isListNode, ListNode} from '@lexical/list';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  // $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
  // $wrapNodes,
} from '@lexical/selection';
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  ElementFormatType,
  // FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {useCallback, useEffect, useRef, useState} from 'react';
import * as React from 'react';
import {createPortal} from 'react-dom';
import {IS_APPLE} from 'shared/environment';

// import {INSERT_INLINE_COMMAND} from '../CommentPlugin';
import {useLocale} from '../../context/LocaleContext';
import ColorPicker from '../../ui/ColorPicker';
import {getDOMRangeRect} from '../../utils/getDOMRangeRect';
import {getSelectedNode} from '../../utils/getSelectedNode';
import {setFloatingElemPosition} from '../../utils/setFloatingElemPosition';
import {
  BlockFormatDropDown,
  BlockType,
  Divider,
  toggleBulletList,
  // toggleCheckList,
  toggleNumberedList,
} from '../CommonToolbar';

function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isBold,
  isCode,
  isItalic,
  isLink,
  isStrikethrough,
  isUnderline,
  // isSubscript,
  // isSuperscript,
  fontColor,
  bgColor,
  blockType,
  formatType,
  locale,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isLink: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
  // isSubscript: boolean;
  // isSuperscript: boolean;
  fontColor: string;
  bgColor: string;
  blockType: BlockType;
  formatType: ElementFormatType;
  locale: any;
}): JSX.Element {
  const {blockTypeToBlockName} = locale;
  const blockTypeRef = useRef(blockType);
  blockTypeRef.current = blockType;
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  // const insertComment = () => {
  //   editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  // };

  const updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchorElem);
    }
  }, [editor, anchorElem]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [editor],
  );

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({color: value});
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({'background-color': value});
    },
    [applyStyleText],
  );

  const formatBulletList = () => {
    toggleBulletList(blockTypeRef.current, editor);
  };

  const formatNumberedList = () => {
    toggleNumberedList(blockTypeRef.current, editor);
  };

  // const formatCheckList = () => {
  //   toggleCheckList(blockTypeRef.current, editor);
  // };

  // const formatQuote = () => {
  //   if (blockType !== 'quote') {
  //     editor.update(() => {
  //       const selection = $getSelection();

  //       if ($isRangeSelection(selection)) {
  //         $wrapNodes(selection, () => $createQuoteNode());
  //       }
  //     });
  //   }
  // };

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener('resize', update);
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [editor, updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateTextFormatFloatingToolbar]);

  return (
    <div ref={popupCharStylesEditorRef} className="floating-text-format-popup">
      {editor.isEditable() && (
        <>
          {blockType in blockTypeToBlockName && (
            <>
              <BlockFormatDropDown
                blockType={blockType}
                editor={editor}
                toolbarItemCls="popup-item"
              />
              <Divider />
            </>
          )}
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            className={'popup-item spaced ' + (isBold ? 'active' : '')}
            aria-label="Format text as bold">
            <i className="iconfont icon-type-bold" />
          </button>
          <ColorPicker
            buttonClassName="popup-item color-picker"
            buttonAriaLabel="Formatting text color"
            buttonIconClassName="iconfont icon-font-color"
            color={fontColor}
            onChange={onFontColorSelect}
            title={locale.textColor}
          />
          <ColorPicker
            buttonClassName="popup-item color-picker"
            buttonAriaLabel="Formatting background color"
            buttonIconClassName="iconfont icon-bg-color"
            color={bgColor}
            onChange={onBgColorSelect}
            title={locale.bgColor}
          />
          <button
            onClick={formatBulletList}
            className={
              'popup-item spaced ' + (blockType === 'bullet' ? 'active' : '')
            }
            title={
              IS_APPLE
                ? `${blockTypeToBlockName.bullet} (⌘+⌥+U)`
                : `${blockTypeToBlockName.bullet} (Ctrl+Alt+U)`
            }
            aria-label={`Format text to bullet. Shortcut: ${
              IS_APPLE ? '⌘U' : 'Ctrl+U'
            }`}>
            <i className="iconfont icon-list-ul" />
          </button>
          <button
            onClick={formatNumberedList}
            className={
              'popup-item spaced ' + (blockType === 'number' ? 'active' : '')
            }
            title={
              IS_APPLE
                ? `${blockTypeToBlockName.number} (⌘+⌥+O)`
                : `${blockTypeToBlockName.number} (Ctrl+Alt+O)`
            }
            aria-label={`Format text to bullet. Shortcut: ${
              IS_APPLE ? '⌘+⌥+O' : 'Ctrl+Alt+O'
            }`}>
            <i className="iconfont icon-list-ol" />
          </button>
          {/* <button
            onClick={formatCheckList}
            className={
              'popup-item spaced ' + (blockType === 'check' ? 'active' : '')
            }
            title={
              IS_APPLE
                ? `${blockTypeToBlockName.check} (⌘+⌥+X)`
                : `${blockTypeToBlockName.check} (Ctrl+Alt+X)`
            }
            aria-label={`Format text to bullet. Shortcut: ${
              IS_APPLE ? '⌘+⌥+X' : 'Ctrl+Alt+X'
            }`}>
            <i className="format check" />
          </button> */}
          {/* <button
            onClick={formatQuote}
            className={
              'popup-item spaced ' + (blockType === 'quote' ? 'active' : '')
            }
            title={
              IS_APPLE
                ? `${blockTypeToBlockName.quote}`
                : `${blockTypeToBlockName.quote}`
            }
            aria-label={`Format text to quote.`}>
            <i className="format quote" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
            className={'popup-item spaced ' + (isItalic ? 'active' : '')}
            aria-label="Format text as italics">
            <i className="format italic" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
            className={'popup-item spaced ' + (isUnderline ? 'active' : '')}
            aria-label="Format text to underlined">
            <i className="format underline" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }}
            className={'popup-item spaced ' + (isStrikethrough ? 'active' : '')}
            aria-label="Format text with a strikethrough">
            <i className="format strikethrough" />
          </button> */}
          {/* <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
            }}
            className={'popup-item spaced ' + (isSubscript ? 'active' : '')}
            title="Subscript"
            aria-label="Format Subscript">
            <i className="format subscript" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
            }}
            className={'popup-item spaced ' + (isSuperscript ? 'active' : '')}
            title="Superscript"
            aria-label="Format Superscript">
            <i className="format superscript" />
          </button> */}
          {/* <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
            className={'popup-item spaced ' + (isCode ? 'active' : '')}
            aria-label="Insert code block">
            <i className="format code" />
          </button> */}
          <button
            onClick={insertLink}
            className={'popup-item spaced ' + (isLink ? 'active' : '')}
            aria-label="Insert link">
            <i className="iconfont icon-link" />
          </button>
          {/* <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
            }}
            className={
              'popup-item spaced ' +
              (formatType === 'left' || formatType === '' ? 'active' : '')
            }
            aria-label="Format text with left align">
            <i className="format left-align" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
            }}
            className={
              'popup-item spaced ' + (formatType === 'center' ? 'active' : '')
            }
            aria-label="Format text with center align">
            <i className="format center-align" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
            }}
            className={
              'popup-item spaced ' + (formatType === 'right' ? 'active' : '')
            }
            aria-label="Format text with right align">
            <i className="format right-align" />
          </button> */}
        </>
      )}
      {/* <button
        onClick={insertComment}
        className={'popup-item spaced'}
        aria-label="Insert comment">
        <i className="format add-comment" />
      </button> */}
    </div>
  );
}

function useFloatingTextFormatToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
): JSX.Element | null {
  const locale = useLocale();
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  // const [isSubscript, setIsSubscript] = useState(false);
  // const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [formatType, setFormatType] = useState<ElementFormatType>('');
  const [blockType, setBlockType] = useState<BlockType>('paragraph');

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });
      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const node = getSelectedNode(selection);

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setFormatType(element.getFormatType());
      // setIsSubscript(selection.hasFormat('subscript'));
      // setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in locale.blockTypeToBlockName) {
            setBlockType(type as BlockType);
          }
        }
      }
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff',
        ),
      );

      // Update links
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ''
      ) {
        setIsText($isTextNode(node));
      } else {
        setIsText(false);
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopup]);

  if (!isText || isLink) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isStrikethrough={isStrikethrough}
      // isSubscript={isSubscript}
      // isSuperscript={isSuperscript}
      isUnderline={isUnderline}
      isCode={isCode}
      fontColor={fontColor}
      bgColor={bgColor}
      blockType={blockType}
      formatType={formatType}
      locale={locale}
    />,
    anchorElem,
  );
}

export default function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(editor, anchorElem);
}
