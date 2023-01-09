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
  const [value, setValue] = useState('');
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
