/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type {LexicalEditor} from 'lexical';

import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {$createHeadingNode, HeadingTagType} from '@lexical/rich-text';
import {$wrapNodes} from '@lexical/selection';
import {
  $createParagraphNode,
  // $getRoot,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import * as React from 'react';

import {useLocale} from '../context/LocaleContext';
import DropDown, {DropDownItem} from '../ui/DropDown';

export type BlockType =
  | 'number'
  | 'bullet'
  | 'check'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'code'
  | 'paragraph'
  | 'quote';

function dropDownActiveClass(active: boolean) {
  if (active) return 'active dropdown-item-active';
  else return '';
}

export function toggleBulletList(current: string, editor: LexicalEditor) {
  if (current !== 'bullet') {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }
}

export function toggleNumberedList(current: string, editor: LexicalEditor) {
  if (current !== 'number') {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }
}

export function toggleCheckList(current: string, editor: LexicalEditor) {
  if (current !== 'check') {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }
}

export function BlockFormatDropDown({
  editor,
  blockType,
  toolbarItemCls = 'toolbar-item',
}: {
  blockType: BlockType;
  editor: LexicalEditor;
  toolbarItemCls?: string;
}): JSX.Element {
  const {blockTypeToBlockName} = useLocale();
  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };
  const formatBlockByName = (blockName: 'paragraph' | HeadingTagType) => {
    if (blockName === 'paragraph') {
      formatParagraph();
    } else {
      formatHeading(blockName);
    }
  };

  const blockNameList = ['paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const showType = blockNameList.includes(blockType) ? blockType : 'paragraph';

  return (
    <DropDown
      buttonClassName={`${toolbarItemCls} block-controls`}
      buttonIconClassName={'icon block-type ' + showType}
      buttonLabel={blockTypeToBlockName[showType]}
      buttonAriaLabel="Formatting options for text style">
      {blockNameList.map((blockName: any) => (
        <DropDownItem
          key={blockName}
          className={'item ' + dropDownActiveClass(blockType === blockName)}
          onClick={() => formatBlockByName(blockName)}>
          <i className={`icon ${blockName}`} />
          <span className="text">{blockTypeToBlockName[blockName]}</span>
        </DropDownItem>
      ))}
    </DropDown>
  );
}

export function Divider(): JSX.Element {
  return <div className="divider" />;
}
