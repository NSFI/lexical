/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$wrapNodeInElement, mergeRegister} from '@lexical/utils';
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  LexicalCommand,
  LexicalEditor,
} from 'lexical';
import {useCallback, useEffect} from 'react';
import getSelection from 'shared/getDOMSelection';

import {useUploadStatus} from '../../context/UploadContext';
import {
  $createVideoNode,
  $isVideoNode,
  VideoNode,
  VideoPayload,
} from '../../nodes/VideoNode';
import {postFile} from './../../utils/request';

export type InsertVideoPayload = Readonly<VideoPayload>;

export const INSERT_VIDEO_COMMAND: LexicalCommand<InsertVideoPayload> =
  createCommand();
export default function VideoPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const {setUploadStatus} = useUploadStatus();

  const uploadFile = useCallback(async (payload) => {
    const nosLocation = 'https://urchin.nos-jd.163yun.com/';
    setUploadStatus(payload.src, 0);
    await postFile(nosLocation, payload.bodyFormData, {
      onUploadProgress: (progressEvent: ProgressEvent) => {
        if (progressEvent.lengthComputable || progressEvent.progress) {
          if (progressEvent.progress) {
            setUploadStatus(
              payload.src,
              parseInt(progressEvent.progress * 100),
            );
          } else {
            const complete =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            setUploadStatus(payload.src, complete);
          }
        }
      },
    });
  }, []);
  function insertNode(payload: InsertAttachmentPayload) {
    if (payload.uploading) {
      return insertNodeInline(payload);
    }
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    const focusNode = selection.focus.getNode();
    console.log('focusNode', focusNode);
    if (focusNode !== null) {
      const videoNode = $createVideoNode(payload);
      selection.insertParagraph();
      selection.focus
        .getNode()
        .getTopLevelElementOrThrow()
        .insertBefore(videoNode);
      return videoNode;
    }
    return false;
  }
  function insertNodeInline(payload: InsertVideoPayload) {
    const videoNode = $createVideoNode(payload);
    $insertNodes([videoNode]);
    if ($isRootOrShadowRoot(videoNode.getParentOrThrow())) {
      $wrapNodeInElement(videoNode, $createParagraphNode).selectEnd();
    }
    return videoNode;
  }
  useEffect(() => {
    if (!editor.hasNodes([VideoNode])) {
      throw new Error('VideoPlugin: VideoNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertVideoPayload>(
        INSERT_VIDEO_COMMAND,
        async (payload, newEditor) => {
          const videoNode = insertNode({
            src: payload.src,
            ...(payload.bodyFormData ? {uploading: true} : null),
          });
          if (!videoNode) {
            return true;
          }
          if (!payload.bodyFormData) {
            return true;
          }
          try {
            await uploadFile(payload);
            newEditor.update(() => {
              insertNode({src: payload.src});
              videoNode.remove();
            });
          } catch (e) {
            return true;
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          return onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          return onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor]);

  return null;
}

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const img = document.createElement('img');
img.src = TRANSPARENT_IMAGE;

function onDragStart(event: DragEvent): boolean {
  const node = getVideoNodeInSelection();
  if (!node) {
    return false;
  }
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return false;
  }
  dataTransfer.setData('text/plain', '_');
  dataTransfer.setDragImage(img, 0, 0);
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        // altText: node.__altText,
        // caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        // showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: 'video',
    }),
  );

  return true;
}

function onDragover(event: DragEvent): boolean {
  const node = getVideoNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

function onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = getVideoNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_VIDEO_COMMAND, data);
  }
  return true;
}

function getVideoNodeInSelection(): VideoNode | null {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isVideoNode(node) ? node : null;
}

function getDragImageData(event: DragEvent): null | InsertVideoPayload {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
  if (!dragData) {
    return null;
  }
  const {type, data} = JSON.parse(dragData);
  if (type !== 'video') {
    return null;
  }

  return data;
}

declare global {
  interface DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
  }
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target;
  return !!(
    target &&
    target instanceof HTMLElement &&
    !target.closest('code, span.editor-image') &&
    target.parentElement &&
    target.parentElement.closest('div.ContentEditable__root')
  );
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range;
  const domSelection = getSelection();
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }

  return range;
}
