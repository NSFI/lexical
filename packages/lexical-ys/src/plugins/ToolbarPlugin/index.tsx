/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {InsertImagePayload} from '../ImagesPlugin';
import type {ElementFormatType, LexicalEditor, NodeKey} from 'lexical';

import './index.css';

import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {$isListNode, ListNode} from '@lexical/list';
// import {INSERT_EMBED_COMMAND} from '@lexical/react/LexicalAutoEmbedPlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$isDecoratorBlockNode} from '@lexical/react/LexicalDecoratorBlockNode';
import {INSERT_HORIZONTAL_RULE_COMMAND} from '@lexical/react/LexicalHorizontalRuleNode';
import {$createQuoteNode, $isHeadingNode} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  // $selectAll,
  $wrapNodes,
} from '@lexical/selection';
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import message from 'antd/lib/message';
import {
  $getNodeByKey,
  // $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  DEPRECATED_$isGridSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as React from 'react';
import {IS_APPLE} from 'shared/environment';

import {useLocale} from '../../context/LocaleContext';
import useModal from '../../hooks/useModal';
// import catTypingGif from '../../images/cat-typing.gif';
import landscapeImage from '../../images/landscape.jpg';
import yellowFlowerImage from '../../images/yellow-flower.jpg';
// import {$createStickyNode} from '../../nodes/StickyNode';
import Button from '../../ui/Button';
import ColorPicker from '../../ui/ColorPicker';
import DropDown, {DropDownItem} from '../../ui/DropDown';
import FileInput from '../../ui/FileInput';
import TextInput from '../../ui/TextInput';
import {getSelectedNode} from '../../utils/getSelectedNode';
import {sanitizeUrl} from '../../utils/url';
import {INSERT_ATTACHMENT_COMMAND} from '../AttachmentPlugin';
import {INSERT_COLLAPSIBLE_COMMAND} from '../CollapsiblePlugin';
import {
  BlockFormatDropDown,
  BlockType,
  Divider,
  toggleBulletList,
  toggleCheckList,
  toggleNumberedList,
} from '../CommonToolbar';
// import {EmbedConfigs} from '../AutoEmbedPlugin';
// import {INSERT_EQUATION_COMMAND} from '../EquationsPlugin';
// import {INSERT_EXCALIDRAW_COMMAND} from '../ExcalidrawPlugin';
import {INSERT_IMAGE_COMMAND} from '../ImagesPlugin';
// import {INSERT_POLL_COMMAND} from '../PollPlugin';
// import {INSERT_TABLE_COMMAND as INSERT_NEW_TABLE_COMMAND} from '../TablePlugin';
import {InsertNewTableDialog, InsertTableDialog} from '../TablePlugin';
import {INSERT_VIDEO_COMMAND} from '../VideoPlugin';
import {beforeUploadFile, getFileSize, getFileSuffix} from './../../utils/file';

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['', '默认字体'],
  ['SimSun, STSong', '宋体'],
  ['NSimSun', '新宋体'],
  ['FangSong_GB2312, FangSong, STFangsong', '仿宋'],
  ['KaiTi_GB2312, KaiTi, STKaiti', '楷体'],
  ['SimHei, STHeiti', '黑体'],
  ['Arial', 'Arial'],
  ['Arial Black', 'Arial Black'],
  ['Times New Roman', 'Times New Roman'],
  ['Courier New', 'Courier New'],
  ['Tahoma', 'Tahoma'],
  ['Verdana', 'Verdana'],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ['12px', '12'],
  ['14px', '14'],
  ['16px', '16'],
  ['18px', '18'],
  ['22px', '22'],
  ['26px', '26'],
  ['30px', '30'],
  ['36px', '36'],
];
const DEFAULT_FONT_SIZE = '16';

