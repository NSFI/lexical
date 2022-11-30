/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {INSERT_TABLE_COMMAND} from '@lexical/table';
import message from 'antd/lib/message';
import {
  $createNodeSelection,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  EditorThemeClasses,
  Klass,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
} from 'lexical';
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import * as React from 'react';
import invariant from 'shared/invariant';

import {$createTableNodeWithDimensions, TableNode} from '../nodes/TableNode';
import Button from '../ui/Button';
import {DialogActions} from '../ui/Dialog';
import TextInput from '../ui/TextInput';

export type InsertTableCommandPayload = Readonly<{
  columns: string;
  rows: string;
  includeHeaders?: boolean;
}>;

export type CellContextShape = {
  cellEditorConfig: null | CellEditorConfig;
  cellEditorPlugins: null | JSX.Element | Array<JSX.Element>;
  set: (
    cellEditorConfig: null | CellEditorConfig,
    cellEditorPlugins: null | JSX.Element | Array<JSX.Element>,
  ) => void;
};

export type CellEditorConfig = Readonly<{
  namespace: string;
  nodes?: ReadonlyArray<Klass<LexicalNode>>;
  onError: (error: Error, editor: LexicalEditor) => void;
  readOnly?: boolean;
  theme?: EditorThemeClasses;
}>;

export const INSERT_NEW_TABLE_COMMAND: LexicalCommand<InsertTableCommandPayload> =
  createCommand('INSERT_NEW_TABLE_COMMAND');

// @ts-ignore: not sure why TS doesn't like using null as the value?
export const CellContext: React.Context<CellContextShape> = createContext({
  cellEditorConfig: null,
  cellEditorPlugins: null,
  set: () => {
    // Empty
  },
});

export function TableContext({children}: {children: JSX.Element}) {
  const [contextValue, setContextValue] = useState<{
    cellEditorConfig: null | CellEditorConfig;
    cellEditorPlugins: null | JSX.Element | Array<JSX.Element>;
  }>({
    cellEditorConfig: null,
    cellEditorPlugins: null,
  });
  return (
    <CellContext.Provider
      value={useMemo(
        () => ({
          cellEditorConfig: contextValue.cellEditorConfig,
          cellEditorPlugins: contextValue.cellEditorPlugins,
          set: (cellEditorConfig, cellEditorPlugins) => {
            setContextValue({cellEditorConfig, cellEditorPlugins});
          },
        }),
        [contextValue.cellEditorConfig, contextValue.cellEditorPlugins],
      )}>
      {children}
    </CellContext.Provider>
  );
}

export function InsertTableDialog({
  activeEditor,
  onClose,
  locale,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
  locale: any;
}): JSX.Element {
  const [rows, setRows] = useState('5');
  const [columns, setColumns] = useState('5');
  const onClick = () => {
    if (Number.isNaN(parseInt(columns)) || Number.isNaN(parseInt(rows))) {
      return;
    }

    if (parseInt(rows) > 50 || parseInt(rows) < 1) {
      message.info('行数应为1-50之间的整数');
      return;
    }
    if (parseInt(columns) > 10 || parseInt(columns) < 1) {
      message.info('列数应为1-10之间的整数');
      return;
    }
    activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: parseInt(columns).toString(),
      rows: parseInt(rows).toString(),
    });
    onClose();
  };

  return (
    <>
      <TextInput label={locale.noofrows} onChange={setRows} value={rows} />
      <TextInput
        label={locale.noofcolumns}
        onChange={setColumns}
        value={columns}
      />
      <div
        className="ToolbarPlugin__dialogActions"
        data-test-id="table-model-confirm-insert">
        <Button onClick={onClick}>{locale.confirm}</Button>
      </div>
    </>
  );
}
export function InsertNewTableDialog({
  activeEditor,
  onClose,
  locale,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
  locale: any;
}): JSX.Element {
  const [rows, setRows] = useState('5');
  const [columns, setColumns] = useState('5');

  const onClick = () => {
    if (Number.isNaN(parseInt(columns)) || Number.isNaN(parseInt(rows))) {
      return;
    }

    if (parseInt(rows) > 50 || parseInt(rows) < 1) {
      message.info('行数应为1-50之间的整数');
      return;
    }
    if (parseInt(columns) > 10 || parseInt(columns) < 1) {
      message.info('列数应为1-10之间的整数');
      return;
    }
    activeEditor.dispatchCommand(INSERT_NEW_TABLE_COMMAND, {
      columns: parseInt(columns).toString(),
      rows: parseInt(rows).toString(),
    });
    onClose();
  };

  return (
    <>
      <TextInput label={locale.noofrows} onChange={setRows} value={rows} />
      <TextInput
        label={locale.noofcolumns}
        onChange={setColumns}
        value={columns}
      />
      <DialogActions data-test-id="table-model-confirm-insert">
        <Button onClick={onClick}>{locale.confirm}</Button>
      </DialogActions>
    </>
  );
}

export function TablePlugin({
  cellEditorConfig,
  children,
}: {
  cellEditorConfig: CellEditorConfig;
  children: JSX.Element | Array<JSX.Element>;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const cellContext = useContext(CellContext);

  useEffect(() => {
    if (!editor.hasNodes([TableNode])) {
      invariant(false, 'TablePlugin: TableNode is not registered on editor');
    }

    cellContext.set(cellEditorConfig, children);

    return editor.registerCommand<InsertTableCommandPayload>(
      INSERT_NEW_TABLE_COMMAND,
      ({columns, rows, includeHeaders}) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return true;
        }

        const focus = selection.focus;
        const focusNode = focus.getNode();

        if (focusNode !== null) {
          const tableNode = $createTableNodeWithDimensions(
            Number(rows),
            Number(columns),
            includeHeaders,
          );

          if ($isRootOrShadowRoot(focusNode)) {
            const target = focusNode.getChildAtIndex(focus.offset);

            if (target !== null) {
              target.insertBefore(tableNode);
            } else {
              focusNode.append(tableNode);
            }

            tableNode.insertBefore($createParagraphNode());
          } else {
            const topLevelNode = focusNode.getTopLevelElementOrThrow();
            topLevelNode.insertAfter(tableNode);
          }

          tableNode.insertAfter($createParagraphNode());
          const nodeSelection = $createNodeSelection();
          nodeSelection.add(tableNode.getKey());
          $setSelection(nodeSelection);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [cellContext, cellEditorConfig, children, editor]);

  return null;
}
