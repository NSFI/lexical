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
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'dfdfdfdfdfdfdfdfdfd',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
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
        {
          rows: [
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'ymbyt',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'qardi',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'wisdm',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'ercea',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'rzkem',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
              ],
              height: null,
              id: 'qkayn',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'retwe',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'numzg',
                  json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"fdfdfd","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'numub',
                  json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"fdfdfd","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'qthhn',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'ufj',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'zbqkl',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'wdxsr',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'rsggg',
                  json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"fdfdfd","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'vocvu',
                  json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"dfdfdf","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'ksmoa',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'bgbyc',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'chegc',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'mfxbs',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'cxgvz',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'gvxea',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'ccyzf',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'hhjoh',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'ndouz',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'gfclv',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'kcved',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'gngux',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'eeufb',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'byygg',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'myirr',
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
      direction: 'ltr',
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
        isEditable={false}
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
