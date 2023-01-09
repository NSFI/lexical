/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {EditorThemeClasses} from 'lexical';

import './YsEditorTheme.css';

const theme: EditorThemeClasses = {
  blockCursor: 'YsEditorTheme__blockCursor',
  characterLimit: 'YsEditorTheme__characterLimit',
  code: 'YsEditorTheme__code',
  codeHighlight: {
    atrule: 'YsEditorTheme__tokenAttr',
    attr: 'YsEditorTheme__tokenAttr',
    boolean: 'YsEditorTheme__tokenProperty',
    builtin: 'YsEditorTheme__tokenSelector',
    cdata: 'YsEditorTheme__tokenComment',
    char: 'YsEditorTheme__tokenSelector',
    class: 'YsEditorTheme__tokenFunction',
    'class-name': 'YsEditorTheme__tokenFunction',
    comment: 'YsEditorTheme__tokenComment',
    constant: 'YsEditorTheme__tokenProperty',
    deleted: 'YsEditorTheme__tokenProperty',
    doctype: 'YsEditorTheme__tokenComment',
    entity: 'YsEditorTheme__tokenOperator',
    function: 'YsEditorTheme__tokenFunction',
    important: 'YsEditorTheme__tokenVariable',
    inserted: 'YsEditorTheme__tokenSelector',
    keyword: 'YsEditorTheme__tokenAttr',
    namespace: 'YsEditorTheme__tokenVariable',
    number: 'YsEditorTheme__tokenProperty',
    operator: 'YsEditorTheme__tokenOperator',
    prolog: 'YsEditorTheme__tokenComment',
    property: 'YsEditorTheme__tokenProperty',
    punctuation: 'YsEditorTheme__tokenPunctuation',
    regex: 'YsEditorTheme__tokenVariable',
    selector: 'YsEditorTheme__tokenSelector',
    string: 'YsEditorTheme__tokenSelector',
    symbol: 'YsEditorTheme__tokenProperty',
    tag: 'YsEditorTheme__tokenProperty',
    url: 'YsEditorTheme__tokenOperator',
    variable: 'YsEditorTheme__tokenVariable',
  },
  embedBlock: {
    base: 'YsEditorTheme__embedBlock',
    focus: 'YsEditorTheme__embedBlockFocus',
  },
  hashtag: 'YsEditorTheme__hashtag',
  heading: {
    h1: 'YsEditorTheme__h1',
    h2: 'YsEditorTheme__h2',
    h3: 'YsEditorTheme__h3',
    h4: 'YsEditorTheme__h4',
    h5: 'YsEditorTheme__h5',
    h6: 'YsEditorTheme__h6',
  },
  image: 'editor-image',
  link: 'YsEditorTheme__link',
  list: {
    listitem: 'YsEditorTheme__listItem',
    listitemChecked: 'YsEditorTheme__listItemChecked',
    listitemUnchecked: 'YsEditorTheme__listItemUnchecked',
    nested: {
      listitem: 'YsEditorTheme__nestedListItem',
    },
    olDepth: [
      'YsEditorTheme__ol1',
      'YsEditorTheme__ol2',
      'YsEditorTheme__ol3',
      'YsEditorTheme__ol4',
      'YsEditorTheme__ol5',
    ],
    ul: 'YsEditorTheme__ul',
  },
  ltr: 'YsEditorTheme__ltr',
  mark: 'YsEditorTheme__mark',
  markOverlap: 'YsEditorTheme__markOverlap',
  paragraph: 'YsEditorTheme__paragraph',
  quote: 'YsEditorTheme__quote',
  rtl: 'YsEditorTheme__rtl',
  table: 'YsEditorTheme__table',
  tableAddColumns: 'YsEditorTheme__tableAddColumns',
  tableAddRows: 'YsEditorTheme__tableAddRows',
  tableCell: 'YsEditorTheme__tableCell',
  tableCellActionButton: 'YsEditorTheme__tableCellActionButton',
  tableCellActionButtonContainer:
    'YsEditorTheme__tableCellActionButtonContainer',
  tableCellEditing: 'YsEditorTheme__tableCellEditing',
  tableCellHeader: 'YsEditorTheme__tableCellHeader',
  tableCellPrimarySelected: 'YsEditorTheme__tableCellPrimarySelected',
  tableCellResizer: 'YsEditorTheme__tableCellResizer',
  tableCellSelected: 'YsEditorTheme__tableCellSelected',
  tableCellSortedIndicator: 'YsEditorTheme__tableCellSortedIndicator',
  tableResizeRuler: 'YsEditorTheme__tableCellResizeRuler',
  tableSelected: 'YsEditorTheme__tableSelected',
  text: {
    bold: 'YsEditorTheme__textBold',
    code: 'YsEditorTheme__textCode',
    italic: 'YsEditorTheme__textItalic',
    strikethrough: 'YsEditorTheme__textStrikethrough',
    subscript: 'YsEditorTheme__textSubscript',
    superscript: 'YsEditorTheme__textSuperscript',
    underline: 'YsEditorTheme__textUnderline',
    underlineStrikethrough: 'YsEditorTheme__textUnderlineStrikethrough',
  },
};

export default theme;