export function InsertImageUriDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');

  const isDisabled = src === '';

  return (
    <>
      <TextInput
        label="Image URL"
        placeholder="i.e. https://source.unsplash.com/random"
        onChange={setSrc}
        value={src}
        data-test-id="image-modal-url-input"
      />
      <TextInput
        label="Alt Text"
        placeholder="Random unsplash image"
        onChange={setAltText}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <div className="ToolbarPlugin__dialogActions">
        <Button
          data-test-id="image-modal-confirm-btn"
          disabled={isDisabled}
          onClick={() => onClick({altText, src})}>
          Confirm
        </Button>
      </div>
    </>
  );
}

export function InsertImageUploadedDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');

  const isDisabled = src === '';

  const loadImage = async (files: FileList | null) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result);
      }
      return '';
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  };
  return (
    <>
      <FileInput
        label="Image Upload"
        onChange={loadImage}
        accept="image/*"
        data-test-id="image-modal-file-upload"
      />
      <TextInput
        label="Alt Text"
        placeholder="Descriptive alternative text"
        onChange={setAltText}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <div className="ToolbarPlugin__dialogActions">
        <Button
          data-test-id="image-modal-file-upload-btn"
          disabled={isDisabled}
          onClick={() => onClick({altText, src})}>
          Confirm
        </Button>
      </div>
    </>
  );
}

export function InsertImageDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [mode, setMode] = useState<null | 'url' | 'file'>(null);
  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [activeEditor]);

  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    onClose();
  };

  return (
    <>
      {!mode && (
        <div className="ToolbarPlugin__dialogButtonsList">
          <Button
            data-test-id="image-modal-option-sample"
            onClick={() =>
              onClick(
                hasModifier.current
                  ? {
                      altText:
                        'Daylight fir trees forest glacier green high ice landscape',
                      src: landscapeImage,
                    }
                  : {
                      altText: 'Yellow flower in tilt shift lens',
                      src: yellowFlowerImage,
                    },
              )
            }>
            Sample
          </Button>
          <Button
            data-test-id="image-modal-option-url"
            onClick={() => setMode('url')}>
            URL
          </Button>
          <Button
            data-test-id="image-modal-option-file"
            onClick={() => setMode('file')}>
            File
          </Button>
        </div>
      )}
      {mode === 'url' && <InsertImageUriDialogBody onClick={onClick} />}
      {mode === 'file' && <InsertImageUploadedDialogBody onClick={onClick} />}
    </>
  );
}

export function CommonFileUpload({
  activeEditor,
  id,
  type,
  maxSize,
}: {
  activeEditor: LexicalEditor;
  id: string;
  maxSize: number;
  type: 'image' | 'video' | 'attachment';
}): JSX.Element {
  const accept = {
    attachment:
      '.xls,.xlsx,.csv,.ppt,.pptx,.doc,.docx,.pdf,.key,.txt,.htm,.html,.zip,.rar,.7z,.mp3,.wma,.ape,.flac',
    image: 'image/*',
    video: 'video/*',
  }[type];
  const onLoadFile = useCallback(
    async (e) => {
      const files: FileList | null = e.target.files;
      const fileName = files[0]?.name || '';
      const fileSize = getFileSize(files[0]?.size);
      if (files[0]?.size > maxSize * 1024 * 1024) {
        message.error(`不可超过${maxSize}m`);
        // throw new Error(`不可超过${maxSize}m`);
        return;
      }
      const beforeData = await beforeUploadFile(files[0]);
      if (!beforeData) return;
      const {nosSrc, bodyForm} = beforeData;
      if (type === 'image') {
        activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          altText: '',
          bodyFormData: bodyForm,
          src: nosSrc,
        });
      } else if (type === 'video') {
        activeEditor.dispatchCommand(INSERT_VIDEO_COMMAND, {
          bodyFormData: bodyForm,
          src: nosSrc,
        });
      } else if (type === 'attachment') {
        const {fileType} = getFileSuffix(fileName);
        activeEditor.dispatchCommand(INSERT_ATTACHMENT_COMMAND, {
          bodyFormData: bodyForm,
          fileName: fileName,
          fileSize: fileSize,
          fileType: fileType,
          src: nosSrc,
        });
      }
    },
    [activeEditor],
  );
  return (
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={onLoadFile}
      hidden={true}
    />
  );
}

