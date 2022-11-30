/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './setupEnv';
import './index.css';
import './main.css';

import * as React from 'react';
import {useState} from 'react';
import {createRoot} from 'react-dom/client';

import App from './App';

// Handle runtime errors
const showErrorOverlay = (err: Event) => {
  const ErrorOverlay = customElements.get('vite-error-overlay');
  if (!ErrorOverlay) {
    return;
  }
  const overlay = new ErrorOverlay(err);
  const body = document.body;
  if (body !== null) {
    body.appendChild(overlay);
  }
};

window.addEventListener('error', showErrorOverlay);
window.addEventListener('unhandledrejection', ({reason}) =>
  showErrorOverlay(reason),
);

const App1 = () => {
  const [value, setValue] = useState({
    root: {
      children: [
        {
          children: [],
          direction: null,
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          rows: [
            {
              cells: [
                {
                  colSpan: 2,
                  id: 'ygncu',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 2,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'fpicy',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
              ],
              height: null,
              id: 'masmi',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'kyhei',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'rvynr',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'razeg',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 2,
                  id: 'ctpqk',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'oioco',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'ostwn',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'yhqjl',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'fnmcs',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'pnpni',
            },
          ],
          type: 'tablesheet',
          version: 1,
        },
        {
          children: [],
          direction: null,
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });
  return (
    <>
      <button
        onClick={() => {
          setValue(null);
        }}>
        a
      </button>
      <App
        onChange={(jsonValue, htmlValue) => {
          // console.log('jsonValue', jsonValue,htmlValue);
        }}
        initValue={value}
        isEditable={true}
        title={'ddffd'}
        isMobile={false}
        // tocHeight={'1000px'}
      />
    </>
  );
};

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App1 />
  </React.StrictMode>,
);
