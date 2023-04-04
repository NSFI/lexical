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
              text: 'fdsfdsffdfdfddffffffffffffffffffffffffffffffffffffffffffffffffffffdddd哒哒哒哒哒哒多多多多ddd 的的辅导辅导费',
              type: 'code-highlight',
              version: 1,
            },
            {
              type: 'linebreak',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'fffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdfffffffffffffffffffffffffffffffffffffffdv',
              type: 'code-highlight',
              version: 1,
            },
            {
              type: 'linebreak',
              version: 1,
            },
            {
              type: 'linebreak',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'fdfd​',
              type: 'code-highlight',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          language: 'javascript',
          type: 'code',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'fdfdfd',
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
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'fdfdfd',
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
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });

  const ref = React.useRef();

  const convertHTML = async () => {
    const html = await ref.current.convertHTML();
    console.log(html);
  };

  return (
    <>
      <button
        onClick={() => {
          setValue(null);
        }}>
        a
      </button>
      <button onClick={convertHTML}>convertHTML</button>
      <App
        onChange={(jsonValue, htmlValue) => {
          // console.log('jsonValue', jsonValue,htmlValue);
        }}
        ref={ref}
        initValue={value}
        isEditable={true}
        title={'ddffd'}
        isMobile={false}
        spaceAnchor={'dfdfdfd'}
        docAnchor={'33EDFDX'}
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
