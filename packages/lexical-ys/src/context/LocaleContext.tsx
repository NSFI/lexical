/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as React from 'react';
import {
  createContext,
  ReactNode,
  useContext,
} from 'react';

// TODO: 预留多语言支持
import DEFAULT_LOCALE from '../zh-CN';

const Context: React.Context<any> = createContext(DEFAULT_LOCALE);

export const LocaleContext = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {

  return <Context.Provider value={DEFAULT_LOCALE}>{children}</Context.Provider>
}

export const useLocale = () => {
  return useContext(Context);
};
