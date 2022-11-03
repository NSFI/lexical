/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'antd/lib/Spin/style/index.css';
import './LoadingBox.css';

import Spin from 'antd/lib/Spin';
import * as React from 'react';

export default function LoadingBox(): JSX.Element {
  return (
    <div className="YsEditor-LoadingBox">
      <Spin />
    </div>
  );
}