function dropDownActiveClass(active: boolean) {
  if (active) return 'active dropdown-item-active';
  else return '';
}

function FontDropDown({
  editor,
  value,
  style,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}): JSX.Element {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if (option !== '') {
            $patchStyleText(selection, {
              [style]: option,
            });
          }
        }
      });
    },
    [editor, style],
  );

  const buttonAriaLabel =
    style === 'font-family'
      ? 'Formatting options for font family'
      : 'Formatting options for font size';
  return (
    <DropDown
      disabled={disabled}
      buttonClassName={'toolbar-item ' + style}
      buttonLabel={value}
      buttonIconClassName={
        style === 'font-family' ? 'iconfont icon-font-family' : ''
      }
      buttonAriaLabel={buttonAriaLabel}>
      {(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
        ([option, text]) => (
          <DropDownItem
            className={`item ${dropDownActiveClass(value === option)} ${
              style === 'font-size' ? 'fontsize-item' : ''
            }`}
            onClick={() => handleClick(option)}
            key={option}>
            <span className="text">{text}</span>
          </DropDownItem>
        ),
      )}
    </DropDown>
  );
}

function InsertDropDown({
  locale,
  blockType,
  editor,
  showModal,
  isLink,
}: {
  locale: any;
  blockType: BlockType;
  editor: LexicalEditor;
  showModal: (
    title: string,
    setModalContent: (onClose: () => void) => JSX.Element,
  ) => void;
  isLink: boolean;
}): JSX.Element {
  const [activeEditor] = useState(editor);
  // const insertGifOnClick = (payload: InsertImagePayload) => {
  //   activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  // };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          if (selection.isCollapsed()) {
            $wrapNodes(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection.insertRawText(textContent);
          }
        }
      });
    }
  };
  const onUploadImageClick = () => {
    const uploadInput = document.getElementById('yseditor-imageInput');
    if (uploadInput) {
      uploadInput.click();
    }
  };
  const onUploadVideoClick = () => {
    editor.update(() => {
      // const selection = $getSelection();
      // if (!$isRangeSelection(selection)) {
      //   return false;
      // }
      const uploadInput = document.getElementById('yseditor-videoInput');
      if (uploadInput) {
        uploadInput.click();
      }
    });
  };
  const onUploadAttachmentClick = () => {
    editor.update(() => {
      // const selection = $getSelection();
      // if (!$isRangeSelection(selection)) {
      //   return false;
      // }
      const uploadInput = document.getElementById('yseditor-attachmentInput');
      if (uploadInput) {
        uploadInput.click();
      }
    });
  };

  return (
    <DropDown
      buttonClassName="toolbar-item spaced"
      buttonLabel={locale.insert}
      buttonAriaLabel="Insert specialized editor node"
      buttonIconClassName="iconfont icon-plus">
      <DropDownItem
        // onClick={() => {
        //   showModal('Insert Image', (onClose) => (
        //     <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
        //   ));
        // }}
        onClick={onUploadImageClick}
        className="item">
        <i className="iconfont icon-file-image1" />
        <span className="text">{locale.image}</span>
      </DropDownItem>

      <DropDownItem onClick={onUploadVideoClick} className="item">
        <i className="iconfont icon-file-video1" />
        <span className="text">{locale.video}</span>
      </DropDownItem>
      <DropDownItem onClick={onUploadAttachmentClick} className="item">
        <i className="iconfont icon-fujian" />
        <span className="text">{locale.attachment}</span>
      </DropDownItem>
      {/* <DropDownItem
        onClick={() =>
          insertGifOnClick({
            altText: 'Cat typing on a laptop',
            src: catTypingGif,
          })
        }
        className="item">
        <i className="icon gif" />
        <span className="text">{locale.gif}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          activeEditor.dispatchCommand(
            INSERT_EXCALIDRAW_COMMAND,
            undefined,
          );
        }}
        className="item">
        <i className="icon diagram-2" />
        <span className="text">{locale.excalidraw}</span>
      </DropDownItem> */}
      <DropDownItem
        onClick={() => {
          showModal(locale.insertTable, (onClose) => (
            <InsertTableDialog
              activeEditor={activeEditor}
              onClose={onClose}
              locale={locale}
            />
          ));
        }}
        className="item">
        <i className="iconfont icon-table" />
        <span className="text">{locale.table}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          showModal(locale.insertTableExperimental, (onClose) => (
            <InsertNewTableDialog
              activeEditor={activeEditor}
              onClose={onClose}
              locale={locale}
            />
          ));
        }}
        className="item">
        <i className="iconfont icon-table" />
        <span className="text">{locale.tableExperimental}</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'code')}
        onClick={formatCode}>
        <i className="iconfont icon-code" />
        <span className="text">{locale.blockTypeToBlockName.code}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          activeEditor.dispatchCommand(
            INSERT_HORIZONTAL_RULE_COMMAND,
            undefined,
          );
        }}
        className="item">
        <i className="iconfont icon-horizontal-rule" />
        <span className="text">{locale.horizontalRule}</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'quote')}
        onClick={formatQuote}>
        <i className="iconfont icon-chat-square-quote" />
        <span className="text">{locale.blockTypeToBlockName.quote}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
        }}
        className={
          'item ' + dropDownActiveClass(blockType === 'collapsible-container')
        }>
        <i className="iconfont icon-chat-square-quote" />
        <span className="text">
          {locale.blockTypeToBlockName.collapsibleContainer}
        </span>
      </DropDownItem>
      {/* <DropDownItem
        onClick={() => {
          showModal('Insert Poll', (onClose) => (
            <InsertPollDialog
              activeEditor={activeEditor}
              onClose={onClose}
            />
          ));
        }}
        className="item">
        <i className="icon poll" />
        <span className="text">{locale.poll}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          showModal('Insert Equation', (onClose) => (
            <InsertEquationDialog
              activeEditor={activeEditor}
              onClose={onClose}
            />
          ));
        }}
        className="item">
        <i className="icon equation" />
        <span className="text">{locale.equation}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.update(() => {
            const root = $getRoot();
            const stickyNode = $createStickyNode(0, 0);
            root.append(stickyNode);
          });
        }}
        className="item">
        <i className="icon sticky" />
        <span className="text">{locale.stickyNote}</span>
      </DropDownItem>
      {EmbedConfigs.map((embedConfig) => (
        <DropDownItem
          key={embedConfig.type}
          onClick={() => {
            activeEditor.dispatchCommand(
              INSERT_EMBED_COMMAND,
              embedConfig.type,
            );
          }}
          className="item">
          {embedConfig.icon}
          <span className="text">{embedConfig.contentName}</span>
        </DropDownItem>
      ))} */}
    </DropDown>
  );
}

