/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'antd/lib/Progress/style/index.css';
import './ProgressBox.css';

import Progress from 'antd/lib/Progress';
import * as React from 'react';

export default function ProgressBox({
  percent,
}: Readonly<{
  percent: number;
}>): JSX.Element {
  return (
    <div className="YsEditor-ProgressBox">
      <Progress percent={percent} type="circle" width={60} />
    </div>
  );
}
