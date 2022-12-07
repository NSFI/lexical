/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import {DecoratorNode} from 'lexical';
import * as React from 'react';
import {Suspense} from 'react';

import {getOriginTable, Path} from './TableUtils';

export type Cell = {
  colSpan: number;
  rowSpan: number;
  json: string;
  type: 'normal' | 'header';
  id: string;
  width: number | null;
  // isEmpty: boolean;
};

export type Row = {
  cells: Array<Cell>;
  height: null | number;
  id: string;
};

export type Rows = Array<Row>;

export const cellHTMLCache: Map<string, string> = new Map();
export const cellTextContentCache: Map<string, string> = new Map();

const emptyEditorJSON =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const plainTextEditorJSON = (text: string) =>
  text === ''
    ? emptyEditorJSON
    : `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":${text},"type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;

const TableComponent = React.lazy(
  // @ts-ignore
  () => import('./TableComponent'),
);

export function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);
}

function createCell(
  type: 'normal' | 'header',
  options?: {
    colSpan?: number;
    rowSpan?: number;
    json?: any;
  },
): Cell {
  const {colSpan = 1, rowSpan = 1, json = emptyEditorJSON} = options || {};
  console.log('colSpan.rowSpan', colSpan, rowSpan);
  return {
    colSpan: colSpan,
    id: createUID(),
    json: json,
    rowSpan: rowSpan,
    type,
    width: null,
  };
}

export function createRow(): Row {
  return {
    cells: [],
    height: null,
    id: createUID(),
  };
}

export type SerializedTableNode = Spread<
  {
    rows: Rows;
    type: 'tablesheet';
    version: 1;
  },
  SerializedLexicalNode
>;

export function extractRowsFromHTML(tableElem: HTMLTableElement): Rows {
  const rowElems = tableElem.querySelectorAll('tr');
  const rows: Rows = [];
  for (let y = 0; y < rowElems.length; y++) {
    const rowElem = rowElems[y];
    const cellElems = rowElem.querySelectorAll('td,th');
    if (!cellElems || cellElems.length === 0) {
      continue;
    }
    const cells: Array<Cell> = [];
    for (let x = 0; x < cellElems.length; x++) {
      const cellElem = cellElems[x] as HTMLElement;
      const isHeader = cellElem.nodeName === 'TH';
      const cell = createCell(isHeader ? 'header' : 'normal');
      cell.json = plainTextEditorJSON(
        JSON.stringify(cellElem.innerText.replace(/\n/g, ' ')),
      );
      cells.push(cell);
    }
    const row = createRow();
    row.cells = cells;
    rows.push(row);
  }
  return rows;
}

function convertTableElement(domNode: HTMLElement): null | DOMConversionOutput {
  const rowElems = domNode.querySelectorAll('tr');
  if (!rowElems || rowElems.length === 0) {
    return null;
  }
  const rows: Rows = [];
  for (let y = 0; y < rowElems.length; y++) {
    const rowElem = rowElems[y];
    const cellElems = rowElem.querySelectorAll('td,th');
    if (!cellElems || cellElems.length === 0) {
      continue;
    }
    const cells: Array<Cell> = [];
    for (let x = 0; x < cellElems.length; x++) {
      const cellElem = cellElems[x] as HTMLElement;

      const isHeader = cellElem.nodeName === 'TH';
      const cell = createCell(isHeader ? 'header' : 'normal', {
        colSpan: parseInt(cellElem.getAttribute('colspan') || 1),
        rowSpan: parseInt(cellElem.getAttribute('rowspan') || 1),
      });
      cell.json = plainTextEditorJSON(
        JSON.stringify(cellElem.innerText.replace(/\n/g, ' ')),
      );
      cells.push(cell);
    }
    const row = createRow();
    row.cells = cells;
    rows.push(row);
  }
  return {node: $createTableNode(rows)};
}

export function exportTableCellsToHTML(
  rows: Rows,
  rect?: {startX: number; endX: number; startY: number; endY: number},
): HTMLElement {
  const table = document.createElement('table');
  const colGroup = document.createElement('colgroup');
  const tBody = document.createElement('tbody');
  const firstRow = rows[0];

  for (
    let x = rect != null ? rect.startX : 0;
    x < (rect != null ? rect.endX + 1 : firstRow.cells.length);
    x++
  ) {
    const col = document.createElement('col');
    colGroup.append(col);
  }

  for (
    let y = rect != null ? rect.startY : 0;
    y < (rect != null ? rect.endY + 1 : rows.length);
    y++
  ) {
    const row = rows[y];
    const cells = row.cells;
    const rowElem = document.createElement('tr');

    for (
      let x = rect != null ? rect.startX : 0;
      x < (rect != null ? rect.endX + 1 : cells.length);
      x++
    ) {
      const cell = cells[x];
      const cellElem = document.createElement(
        cell.type === 'header' ? 'th' : 'td',
      );
      cellElem.innerHTML = cellHTMLCache.get(cell.json) || '';
      rowElem.appendChild(cellElem);
    }
    tBody.appendChild(rowElem);
  }

  table.appendChild(colGroup);
  table.appendChild(tBody);
  return table;
}

export class TableNode extends DecoratorNode<JSX.Element> {
  __rows: Rows;

  static getType(): string {
    return 'tablesheet';
  }

  static clone(node: TableNode): TableNode {
    return new TableNode(Array.from(node.__rows), node.__key);
  }

  static importJSON(serializedNode: SerializedTableNode): TableNode {
    return $createTableNode(serializedNode.rows);
  }

  exportJSON(): SerializedTableNode {
    return {
      rows: this.__rows,
      type: 'tablesheet',
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      table: (_node: Node) => ({
        conversion: convertTableElement,
        priority: 2,
      }),
    };
  }

  exportDOM(): DOMExportOutput {
    return {element: exportTableCellsToHTML(this.__rows)};
  }

  constructor(rows?: Rows, key?: NodeKey) {
    super(key);
    this.__rows = rows || [];
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'contents';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  mergeRows(startX: number, startY: number, mergeRows: Rows): void {
    const self = this.getWritable();
    const rows = self.__rows;
    const endY = Math.min(rows.length, startY + mergeRows.length);
    for (let y = startY; y < endY; y++) {
      const row = rows[y];
      const mergeRow = mergeRows[y - startY];
      const cells = row.cells;
      const cellsClone = Array.from(cells);
      const rowClone = {...row, cells: cellsClone};
      const mergeCells = mergeRow.cells;
      const endX = Math.min(cells.length, startX + mergeCells.length);
      for (let x = startX; x < endX; x++) {
        const cell = cells[x];
        const mergeCell = mergeCells[x - startX];
        const cellClone = {...cell, json: mergeCell.json, type: mergeCell.type};
        cellsClone[x] = cellClone;
      }
      rows[y] = rowClone;
    }
  }

  updateCellJSON(x: number, y: number, json: string): void {
    const self = this.getWritable();
    const rows = self.__rows;
    const row = rows[y];
    const cells = row.cells;
    const cell = cells[x];
    const cellsClone = Array.from(cells);
    const cellClone = {...cell, json};
    const rowClone = {...row, cells: cellsClone};
    cellsClone[x] = cellClone;
    rows[y] = rowClone;
  }

  updateCellType(x: number, y: number, type: 'header' | 'normal'): void {
    const self = this.getWritable();
    const rows = self.__rows;
    const row = rows[y];
    const cells = row.cells;
    const cell = cells[x];
    const cellsClone = Array.from(cells);
    const cellClone = {...cell, type};
    const rowClone = {...row, cells: cellsClone};
    cellsClone[x] = cellClone;
    rows[y] = rowClone;
  }

  insertColumnAt(x: number): void {
    const self = this.getWritable();
    const rows = self.__rows;
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      const cells = row.cells;
      const cellsClone = Array.from(cells);
      const rowClone = {...row, cells: cellsClone};
      const type = (cells[x] || cells[x - 1])?.type || 'normal';
      cellsClone.splice(x, 0, createCell(type));
      rows[y] = rowClone;
    }
  }

  deleteColumnAt(x: number): void {
    console.log('1121212121', 1121212121);
    const self = this.getWritable();
    const rows = self.__rows;
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      const cells = row.cells;
      const cellsClone = Array.from(cells);
      const rowClone = {...row, cells: cellsClone};
      cellsClone.splice(x, 1);
      rows[y] = rowClone;
    }
  }

  addColumns(count: number): void {
    const self = this.getWritable();
    const rows = self.__rows;

    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      const cells = row.cells;
      const cellsClone = Array.from(cells);
      const rowClone = {...row, cells: cellsClone};
      const type = cells[cells.length - 1]?.type || 'normal';
      for (let x = 0; x < count; x++) {
        cellsClone.push(createCell(type));
      }
      rows[y] = rowClone;
    }
  }

  insertRowAt(y: number, cell: Cell, path: Path): void {
    const rowSpan = cell.rowSpan;
    console.log('cell2222', cell);
    console.log('y,rowSpan', y, rowSpan);
    console.log('path', path);
    const self = this.getWritable();
    const rows = self.__rows;
    const originTable = getOriginTable(rows);
    console.log('originTable', originTable);
    const prevRow = rows[y] || rows[y - 1];
    const cellCount = rows[0].cells.reduce((acc, row) => {
      return acc + row.colSpan || 1;
    }, 0);
    console.log('cellCount', cellCount);
    // return;
    const row = createRow();
    //向上

    for (let x = 0; x < cellCount; x++) {
      const cell1 = createCell(prevRow.cells[x]?.type || 'normal');
      row.cells.push(cell1);
    }
    rows.splice(y + rowSpan - 1, 0, row);
  }

  deleteRowAt(y: number): void {
    const self = this.getWritable();
    const rows = self.__rows;
    rows.splice(y, 1);
  }

  addRows(count: number): void {
    const self = this.getWritable();
    const rows = self.__rows;
    const prevRow = rows[rows.length - 1];
    const cellCount = prevRow.cells.length;

    for (let y = 0; y < count; y++) {
      const row = createRow();
      for (let x = 0; x < cellCount; x++) {
        const cell = createCell(prevRow.cells[x]?.type || 'normal');
        row.cells.push(cell);
      }
      rows.push(row);
    }
  }

  mergeCells(
    selectedCellIDs: string[],
    firstCellRect: [number, number],
    lastCellRect: [number, number],
    spans,
    cellPaths,
  ): void {
    const self = this.getWritable();
    console.log('spans', spans);
    console.log('cellPaths', cellPaths);
    const firstCell = cellPaths[0];
    const rows = self.__rows;
    function hasPath(path, cellPaths1) {
      return cellPaths1.some(
        (cellPath) => JSON.stringify(path) === JSON.stringify(cellPath),
      );
    }

    for (let x = 0; x < rows.length; x++) {
      const row = rows[x];
      const cells = row.cells;
      const cellsClone = Array.from(cells);
      const rowClone = {...row, cells: cellsClone};
      let reduceCount = 0;
      let rowFirstCell = undefined;
      let isFirst = false;
      for (let y = 0; y < cellsClone.length; y++) {
        // if (hasPath[x, y].includes(cellPaths)) {
        console.log('111111', hasPath([x, y], cellPaths));
        if (hasPath([x, y], cellPaths)) {
          reduceCount += 1;
          if (!rowFirstCell) {
            rowFirstCell = [x, y];
          }
        }
        if (JSON.stringify([x, y]) === JSON.stringify(firstCell)) {
          isFirst = true;
        }
      }
      console.log('rowFirstCell', rowFirstCell);
      console.log('reduceCount', reduceCount);
      if (isFirst) {
        console.log('1111z', spans);
        cellsClone.splice(
          firstCell[1],
          reduceCount,
          createCell(rowClone.cells[cellPaths[0][1]]?.type || 'normal', {
            colSpan: spans.colSpan,
            json: cellsClone[cellPaths[0][1]].json,
            rowSpan: spans.rowSpan,
          }),
        );
      } else {
        if (rowFirstCell) {
          cellsClone.splice(rowFirstCell[1], reduceCount);
        }
      }
      isFirst = false;
      console.log('rowClone', x, cellsClone);
      rows[x] = rowClone;
    }

    //   const colSpan = lastCellRect[0] - firstCellRect[0] + 1;
    //   const rowSpan = lastCellRect[1] - firstCellRect[1] + 1;
    //   const startX = firstCellRect[0];
    //   const startY = firstCellRect[1];
    //   const endX = lastCellRect[0];
    //   const endY = lastCellRect[1];
    //   console.log('startX', startX, startY, endX, endY, colSpan, rowSpan);
    //   for (let x = 0; x < rows.length; x++) {
    //     const row = rows[x];
    //     const cells = row.cells;
    //     const cellsClone = Array.from(cells);
    //     console.log('cellsClone', cellsClone);
    //     const rowClone = {...row, cells: cellsClone};
    //     if (startY === x) {
    //       if (colSpan > 1) {
    //         cellsClone.splice(
    //           startX,
    //           colSpan,
    //           createCell(rowClone.cells[startX].type, {
    //             colSpan,
    //             json: cellsClone[startX].json,
    //             rowSpan,
    //           }),
    //         );
    //         rows[x] = rowClone;
    //       } else if (rowSpan > 1) {
    //         cellsClone.splice(
    //           startX,
    //           1,
    //           createCell(rowClone.cells[startX].type, {
    //             colSpan,
    //             json: cellsClone[startX].json,
    //             rowSpan,
    //           }),
    //         );
    //         rows[x] = rowClone;
    //         rows[x] = rowClone;
    //       }
    //     } else if (x > startY && x <= endY) {
    //       if (rowSpan > 1) {
    //         cellsClone.splice(startX, colSpan);
    //       }

    //       rows[x] = rowClone;
    //     } else {
    //       rows[x] = rowClone;
    //     }
    //   }
  }

  updateColumnWidth(x: number, width: number): void {
    const self = this.getWritable();
    const rows = self.__rows;
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      const cells = row.cells;
      const cellsClone = Array.from(cells);
      const rowClone = {...row, cells: cellsClone};
      cellsClone[x].width = width;
      rows[y] = rowClone;
    }
  }

  decorate(_: LexicalEditor, config: EditorConfig): JSX.Element {
    return (
      <Suspense>
        <TableComponent
          nodeKey={this.__key}
          theme={config.theme}
          rows={this.__rows}
        />
      </Suspense>
    );
  }
}

export function $isTableNode(
  node: LexicalNode | null | undefined,
): node is TableNode {
  return node instanceof TableNode;
}

export function $createTableNode(rows: Rows): TableNode {
  return new TableNode(rows);
}

export function $createTableNodeWithDimensions(
  rowCount: number,
  columnCount: number,
  includeHeaders = true,
): TableNode {
  const rows: Rows = [];
  for (let y = 0; y < columnCount; y++) {
    const row: Row = createRow();
    rows.push(row);
    for (let x = 0; x < rowCount; x++) {
      row.cells.push(
        createCell(
          includeHeaders === true && (y === 0 || x === 0) ? 'header' : 'normal',
        ),
      );
    }
  }
  return new TableNode(rows);
}
