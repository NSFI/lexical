/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {Cell, Row, Rows} from './TableNode';

export declare type Path = number[];
export type rangeType = [xStart: number, xEnd: number];
export interface tableRange {
  xRange: rangeType;
  yRange: rangeType;
}
/**
 * 源表格单元格是否在源表格中
 * @param originTable
 * @param target
 * @returns
 */

export function isContainPath(
  originTable: (number | number[])[][][],
  target: number[],
) {
  const [x, y] = target;
  for (const row of originTable) {
    for (const cell of row) {
      if (Array.isArray(cell[0]) && Array.isArray(cell[1])) {
        // 存在范围数据，单单元格
        const xRange = [cell[0][0], cell[1][0]];
        const yRange = [cell[0][1], cell[1][1]];
        if (
          x >= xRange[0] &&
          x <= xRange[1] &&
          y >= yRange[0] &&
          y <= yRange[1]
        )
          return true;
      } else if (cell[0] === x && cell[1] === y) {
        return true;
      }
    }
  }
  return false;
}
/**
 * 获取行开始原始表格中位置
 * @param originTable
 * @param rowIndex
 * @param colNum
 * @returns
 */
function getRowOriginPosition(
  originTable: (number | number[])[][][],
  rowIndex: number,
  colNum: number,
) {
  let index = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let colIndex = 0;
    while (colIndex < colNum) {
      const originCell = [rowIndex + index, colIndex];
      if (!isContainPath(originTable, originCell)) return originCell[0];
      colIndex++;
    }
    index++;
  }
}

export function getOriginTable(rawRows: Rows) {
  const originTable: (number | number[])[][][] = [];
  const colNum = rawRows[0].cells.reduce((num, cell) => {
    return num + cell.colSpan;
  }, 0);
  let rowIndex = 0; // 行序号

  rawRows.forEach((row: Row) => {
    const originRow: (number | number[])[][] = []; // 原始行数据
    rowIndex = getRowOriginPosition(originTable, rowIndex, colNum);
    let colOriginIndex = 0;
    row.cells.forEach((cell: Cell) => {
      const {rowSpan = 1, colSpan = 1} = cell;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const target = [rowIndex, colOriginIndex];
        if (!isContainPath(originTable, target)) break;
        colOriginIndex++;
      }

      if (rowSpan === 1 && colSpan === 1) {
        originRow.push([rowIndex, colOriginIndex]);
      } else {
        originRow.push([
          [rowIndex, colOriginIndex],
          [rowIndex + rowSpan - 1, colOriginIndex + colSpan - 1],
        ]);
      }
      colOriginIndex += colSpan;
    });
    originTable.push(originRow);
  });
  return originTable;
}

export function getSelection(startCoords: Path, endCoords: Path, rows: Rows) {
  const originTable = getOriginTable(rows);
  const originRange = getAllOriginRange(
    originTable,
    [startCoords[1], startCoords[0]],
    [endCoords[1], endCoords[0]],
  ) as tableRange;

  const realRealtivePaths = getRealRelativePaths(originTable, originRange);
  // const realPaths = getRealPaths(realRealtivePaths, tablePath);
  return realRealtivePaths;
}

/**
 * 得到选中内容中源表格的范围
 * @param originTable
 * @param startPath
 * @param endPath
 * @returns
 */
function getAllOriginRange(
  originTable: (number | number[])[][][],
  startPath: Path,
  endPath: Path,
) {
  // 单元格未合并数据
  const originStart = getOriginPath(originTable, startPath);
  const originEnd = getOriginPath(originTable, endPath);
  const newRange: number[][] = [];
  if (Array.isArray(originStart[0]) && Array.isArray(originStart[1])) {
    newRange.push(originStart[0], originStart[1]);
  } else {
    newRange.push(originStart as rangeType);
  }
  if (Array.isArray(originEnd[0]) && Array.isArray(originEnd[1])) {
    newRange.push(originEnd[0], originEnd[1]);
  } else {
    newRange.push(originEnd as rangeType);
  }

  const range = getRange(...(newRange as rangeType[]));
  return getOriginRange(originTable, range.xRange, range.yRange);
}

/**
 * 根据真实单元格位置获取源表格中数据/范围
 * @param originTable
 * @param real
 * @returns
 */
function getOriginPath(originTable: (number | number[])[][][], real: number[]) {
  return originTable[real[0]][real[1]];
}

/**
 * 获取rangs的范围数据
 * @param args
 * @returns
 */
export function getRange(...args: rangeType[]): tableRange {
  const xArr: number[] = [];
  const yArr: number[] = [];
  args.forEach((item) => {
    xArr.push(item[0]);
    yArr.push(item[1]);
  });
  return {
    xRange: [Math.min(...xArr), Math.max(...xArr)],
    yRange: [Math.min(...yArr), Math.max(...yArr)],
  };
}
/**
 * 根据源表格range获取真实相对paths
 * @param originTable
 * @param range
 */
