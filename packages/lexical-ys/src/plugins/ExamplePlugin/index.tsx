/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
export default function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();
  // 当 Lexical 向 DOM 提交更新时收到通知。
  editor.registerUpdateListener(({ editorState }) => {
    // The latest EditorState can be found as `editorState`.
    // To read the contents of the EditorState, use the following API:

    // console.log(editorState);
    console.log(JSON.parse(JSON.stringify(editorState)));
    editorState.read(() => {
      // Just like editor.update(), .read() expects a closure where you can use
      // the $ prefixed helper functions.
    });
    // Then schedule another update.
    editor.update(() => {
      // ...
    });
  });
  // 当 Lexical 提交对 DOM 的更新并且编辑器的文本内容从编辑器的先前状态发生更改时收到通知
  editor.registerTextContentListener(
    (textContent) => {
      // The latest text content of the editor!
      // console.log(textContent);
    },
  );
  // 跟踪特定类型节点的生命周期
  // editor.registerMutationListener(
  //   MyCustomNode,
  //   (mutatedNodes) => {
  //     // mutatedNodes is a Map where each key is the NodeKey, and the value is the state of mutation.
  //     for (let [nodeKey, mutation] of mutatedNodes) {
  //       console.log(nodeKey, mutation)
  //     }
  //   },
  // );

  return null;
}
