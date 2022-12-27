/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  GridSelection,
  LexicalEditor,
  NodeKey,
  NodeSelection,
  RangeSelection,
} from 'lexical';

import './ImageNode.css';
import './AttachmentNode.css';

import {createFromIconfontCN} from '@ant-design/icons';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
// import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
// import {LexicalNestedComposer} from '@lexical/react/LexicalNestedComposer';
// import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {useLexicalNodeSelection} from '@lexical/react/useLexicalNodeSelection';
import {mergeRegister} from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import * as React from 'react';
import {Suspense, useCallback, useEffect, useRef, useState} from 'react';

import {useUploadStatus} from '../context/UploadContext';
import ProgressBox from '../ui/ProgressBox';
import {post} from './../utils/request';
import {$isAttachmentNode} from './AttachmentNode';

const fileIconMap = {
  excel: 'icon-file-excel',
  image: 'icon-file-image',
  key: 'icon-file-key',
  others: 'icon-file-unknown',
  pdf: 'icon-file-pdf',
  ppt: 'icon-file-ppt',
  radio: 'icon-file-mp3',
  txt: 'icon-file-txt',
  video: 'icon-file-video',
  word: 'icon-file-word',
  zip: 'icon-file-zip',
};
const queryGet = (url, name) => {
  if (!url) url = window.location.href;
  // eslint-disable-next-line
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
export const IconFont = createFromIconfontCN({
  scriptUrl: [
    'https://qiyukf.nosdn.127.net/huke/font_3726489_mdqowaa8u0s.js', // icon-javascript, icon-java, icon-shoppingcart (overrided)
  ],
});
export default function AttachmentComponent({
  src,
  fileName,
  fileType,
  fileSize,
  nodeKey,
  uploading,
}: {
  fileName: string;
  fileType: string;
  fileSize: number | string;
  nodeKey: NodeKey;
  src: string;
  uploading?: boolean;
}): JSX.Element {
  const attachmentRef = useRef<null | HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const {uploadStatus} = useUploadStatus();
  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isAttachmentNode(node)) {
          node.remove();
        }
        setSelected(false);
      }
      return false;
    },
    [isSelected, nodeKey, setSelected],
  );

  const onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection();
      const buttonElem = buttonRef.current;
      if (
        isSelected &&
        $isNodeSelection(latestSelection) &&
        latestSelection.getNodes().length === 1
      ) {
        if (buttonElem !== null && buttonElem !== document.activeElement) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [isSelected],
  );

  const onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (buttonRef.current === event.target) {
        $setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [editor, setSelected],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        setSelection(editorState.read(() => $getSelection()));
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;

          if (event.target === attachmentRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        onEscape,
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [
    clearSelection,
    editor,
    // isResizing,
    isSelected,
    nodeKey,
    onDelete,
    onEnter,
    onEscape,
    setSelected,
  ]);

  const draggable = isSelected && $isNodeSelection(selection);
  return (
    <Suspense fallback={null}>
      <>
        <div draggable={draggable}>
          {uploading ? (
            <ProgressBox percent={uploadStatus[src] || 0} />
          ) : (
            <div className="AttachmentNode__container">
              <div className="AttachmentNode__type">
                {/* <i className={`iconfont ${fileIconMap[fileType]}`} /> */}
                <IconFont
                  type={fileIconMap[fileType]}
                  style={{fontSize: '40px'}}
                />
              </div>
              <div className="AttachmentNode__info">
                <div className="AttachmentNode__title">{fileName}</div>
                <div className="AttachmentNode__size">{fileSize}</div>
              </div>
              <a
                href={`${src}?download=${encodeURIComponent(fileName)}`}
                onClick={() => {
                  window.location.pathname.replace(
                    /\/knowledge\/spacedetail\/([a-zA-Z0-9]*)\/knowdetail/,
                    (_match, capture) => {
                      console.log('capture', capture);
                      const docId = queryGet(window.location, 'docId');
                      post('/api/athena/doc/download', {
                        attathment: fileName,
                        docId,
                        spaceId: capture,
                      });
                    },
                  );
                }}
                ref={attachmentRef}
                target="_blank">
                <i
                  className="iconfont icon-download"
                  style={{color: '#37393D'}}
                />
              </a>
            </div>
          )}
        </div>
      </>
    </Suspense>
  );
}
