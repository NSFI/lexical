/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './ContentEditable.css';

import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import * as React from 'react';

export default function LexicalContentEditable({
  className,
}: {
  className?: string;
}): JSX.Element {
  // 中文语境下不支持 spellcheck，默认关闭
  return (
    <ContentEditable
      className={className || 'ContentEditable__root'}
      spellCheck={false}
    />
  );
}
