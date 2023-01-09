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

import './VideoComponent.css';
import 'video.js/dist/video-js.css';
import 'video.js/dist/lang/zh-CN.js';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
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
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import videojs from 'video.js';

import {useUploadStatus} from '../context/UploadContext';
import ProgressBox from '../ui/ProgressBox';
import {$isVideoNode} from './VideoNode';

export default function VideoComponent({
  src,
  nodeKey,
  uploading,
}: {
  height: 'inherit' | number;
  nodeKey: NodeKey;
  src: string;
  uploading?: boolean;
}): JSX.Element {
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null);
  const {uploadStatus} = useUploadStatus();
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const [videoNode, setVideoNode] = useState<any>();
  const [player, setPlayer] = useState<any>();
  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isVideoNode(node)) {
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
      if (
        // activeEditorRef.current === caption ||
        buttonRef.current === event.target
      ) {
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

          if (isResizing) {
            return true;
          }
          if (event.target === videoRef.current) {
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
    isResizing,
    isSelected,
    nodeKey,
    onDelete,
    onEnter,
    onEscape,
    setSelected,
  ]);

  // rtmp播放
  useMemo(() => {
    if (videoNode) {
      const videoJsOptions = {
        autoplay: false,
        controls: true,
        // 自动加载
        errorDisplay: true,
        // 宽
        // height: 400,
        // 自动播放
        language: 'zh-CN',
        preload: 'auto',
        sources: [
          {
            src: src,
          },
        ],
        textTrackSettings: false,
      };
      const videoPlayer = videojs(videoNode, videoJsOptions);
      setPlayer(videoPlayer);
    }
  }, [videoNode]);
  useEffect(() => {
    return () => {
      if (player) player.dispose();
    };
  }, []);
  const draggable = isSelected && $isNodeSelection(selection);
  return (
    <Suspense fallback={null}>
      <>
        <div draggable={draggable}>
          {uploading ? (
            <ProgressBox percent={uploadStatus[src] || 0} />
          ) : (
            <video
              ref={(node) => {
                setVideoNode(node);
                videoRef.current = node;
              }}
              id="videoPlay"
              className="video-js vjs-default-skin vjs-big-play-centered vjs-fluid"
              width="100%"
              height="100%">
              <track kind="captions" />
              <p className="vjs-no-js">您的浏览器不支持HTML5，请升级浏览器。</p>
            </video>
          )}
        </div>
      </>
    </Suspense>
  );
}
