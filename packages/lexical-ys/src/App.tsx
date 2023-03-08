/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// import 'vite/modulepreload-polyfill';
// import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
// import {exportFile, importFile} from '@lexical/file';

import './index.css';
import './main.css';
import './mobile.css';
import 'antd/lib/message/style/index.css';

import {$generateHtmlFromNodes} from '@lexical/html';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import * as React from 'react';
import {useCallback} from 'react';

import {isDev} from './appSettings';
import {LocaleContext} from './context/LocaleContext';
import {SettingsContext, useSettings} from './context/SettingsContext';
import {SharedAutocompleteContext} from './context/SharedAutocompleteContext';
import {SharedHistoryContext} from './context/SharedHistoryContext';
import {UploadContext} from './context/UploadContext';
import Editor from './Editor';
import YsNodes from './nodes/YsNodes';
import PasteLogPlugin from './plugins/PasteLogPlugin';
import {TableContext} from './plugins/TablePlugin';
import TestRecorderPlugin from './plugins/TestRecorderPlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import Settings from './Settings';
import YsEditorTheme from './themes/YsEditorTheme';

interface YsEditorProps {
  onChange?: (jsonValue: any, htmlValue: string) => void;
  tocHeight?: React.CSSProperties;
  editorHeight: React.CSSProperties;
  initValue?: any;
  isEditable?: boolean;
  plainTocHeight?: React.CSSProperties;
  plainEditorHeight: React.CSSProperties;
  isMobile?: boolean;
  docAnchor?: string;
  spaceAnchor?: string;
}

const YsEditor = (props: YsEditorProps, ref): JSX.Element => {
  const {
    settings: {measureTypingPerf},
  } = useSettings();
  const {
    onChange,
    isMobile,
    spaceAnchor = '',
    docAnchor = '',
    ...otherProps
  } = props;

  const initialConfig = {
    editorState: undefined,
    namespace: 'YsEditor',
    nodes: [...YsNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: YsEditorTheme,
  };
  const handleEditorChange = useCallback((editorState, editor) => {
    editorState.read(() => {
      const jsonValue = editorState.toJSON();
      console.log('jsonValue', jsonValue);
      const htmlString = $generateHtmlFromNodes(editor, null);
      // eslint-disable-next-line no-unused-expressions
      onChange && onChange(jsonValue, htmlString);
    });
  }, []);

  const editorRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
    convertHTML: editorRef.current.convertHTML,
  }));

  return (
    <SettingsContext>
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <div className={`editor-shell ${isMobile ? 'h5' : ''}`}>
                <LocaleContext>
                  <UploadContext
                    spaceAnchor={spaceAnchor}
                    docAnchor={docAnchor}>
                    {/* TODO 能不能拿到editor和editorState */}
                    <Editor
                      isMobile={isMobile}
                      {...otherProps}
                      ref={editorRef}
                    />
                  </UploadContext>
                </LocaleContext>
              </div>
              <OnChangePlugin onChange={handleEditorChange} />
              {isDev ? <Settings /> : null}
              {isDev ? <PasteLogPlugin /> : null}
              {isDev ? <TestRecorderPlugin /> : null}
              {isDev && measureTypingPerf ? <TypingPerfPlugin /> : null}
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </SettingsContext>
  );
};

export default React.forwardRef(YsEditor);