export default function ToolbarPlugin(): JSX.Element {
  const locale = useLocale();
  const {blockTypeToBlockName} = locale;
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<BlockType>('paragraph');
  const blockTypeRef = useRef(blockType);
  blockTypeRef.current = blockType;
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );
  const [fontSize, setFontSize] = useState<string>(DEFAULT_FONT_SIZE);
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [fontFamily, setFontFamily] = useState<string>('默认字体');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  // const [isSubscript, setIsSubscript] = useState(false);
  // const [isSuperscript, setIsSuperscript] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [modal, showModal] = useModal();
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [formatType, setFormatType] = useState<ElementFormatType>('');
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const fontFamilyObject = useMemo(() => {
    const returned: Record<string, string> = {};
    FONT_FAMILY_OPTIONS.forEach(([option, text]) => {
      returned[option] = text;
    });
    return returned;
  }, []);
  const setFontFamilyByText = (text: string) => {
    const fontFamilyByText = fontFamilyObject[text];
    setFontFamily(fontFamilyByText);
  };

  const fontSizeObject = useMemo(() => {
    const returned: Record<string, string> = {};
    FONT_SIZE_OPTIONS.forEach(([option, text]) => {
      returned[option] = text;
    });
    return returned;
  }, []);
  const setFontSizeByText = (text: string) => {
    const fontSizeByText = fontSizeObject[text] || DEFAULT_FONT_SIZE;
    setFontSize(fontSizeByText);
  };

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
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

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      // setIsSubscript(selection.hasFormat('subscript'));
      // setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));
      if (element?.getFormatType) {
        setFormatType(element.getFormatType());
      }

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
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
          if (type in blockTypeToBlockName) {
            setBlockType(type);
            // setBlockType(type as BlockType);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSizeByText(
        $getSelectionStyleValueForProperty(
          selection,
          'font-size',
          DEFAULT_FONT_SIZE,
        ),
      );
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
      setFontFamilyByText(
        $getSelectionStyleValueForProperty(selection, 'font-family', ''),
      );
    }
  }, [activeEditor]);

  const controlOrMeta = (metaKey: boolean, ctrlKey: boolean): boolean => {
    if (IS_APPLE) {
      return metaKey;
    }
    return ctrlKey;
  };

  const formatBulletList = () => {
    toggleBulletList(blockTypeRef.current, editor);
  };

  const formatNumberedList = () => {
    toggleNumberedList(blockTypeRef.current, editor);
  };

  const formatCheckList = () => {
    toggleCheckList(blockTypeRef.current, editor);
  };

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // $selectAll(selection);
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle('');
            $getNearestBlockElementAncestorOrThrow(node).setFormat('');
          }
          if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [activeEditor, editor, updateToolbar]);

  useEffect(() => {
    // 注册自定义插件快捷键
    const handler = (e: KeyboardEvent) => {
      const {keyCode, metaKey, ctrlKey, altKey, shiftKey} = e;
      const ctrlOrMeta = controlOrMeta(metaKey, ctrlKey);
      if (keyCode === 85 && altKey && ctrlOrMeta) {
        e.preventDefault();
        formatBulletList();
      } else if (keyCode === 79 && altKey && ctrlOrMeta) {
        e.preventDefault();
        formatNumberedList();
      } else if (keyCode === 88 && altKey) {
        e.preventDefault();
        formatCheckList();
      } else if (keyCode === 83 && shiftKey && ctrlOrMeta) {
        e.preventDefault();
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
      } else if (keyCode === 220 && ctrlOrMeta) {
        e.preventDefault();
        clearFormatting();
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [activeEditor]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor],
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

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );
  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className="toolbar-container">
      <div className="toolbar">
        <button
          disabled={!canUndo || !isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          title={IS_APPLE ? `${locale.undo} (⌘Z)` : `${locale.undo} (Ctrl+Z)`}
          className="toolbar-item spaced"
          aria-label="Undo">
          <i className="iconfont icon-arrow-counterclockwise" />
        </button>
        <button
          disabled={!canRedo || !isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          title={IS_APPLE ? `${locale.redo} (⌘Y)` : `${locale.redo} (Ctrl+Y)`}
          className="toolbar-item"
          aria-label="Redo">
          <i className="iconfont icon-arrow-clockwise" />
        </button>
        <button
          onClick={clearFormatting}
          title={
            IS_APPLE
              ? `${locale.clearFormatting} (⌘\\)`
              : `${locale.clearFormatting} (Ctrl+\\)`
          }
          className="toolbar-item"
          aria-label="Clear all text formatting">
          <i className="iconfont icon-trash" />
        </button>
        <Divider />
        {blockType === 'code' ? (
          <>
            <DropDown
              buttonClassName="toolbar-item code-language"
              buttonLabel={getLanguageFriendlyName(codeLanguage)}
              buttonAriaLabel="Select language">
              {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
                return (
                  <DropDownItem
                    className={`item ${dropDownActiveClass(
                      value === codeLanguage,
                    )}`}
                    onClick={() => onCodeLanguageSelect(value)}
                    key={value}>
                    <span className="text">{name}</span>
                  </DropDownItem>
                );
              })}
            </DropDown>
          </>
        ) : (
          <>
            <InsertDropDown
              locale={locale}
              blockType={blockType}
              editor={editor}
              showModal={showModal}
              isLink={isLink}
            />
            <Divider />
            {blockType in blockTypeToBlockName && activeEditor === editor && (
              <>
                <BlockFormatDropDown blockType={blockType} editor={editor} />
                <Divider />
              </>
            )}
            <FontDropDown
              style={'font-family'}
              value={fontFamily}
              editor={editor}
            />
            <FontDropDown
              style={'font-size'}
              value={fontSize}
              editor={editor}
            />
            <Divider />
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
              }}
              className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
              title={
                IS_APPLE ? `${locale.bold} (⌘B)` : `${locale.bold} (Ctrl+B)`
              }
              aria-label={`Format text as bold. Shortcut: ${
                IS_APPLE ? '⌘B' : 'Ctrl+B'
              }`}>
              <i className="iconfont icon-type-bold" />
            </button>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
              }}
              className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
              title={
                IS_APPLE ? `${locale.italic} (⌘I)` : `${locale.italic} (Ctrl+I)`
              }
              aria-label={`Format text as italics. Shortcut: ${
                IS_APPLE ? '⌘I' : 'Ctrl+I'
              }`}>
              <i className="iconfont icon-type-italic" />
            </button>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
              }}
              className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
              title={
                IS_APPLE
                  ? `${locale.underline} (⌘U)`
                  : `${locale.underline} (Ctrl+U)`
              }
              aria-label={`Format text to underlined. Shortcut: ${
                IS_APPLE ? '⌘U' : 'Ctrl+U'
              }`}>
              <i className="iconfont icon-type-underline" />
            </button>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  'strikethrough',
                );
              }}
              className={
                'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')
              }
              title={
                IS_APPLE
                  ? `${locale.strikethrough} (⌘⇧S)`
                  : `${locale.strikethrough} (Ctrl+Shift+S)`
              }
              aria-label={`Format text to strikethrough. Shortcut: ${
                IS_APPLE ? '⌘+⇧+S' : 'Ctrl+Shift+S'
              }`}>
              <i className="iconfont icon-type-strikethrough" />
            </button>
            {/* <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
            className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
            title={locale.insertCodeBlock}
            aria-label="Insert code block">
            <i className="format code" />
          </button> */}
            <button
              onClick={insertLink}
              className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
              aria-label="Insert link"
              title={locale.insertLink}>
              <i className="iconfont icon-link" />
            </button>
            <ColorPicker
              buttonClassName="toolbar-item color-picker"
              buttonAriaLabel="Formatting text color"
              buttonIconClassName="iconfont icon-font-color"
              color={fontColor}
              onChange={onFontColorSelect}
              title={locale.textColor}
            />
            <ColorPicker
              buttonClassName="toolbar-item color-picker"
              buttonAriaLabel="Formatting background color"
              buttonIconClassName="iconfont icon-bg-color"
              color={bgColor}
              onChange={onBgColorSelect}
              title={locale.bgColor}
            />
            {/* <DropDown
            buttonClassName="toolbar-item spaced"
            buttonLabel=""
            buttonAriaLabel="Formatting options for additional text styles"
            buttonIconClassName="icon dropdown-more">
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  'strikethrough',
                );
              }}
              className={'item ' + dropDownActiveClass(isStrikethrough)}
              title={locale.strikethrough}
              aria-label="Format text with a strikethrough">
              <i className="icon strikethrough" />
              <span className="text">{locale.strikethrough}</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
              }}
              className={'item ' + dropDownActiveClass(isSubscript)}
              title={locale.subscript}
              aria-label="Format text with a subscript">
              <i className="icon subscript" />
              <span className="text">{locale.subscript}</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  'superscript',
                );
              }}
              className={'item ' + dropDownActiveClass(isSuperscript)}
              title={locale.superscript}
              aria-label="Format text with a superscript">
              <i className="icon superscript" />
              <span className="text">{locale.superscript}</span>
            </DropDownItem>
            <DropDownItem
              onClick={clearFormatting}
              className="item"
              title={locale.clearFormatting}
              aria-label="Clear all text formatting">
              <i className="iconfont icon-trash" />
              <span className="text">{locale.clearFormatting}</span>
            </DropDownItem>
          </DropDown> */}
            <Divider />
            <button
              onClick={formatBulletList}
              className={
                'toolbar-item spaced ' +
                (blockType === 'bullet' ? 'active' : '')
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
                'toolbar-item spaced ' +
                (blockType === 'number' ? 'active' : '')
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
            <button
              onClick={formatCheckList}
              className={
                'toolbar-item spaced ' + (blockType === 'check' ? 'active' : '')
              }
              title={
                IS_APPLE
                  ? `${blockTypeToBlockName.check} (⌘+⌥+X)`
                  : `${blockTypeToBlockName.check} (Ctrl+Alt+X)`
              }
              aria-label={`Format text to bullet. Shortcut: ${
                IS_APPLE ? '⌘+⌥+X' : 'Ctrl+Alt+X'
              }`}>
              <i className="iconfont icon-square-check" />
            </button>
          </>
        )}
        <Divider />
        <DropDown
          // buttonLabel={locale.align}
          buttonIconClassName="iconfont icon-text-left"
          buttonClassName="toolbar-item spaced alignment"
          buttonAriaLabel="Formatting options for text alignment">
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
            }}
            className={`item ${dropDownActiveClass(
              formatType === 'left' || formatType === '',
            )}`}>
            <i className="iconfont icon-text-left" />
            <span className="text">{locale.leftAlign}</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
            }}
            className={`item ${dropDownActiveClass(formatType === 'center')}`}>
            <i className="iconfont icon-text-center" />
            <span className="text">{locale.centerAlign}</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
            }}
            className={`item ${dropDownActiveClass(formatType === 'right')}`}>
            <i className="iconfont icon-text-right" />
            <span className="text">{locale.rightAlign}</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
            }}
            className={`item ${dropDownActiveClass(formatType === 'justify')}`}>
            <i className="iconfont icon-justify" />
            <span className="text">{locale.justifyAlign}</span>
          </DropDownItem>
        </DropDown>
        <DropDown
          // buttonLabel={locale.indentation}
          buttonIconClassName="iconfont icon-indent"
          buttonClassName="toolbar-item spaced indentation"
          buttonAriaLabel="Formatting options for text indentation">
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
            }}
            className="item">
            <i
              className={'iconfont ' + (isRTL ? 'icon-outdent' : 'icon-indent')}
            />
            <span className="text">{locale.indent}</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
            }}
            className="item">
            <i
              className={'iconfont ' + (isRTL ? 'icon-indent' : 'icon-outdent')}
            />
            <span className="text">{locale.outdent}</span>
          </DropDownItem>
        </DropDown>
        <CommonFileUpload
          id="yseditor-imageInput"
          type={'image'}
          maxSize={10}
          activeEditor={activeEditor}
        />
        <CommonFileUpload
          id="yseditor-videoInput"
          type={'video'}
          maxSize={50}
          activeEditor={activeEditor}
        />
        <CommonFileUpload
          id="yseditor-attachmentInput"
          type={'attachment'}
          maxSize={50}
          activeEditor={activeEditor}
        />
        {modal}
      </div>
    </div>
  );
}
