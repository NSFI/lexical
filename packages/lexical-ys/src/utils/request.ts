/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export async function post(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    }, // body data type must match "Content-Type" header
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    // no-cors, *cors, same-origin
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export async function postFile(url = '', data: FormData) {
  const response = await fetch(url, {
    body: data,
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    // no-cors, *cors, same-origin
  });
  return response; // parses JSON response into native JavaScript objects
}