function getRealRelativePaths(
  originTable: (number | number[])[][][],
  range: tableRange,
) {
  const realPaths: Path[] = [];
  const {xRange, yRange} = range;
  for (let x = xRange[0]; x <= xRange[1]; x++) {
    for (let y = yRange[0]; y <= yRange[1]; y++) {
      const path = getRealPathByPath(originTable, [x, y]);
      if (path && !isIncludePath(realPaths, path)) {
        realPaths.push(path);
      }
    }
  }
  return realPaths;
}

/**
 * 单个源表格 path 获取真实 path(对于slate的相对path)
 * @param originTable
 * @param path
 * @returns
 */
export function getRealPathByPath(
  originTable: (number | number[])[][][],
  path: Path,
) {
  const [x, y] = path;

  for (const [rowKey, row] of originTable.entries()) {
    for (const [cellKey, cell] of row.entries()) {
      if (Array.isArray(cell[0]) && Array.isArray(cell[1])) {
        // 是否在范围内
        const xRange = [cell[0][0], cell[1][0]];
        const yRange = [cell[0][1], cell[1][1]];
        if (
          x >= xRange[0] &&
          x <= xRange[1] &&
          y >= yRange[0] &&
          y <= yRange[1]
        ) {
          return [rowKey, cellKey];
        }
      } else if (cell[0] === x && cell[1] === y) {
        return [rowKey, cellKey];
      }
    }
  }

  return [-1, -1];
}

/**
 * 判断path是否存在在paths中
 * @param paths
 * @param path
 */
function isIncludePath(paths: Path[], path: Path) {
  for (const p of paths) {
    if (p[0] === path[0] && p[1] === path[1]) return true;
  }
  return false;
}

/**
 * 获取指定范围返回的range(解决合并扩大range)
 * @param originTable
 * @param xRange
 * @param yRange
 * @returns
 */
function getOriginRange(
  originTable: (number | number[])[][][],
  xRange: rangeType,
  yRange: rangeType,
): {xRange: number[]; yRange: number[]} {
  for (let x = xRange[0]; x <= xRange[1]; x++) {
    for (let y = yRange[0]; y <= yRange[1]; y++) {
      const path = [x, y];
      const rangePath = getRangeByOrigin(originTable, path);
      if (rangePath !== path) {
        // 返回范围数据
        const range = getRange(
          [xRange[0], yRange[0]],
          [xRange[1], yRange[1]],
          ...(rangePath as rangeType[]),
        );
        const isContain = isContainRange(range, {xRange, yRange});
        if (!isContain) {
          // 得到更大的范围
          return getOriginRange(originTable, range.xRange, range.yRange);
        }
      }
    }
  }
  return {
    xRange,
    yRange,
  };
}

/**
 * 根据源单元格path获取源表格中位置/范围
 * @param originTable
 * @param origin
 * @returns
 */
export function getRangeByOrigin(
  originTable: (number | number[])[][][],
  origin: number[],
) {
  const [x, y] = origin;
  for (const row of originTable) {
    for (const cell of row) {
      if (Array.isArray(cell[0]) && Array.isArray(cell[1])) {
        // 是否在范围内
        const xRange = [cell[0][0], cell[1][0]];
        const yRange = [cell[0][1], cell[1][1]];
        if (
          x >= xRange[0] &&
          x <= xRange[1] &&
          y >= yRange[0] &&
          y <= yRange[1]
        ) {
          return cell;
        }
      } else if (cell[0] === x && cell[1] === y) {
        return origin;
      }
    }
  }
  return [];
}

/**
 * 判断一个range(ancestor)是否包含另外一个range(range)
 * @param range
 * @param ancestor
 * @returns
 */
function isContainRange(range: tableRange, ancestor: tableRange) {
  if (
    range.xRange[0] >= ancestor.xRange[0] &&
    range.xRange[1] <= ancestor.xRange[1] &&
    range.yRange[0] >= ancestor.yRange[0] &&
    range.yRange[1] <= ancestor.yRange[1]
  )
    return true;
  return false;
}

export function getCellsSpan(rows: Rows, cellPaths: Path[]) {
  const originTable = getOriginTable(rows);
  // const tablePath = [0];
  const ranges: rangeType[] = [];

  cellPaths.forEach((cellRelative) => {
    // const cellRelative = Path.relative(cellPath, tablePath);
    const originRange = originTable[cellRelative[0]][cellRelative[1]];

    if (Array.isArray(originRange[0]) && Array.isArray(originRange[1])) {
      ranges.push(originRange[0] as rangeType, originRange[1] as rangeType);
    } else {
      ranges.push(originRange as rangeType);
    }
  });

  const {xRange, yRange} = getRange(...ranges);

  return {
    colSpan: yRange[1] - yRange[0] + 1,
    rowSpan: xRange[1] - xRange[0] + 1,
  };
}
