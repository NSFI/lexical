/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// ajax 辅助方法
import message from 'antd/lib/message';
import axios from 'axios';

// export async function post(url = '', data = {}) {
//   // Default options are marked with *
//   const response = await fetch(url, {
//     body: JSON.stringify(data),
//     headers: {
//       'Content-Type': 'application/json',
//     }, // body data type must match "Content-Type" header
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     mode: 'cors',
//     // no-cors, *cors, same-origin
//   });
//   return response.json(); // parses JSON response into native JavaScript objects
// }

// export async function postFile(url = '', data: FormData) {
//   const response = await fetch(url, {
//     body: data,
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     mode: 'cors',
//     // no-cors, *cors, same-origin
//   });
//   return response; // parses JSON response into native JavaScript objects
// }

/* eslint-disable func-names */

export interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

const createInstance = () => {
  const instance = axios.create({
    timeout: 20000,
    // withCredentials: true,
  });

  // 添加请求拦截器
  instance.interceptors.request.use(
    function (options) {
      return options;
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    },
  );

  // 添加响应拦截器
  instance.interceptors.response.use(
    function (response) {
      const {data = {}, status} = response;
      const config: any = response.config || {};

      // 接口重定向
      if (data.code === 302) {
        window.location.href = data.data;
        return null;
      }
      if (data.code !== 200) {
        if (config?.isUpload) {
          if (status === 200) {
            return {
              code: 200,
              data: true,
            };
          }
        }
        if (!config.hideToast) {
          message.error(data.message || '请求异常');
        }
        return Promise.reject(data);
      }
      return data;
    },
    function (error) {
      message.error(error.message || '您的网络发生异常，无法连接服务器');
      // 对响应错误做点什么
      return Promise.reject(error);
    },
  );

  const get = function <T>(
    url: string,
    data: Record<string, any> = {},
    options: Record<string, any> = {},
  ) {
    return instance.get<Record<string, any>, ResponseData<T>>(url, {
      params: data,
      ...options,
    });
  };

  const post = function <T>(
    url: string,
    data: Record<string, any> = {},
    options: Record<string, any> = {},
  ) {
    return instance.post<Record<string, any>, ResponseData<T>>(
      url,
      data,
      options,
    );
  };
  return {
    get,
    post,
  };
};

const {get: realGet, post: realPost} = createInstance();

export const get = function <T>(
  url: string,
  data: Record<string, any> = {},
  options: Record<string, any> = {},
) {
  return realGet<T>(url, data, {
    ...options,
  });
};

export const post = function <T>(
  url: string,
  data: Record<string, any> = {},
  options: Record<string, any> = {},
) {
  return realPost<T>(url, data, {
    ...options,
  });
};

export const postFile = function <T>(
  url: string,
  data: Record<string, any> = {},
  options: Record<string, any> = {},
) {
  return realPost<T>(url, data, {
    ...options,
    hideToast: true,
    isUpload: true,
  });
};
