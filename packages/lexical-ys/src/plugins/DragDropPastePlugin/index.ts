/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {DRAG_DROP_PASTE} from '@lexical/rich-text';
import {isMimeType, mediaFileReader} from '@lexical/utils';
import {COMMAND_PRIORITY_LOW} from 'lexical';
import {useEffect} from 'react';

import {INSERT_ATTACHMENT_COMMAND} from '../AttachmentPlugin';
import {INSERT_IMAGE_COMMAND} from '../ImagesPlugin';
import {INSERT_VIDEO_COMMAND} from '../VideoPlugin';
import {beforeUploadFile, getFileSize, getFileSuffix} from './../../utils/file';

const ACCEPTABLE_IMAGE_TYPES = [
  'image/',
  'image/heic',
  'image/heif',
  'image/gif',
  'image/webp',
];
const ACCEPTABLE_VIDEO_TYPES = ['video/'];
const ACCEPTABLE_ATTACHMENT_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
  'text/plain',
  'text/html',
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'audio/mpeg',
  'audio/wma',
  'audio/ape',
  'audio/flac',
];

export default function DragDropPaste(): null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        (async () => {
          const filesResult = await mediaFileReader(
            files,
            [
              ...ACCEPTABLE_IMAGE_TYPES,
              ...ACCEPTABLE_VIDEO_TYPES,
              ...ACCEPTABLE_ATTACHMENT_TYPES,
            ].flatMap((x) => x),
          );
          for (const {file} of filesResult) {
            console.log('file', file, file.type);

            if (isMimeType(file, ACCEPTABLE_IMAGE_TYPES)) {
              const beforeData = await beforeUploadFile(file);
              const {nosSrc, bodyForm} = beforeData;
              editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                altText: file.name,
                bodyFormData: bodyForm,
                src: nosSrc,
              });
            } else if (isMimeType(file, ACCEPTABLE_VIDEO_TYPES)) {
              const beforeData = await beforeUploadFile(file);
              const {nosSrc, bodyForm} = beforeData;
              editor.dispatchCommand(INSERT_VIDEO_COMMAND, {
                bodyFormData: bodyForm,
                src: nosSrc,
              });
            } else if (isMimeType(file, ACCEPTABLE_ATTACHMENT_TYPES)) {
              //TODO: keynote type 不符合
              const beforeData = await beforeUploadFile(file);
              const {nosSrc, bodyForm} = beforeData;
              const fileSize = getFileSize(file.size);
              const {fileType} = getFileSuffix(file.name);
              editor.dispatchCommand(INSERT_ATTACHMENT_COMMAND, {
                bodyFormData: bodyForm,
                fileName: file.name,
                fileSize: fileSize,
                fileType: fileType,
                src: nosSrc,
              });
            }
          }
        })();
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);
  return null;
}
