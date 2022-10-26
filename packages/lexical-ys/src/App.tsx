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

import {$createLinkNode} from '@lexical/link';
import {$createListItemNode, $createListNode} from '@lexical/list';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {$createHeadingNode, $createQuoteNode} from '@lexical/rich-text';
import {$createParagraphNode, $createTextNode, $getRoot} from 'lexical';
import * as React from 'react';

import {isDev} from './appSettings';
import {LocaleContext} from './context/LocaleContext';
import {SettingsContext, useSettings} from './context/SettingsContext';
import {SharedAutocompleteContext} from './context/SharedAutocompleteContext';
import {SharedHistoryContext} from './context/SharedHistoryContext';
import Editor from './Editor';
import YsNodes from './nodes/YsNodes';
import PasteLogPlugin from './plugins/PasteLogPlugin';
import {TableContext} from './plugins/TablePlugin';
import TestRecorderPlugin from './plugins/TestRecorderPlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import Settings from './Settings';
import YsEditorTheme from './themes/YsEditorTheme';
// import {
//   getActiveEditor
// } from 'lexical';

if (isDev) {
  console.warn(
    'If you are profiling the YsEditor app, please ensure you turn off the debug view. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.',
  );
}
function onChange(editorState) {
  // console.log('21323232,editorState', 21323232, editorState);
  // exportFile(editorState, {
  //           fileName: `Playground ${new Date().toISOString()}`,
  //           source: 'Playground',
  //         })
  editorState.read(() => {
    // Read the contents of the EditorState here.
    // const root = $getRoot();
    // const selection = $getSelection();
    // console.log(root);
  });
}
function prepopulatedRichText() {
  const root = $getRoot();
  // console.log('root', root);
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode('h1');
    heading.append($createTextNode('网易云商富文本编辑器——YsEditor'));
    root.append(heading);
    const quote = $createQuoteNode();
    quote.append(
      $createTextNode(
        `如果您想知道底部的黑框是什么——它是调试视图，显示编辑器的当前状态。` +
          `您可以通过按下屏幕左下角的设置控件并切换调试视图设置来禁用它。`,
      ),
    );
    root.append(quote);
    const paragraph = $createParagraphNode();
    paragraph.append(
      $createTextNode('YsEditor 是一个使用'),
      $createTextNode('@lexical/react').toggleFormat('code'),
      $createTextNode(
        '构建的编辑器。由于 @lexical/react 功能特性更新较快，因此 YsEditor 采用 fork 方式维护，在 fork 的基础上添加了 packages/lexical-ys 作为上层编辑器，便于快速合入新功能特性。',
      ),
    );
    root.append(paragraph);
    const paragraph2 = $createParagraphNode();
    paragraph2.append(
      $createTextNode('尝试输入一些'),
      $createTextNode('不同').toggleFormat('italic'),
      $createTextNode('格式的'),
      $createTextNode('文本').toggleFormat('bold'),
      $createTextNode('。'),
      $createTextNode(
        '确保检查工具栏中的各种插件。您也可以使用 #hashtags 或 @-mentions！',
      ),
    );
    root.append(paragraph2);
    const paragraph3 = $createParagraphNode();
    paragraph3.append(
      $createTextNode(
        `如果您想了解更多有关 Lexical 和 YsEditor 的信息，您可以：`,
      ),
    );
    root.append(paragraph3);
    const list = $createListNode('bullet');
    list.append(
      $createListItemNode().append(
        $createTextNode(`访问 `),
        $createLinkNode('https://lexical.dev/').append(
          $createTextNode('Lexical 网站'),
        ),
        $createTextNode(` 以获取文档和更多信息。`),
      ),
      $createListItemNode().append(
        $createTextNode(`查看我们 `),
        $createLinkNode('https://github.com/NSFI/lexical').append(
          $createTextNode('GitHub 存储库'),
        ),
        $createTextNode(` 中的代码。`),
      ),
      $createListItemNode().append(
        $createTextNode(`YsEditor 代码可以在 `),
        $createLinkNode(
          'https://github.com/NSFI/lexical/tree/main/packages/lexical-ys',
        ).append($createTextNode('这里')),
        $createTextNode(` 找到。`),
      ),
    );
    root.append(list);
    const paragraph4 = $createParagraphNode();
    paragraph4.append(
      $createTextNode(
        `最后，我们不断为这个 YsEditor 添加很酷的新功能。因此，请确保下次有机会时再回来查看:)。`,
      ),
    );
    root.append(paragraph4);
  }
}

const App = (): JSX.Element => {
  const {
    settings: {isCollab, emptyEditor, measureTypingPerf},
  } = useSettings();
  // const [editor] = useLexicalComposerContext();
  // console.log('editor1111', editor);
  const initialConfig = {
    editorState: isCollab
      ? null
      : emptyEditor
      ? undefined
      : prepopulatedRichText,
    namespace: 'YsEditor',
    nodes: [...YsNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: YsEditorTheme,
  };
  // console.log('getActiveEditor()', getActiveEditor())

  return (
    <div>
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <div className="editor-shell">
                <LocaleContext>
                  <Editor />
                </LocaleContext>
              </div>
              <OnChangePlugin onChange={onChange} />
              {isDev ? <Settings /> : null}
              {isDev ? <PasteLogPlugin /> : null}
              {isDev ? <TestRecorderPlugin /> : null}
              {isDev && measureTypingPerf ? <TypingPerfPlugin /> : null}
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </div>
  );
};

const YsApp = (): JSX.Element => {
  return (
    <SettingsContext>
      <App />
    </SettingsContext>
  );
};
export default YsApp;
