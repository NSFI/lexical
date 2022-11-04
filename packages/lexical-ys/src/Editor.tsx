/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {AutoScrollPlugin} from '@lexical/react/LexicalAutoScrollPlugin';
import {CharacterLimitPlugin} from '@lexical/react/LexicalCharacterLimitPlugin';
import {CheckListPlugin} from '@lexical/react/LexicalCheckListPlugin';
// import {ClearEditorPlugin} from '@lexical/react/LexicalClearEditorPlugin';
import {CollaborationPlugin} from '@lexical/react/LexicalCollaborationPlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {HashtagPlugin} from '@lexical/react/LexicalHashtagPlugin';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';

import {isDev} from './appSettings';
import {createWebsocketProvider} from './collaboration';
import {useSettings} from './context/SettingsContext';
import {useSharedHistoryContext} from './context/SharedHistoryContext';
import TableCellNodes from './nodes/TableCellNodes';
import ActionsPlugin from './plugins/ActionsPlugin';
import AttachmentPlugin from './plugins/AttachmentPlugin';
// import AutocompletePlugin from './plugins/AutocompletePlugin';
// import AutoEmbedPlugin from './plugins/AutoEmbedPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
// import CommentPlugin from './plugins/CommentPlugin';
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';
// import EquationsPlugin from './plugins/EquationsPlugin';
import ExamplePlugin from './plugins/ExamplePlugin';
// import ExcalidrawPlugin from './plugins/ExcalidrawPlugin';
// import FigmaPlugin from './plugins/FigmaPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import HorizontalRulePlugin from './plugins/HorizontalRulePlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin';
import {MaxLengthPlugin} from './plugins/MaxLengthPlugin';
// import MentionsPlugin from './plugins/MentionsPlugin';
// import PollPlugin from './plugins/PollPlugin';
// import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableOfContentsPlugin from './plugins/TableOfContentsPlugin';
import {TablePlugin as NewTablePlugin} from './plugins/TablePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import VideoPlugin from './plugins/VideoPlugin';
// import TwitterPlugin from './plugins/TwitterPlugin';
// import YouTubePlugin from './plugins/YouTubePlugin';
import YsEditorTheme from './themes/YsEditorTheme';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';

const skipCollaborationInit =
  // @ts-ignore
  window.parent != null && window.parent.frames.right === window;

interface EditorProps {
  initValue?: any;
  tocHeight?: string;
  isEditable?: boolean;
  title?: string;
}

export default function Editor(props: EditorProps): JSX.Element {
  const {
    initValue,
    title = '',
    tocHeight = 'calc(100vh - 200px)',
    isEditable = false,
  } = props;
  const {historyState} = useSharedHistoryContext();
  const [editor] = useLexicalComposerContext();
  const {
    settings: {
      isCollab,
      // isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      showTreeView,
    },
  } = useSettings();
  const text = isCollab ? (
    'Enter some collaborative rich text...'
  ) : isEditable ? (
    <div style={{left: '30px', position: 'relative'}}>输入“/”快速插入</div>
  ) : (
    <div style={{left: '30px', position: 'relative'}}>输入“/”快速插入</div>
  );
  const placeholder = <Placeholder>{text}</Placeholder>;
  const scrollRef = useRef(null);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const cellEditorConfig = {
    namespace: 'Playground',
    nodes: [...TableCellNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: YsEditorTheme,
  };

  useEffect(() => {
    try {
      if (initValue) {
        editor.setEditorState(
          editor.parseEditorState(JSON.stringify(initValue)),
        );
      }
    } catch (e) {
      console.error('初始化值报错', e);
    }
  }, [initValue]);
  useEffect(() => {
    editor.setEditable(isEditable);
  }, [isEditable]);
  return (
    <>
      {isEditable && <ToolbarPlugin />}
      <div
        className={`editor-container ${showTreeView ? 'tree-view' : ''} ${
          !isEditable ? 'plain-text' : ''
        }`}
        ref={scrollRef}>
        {isMaxLength && <MaxLengthPlugin maxLength={3000} />}
        <AutoFocusPlugin />
        {/* <ClearEditorPlugin /> */}
        <ComponentPickerPlugin />
        {/* <AutoEmbedPlugin /> */}
        {/* <MentionsPlugin /> */}
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        {/* <SpeechToTextPlugin /> */}
        <AutoLinkPlugin />
        <AutoScrollPlugin scrollRef={scrollRef} />
        {/* <CommentPlugin
          providerFactory={isCollab ? createWebsocketProvider : undefined}
        /> */}
        {isEditable ? (
          <>
            {isCollab ? (
              <CollaborationPlugin
                id="main"
                providerFactory={createWebsocketProvider}
                shouldBootstrap={!skipCollaborationInit}
              />
            ) : (
              <HistoryPlugin externalHistoryState={historyState} />
            )}
            <div className="toc" style={{height: tocHeight}}>
              <TableOfContentsPlugin title={title} />
            </div>
            <div className="editor-content">
              <RichTextPlugin
                contentEditable={
                  <div className="editor-scroller">
                    <div className="editor" ref={onRef}>
                      <ContentEditable />
                    </div>
                  </div>
                }
                placeholder={placeholder}
              />
            </div>
            <div style={{flex: 1, maxWidth: '180px'}} />

            <MarkdownShortcutPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <TablePlugin />
            <NewTablePlugin cellEditorConfig={cellEditorConfig}>
              <AutoFocusPlugin />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="TableNode__contentEditable" />
                }
                placeholder={''}
              />
              {/* <MentionsPlugin /> */}
              <HistoryPlugin />
              <ImagesPlugin />
              <VideoPlugin />
              <AttachmentPlugin />
              <LinkPlugin />
              <ClickableLinkPlugin />
              <FloatingTextFormatToolbarPlugin />
            </NewTablePlugin>
            <ImagesPlugin />
            <AttachmentPlugin />
            <VideoPlugin />
            <LinkPlugin />
            {/* <PollPlugin /> */}
            {/* <TwitterPlugin /> */}
            {/* <YouTubePlugin /> */}
            {/* <FigmaPlugin /> */}
            <ClickableLinkPlugin />
            <HorizontalRulePlugin />
            {/* <EquationsPlugin /> */}
            {/* <ExcalidrawPlugin /> */}
            <TabFocusPlugin />
            {floatingAnchorElem && (
              <>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
                <TableCellActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                />
              </>
            )}
          </>
        ) : (
          <>
            <div className="toc">
              <TableOfContentsPlugin />
            </div>
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </>
        )}
        {(isCharLimit || isCharLimitUtf8) && (
          <CharacterLimitPlugin charset={isCharLimit ? 'UTF-16' : 'UTF-8'} />
        )}
        {/* {isAutocomplete && <AutocompletePlugin />} */}
        {/* <div>{showTableOfContents && <TableOfContentsPlugin />}</div> */}

        {isDev && <ActionsPlugin isRichText={isEditable} />}
      </div>
      {isDev && showTreeView && <TreeViewPlugin />}
      {isDev && <ExamplePlugin />}
    </>
  );
}
