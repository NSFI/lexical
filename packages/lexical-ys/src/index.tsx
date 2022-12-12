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
                  colSpan: 1,
                  id: 'zcnoc',
                  json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"22aa s","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'ifaek',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'bpwnl',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: 103.7967529296875,
                },
                {
                  colSpan: 1,
                  id: 'ytlso',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'pftnv',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
              ],
              height: null,
              id: 'umgrp',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'amnmc',
                  json: '{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'qqvda',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'qatrl',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: 103.7967529296875,
                },
                {
                  colSpan: 1,
                  id: 'dlydj',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'fnjgq',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'iryey',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'ogdul',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'yfjfy',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'ntthl',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: 103.7967529296875,
                },
                {
                  colSpan: 1,
                  id: 'icaec',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'ozyxd',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'niung',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'zjquf',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'spvhq',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'zzxen',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: 103.7967529296875,
                },
                {
                  colSpan: 1,
                  id: 'bvekl',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'dajmo',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'coyps',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'fbhjr',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'uwmei',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'bwfui',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: 103.7967529296875,
                },
                {
                  colSpan: 1,
                  id: 'bppre',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'bkgsc',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  rowSpan: 1,
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'gqhiu',
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
