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
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ContextShape = {
  setUploadStatus: (url: string, percent: number) => void;
  uploadStatus: Record<string, number>;
  docAnchor: string;
  spaceAnchor: string;
};

const Context: React.Context<ContextShape> = createContext({
  docAnchor: '',
  setUploadStatus: (url: string, percent: number) => {
    return;
  },
  spaceAnchor: '',
  uploadStatus: [],
});

export const UploadContext = ({
  docAnchor = '',
  spaceAnchor = '',
  children,
}: {
  docAnchor?: string;
  spaceAnchor?: string;
  children: ReactNode;
}): JSX.Element => {
  const [uploadStatus, setUploadStatusList] = useState({});

  const setUploadStatus = useCallback((url: string, percent: number) => {
    if (percent === undefined) {
      const newStatus: Record<string, number> = {...uploadStatus};
      delete newStatus[url];
      setUploadStatusList(newStatus);
    } else {
      setUploadStatusList({
        ...uploadStatus,
        [url]: percent,
      });
    }
  }, []);

  const contextValue = useMemo(() => {
    return {docAnchor, setUploadStatus, spaceAnchor, uploadStatus};
  }, [docAnchor, uploadStatus, setUploadStatus, spaceAnchor]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useUploadStatus = (): ContextShape => {
  return useContext(Context);
};
