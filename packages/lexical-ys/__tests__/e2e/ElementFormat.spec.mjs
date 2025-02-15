/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {moveLeft} from '../keyboardShortcuts/index.mjs';
import {
  assertHTML,
  click,
  focusEditor,
  html,
  initialize,
  selectFromAlignDropdown,
  test,
} from '../utils/index.mjs';

test.describe('Element format', () => {
  test.beforeEach(({isCollab, isPlainText, page}) => {
    test.skip(isPlainText);
    initialize({isCollab, page});
  });

  test('Can indent/align paragraph when caret is within link', async ({
    page,
    isPlainText,
  }) => {
    await focusEditor(page);
    await page.keyboard.type('Hello https://lexical.io world');
    await moveLeft(page, 10);
    await selectFromAlignDropdown(page, '.indent');
    await selectFromAlignDropdown(page, '.indent');
    await selectFromAlignDropdown(page, '.center-align');

    await assertHTML(
      page,
      html`
        <p
          class="YsEditorTheme__paragraph YsEditorTheme__ltr"
          style="padding-inline-start: 40px; text-align: center;"
          dir="ltr">
          <span data-lexical-text="true">Hello</span>
          <a
            href="https://lexical.io"
            class="YsEditorTheme__link YsEditorTheme__ltr"
            dir="ltr">
            <span data-lexical-text="true">https://lexical.io</span>
          </a>
          <span data-lexical-text="true">world</span>
        </p>
      `,
      undefined,
      {
        ignoreClasses: false,
        ignoreInlineStyles: false,
      },
    );
  });

  test('Can center align an empty paragraph', async ({page, isPlainText}) => {
    await focusEditor(page);
    await click(page, '.alignment');
    await click(page, '.center-align');

    await assertHTML(
      page,
      html`
        <p class="YsEditorTheme__paragraph" style="text-align: center">
          <br />
        </p>
      `,
    );
  });
});
