/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export function getFileSuffix(fileName: string): {
  suffix: string;
  fileType: string;
} {
  /* 根据后缀判断文件类型 */
  let suffix = ''; // 后缀获取
  let result: string | undefined = ''; // 获取类型结果
  if (fileName) {
    const flieArr = fileName.split('.'); // 根据.分割数组
    suffix = flieArr[flieArr.length - 1]; // 取最后一个
  }
  if (!suffix) {
    return {fileType: '', suffix: ''};
  } // fileName无后缀返回false
  suffix = suffix.toLocaleLowerCase(); // 将后缀所有字母改为小写方便操作
  // 匹配图片
  //TODO:
  const imgList = ['png', 'jpg', 'jpeg', 'bmp', 'gif']; // 图片格式
  result = imgList.find((item) => item === suffix);
  if (result) {
    return {fileType: 'image', suffix: result};
  }
  // 匹配txt
  const txtList = ['txt'];
  result = txtList.find((item) => item === suffix);
  if (result) {
    return {fileType: 'txt', suffix: result};
  }
  // 匹配excel
  const excelList = ['xls', 'xlsx'];
  result = excelList.find((item) => item === suffix);
  if (result) {
    return {fileType: 'excel', suffix: result};
  }
  // 匹配word
  const wordList = ['doc', 'docx'];
  result = wordList.find((item) => item === suffix);
  if (result) {
    return {fileType: 'word', suffix: result};
  }
  // 匹配pdf
  const pdfList = ['pdf'];
  result = pdfList.find((item) => item === suffix);
  if (result) {
    return {fileType: 'pdf', suffix: result};
  }
  // 匹配ppt
  const pptList = ['ppt', 'pptx'];
  result = pptList.find((item) => item === suffix);
  if (result) {
    return {fileType: 'ppt', suffix: result};
  }
  // 匹配zip
  const zipList = ['rar', 'zip', '7z'];
  result = zipList.find((item) => item === suffix);
  if (result) {
    return {fileType: 'zip', suffix: result};
  }
  // 匹配视频
  const videoList = [
    'mp4',
    'm2v',
    'mkv',
    'rmvb',
    'wmv',
    'avi',
    'flv',
    'mov',
    'm4v',
  ];
  result = videoList.find((item) => item === suffix);
  if (result) {
    return {fileType: 'video', suffix: result};
  }
  // 匹配音频
  const radioList = ['mp3', 'wav', 'wmv'];
  result = radioList.find((item) => item === suffix);
  if (result) {
    return {fileType: 'radio', suffix: result};
  }
  // 其他文件类型
  return {fileType: 'others', suffix: suffix};
}

export function getFileSize(size: number): string {
  if (size >= 1024 * 1024 * 1024) {
    size = (size / 1024 / 1024 / 1024).toFixed(2) + 'GB';
  } else if (size >= 1024 * 1024) {
    size = (size / 1024 / 1024).toFixed(2) + 'MB';
  } else if (size >= 1024) {
    size = (size / 1024).toFixed(2) + 'KB';
  } else if (size < 1024) {
    size += 'bit';
  }
  return size;
}
