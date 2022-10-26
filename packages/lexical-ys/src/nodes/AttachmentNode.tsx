/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  // DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  // LexicalEditor,
  LexicalNode,
  NodeKey,
  // SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import {DecoratorNode} from 'lexical';
import * as React from 'react';
import {Suspense} from 'react';

// import {useLocale} from '../context/LocaleContext';

const AttachmentComponent = React.lazy(
  // @ts-ignore
  () => import('./AttachmentComponent'),
);

export interface AttachmentPayload {
  key?: NodeKey;
  src: string;
  fileName: string;
  fileType: string;
  fileSize: number | string;
}

// function convertAttachmentElement(domNode: Node): null | DOMConversionOutput {
//   if (domNode instanceof HTMLImageElement) {
//     //??
//     //TODO:
//     const {alt: fileName, src} = domNode;
//     const node = $createAttachmentNode({ fileName, fileType, fileSize, src });
//     return {node};
//   }
//   return null;
// }

export type SerializedAttachmentNode = Spread<
  {
    src: string;
    fileName: string;
    fileType: string;
    fileSize: number | string;
    type: 'attachment';
    version: 1;
  },
  SerializedLexicalNode
>;

export class AttachmentNode extends DecoratorNode<JSX.Element> {
  // __src: string;
  // __altText: string;
  // __width: 'inherit' | number;
  // __height: 'inherit' | number;
  // __maxWidth: number;
  // __showCaption: boolean;
  // __caption: LexicalEditor;
  // // Captions cannot yet be used within editor cells
  // __captionsEnabled: boolean;
  __src: string;
  __fileName: string;
  __fileType: string;
  __fileSize: number | string;

  static getType(): string {
    return 'attachment';
  }

  static clone(node: AttachmentNode): AttachmentNode {
    return new AttachmentNode(
      node.__src,
      node.__fileName,
      node.__fileType,
      node.__fileSize,
    );
  }

  static importJSON(serializedNode: SerializedAttachmentNode): AttachmentNode {
    const {fileName, fileType, fileSize, src} = serializedNode;
    const node = $createAttachmentNode({
      fileName,
      fileSize,
      fileType,
      src,
    });
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('a');
    element.setAttribute('href', this.__src + `?download=${this.__fileName}`);
    //TODO:
    // element.innerText = this.__fileName || locale.attachment;
    element.innerText = this.__fileName || 'attachment';
    return {element};
  }

  static importDOM(): DOMConversionMap | null {
    //TODO
    return null;
    // return {
    //   a: (node: Node) => ({
    //     conversion: convertAttachmentElement,
    //     priority: 0,
    //   }),
    // };
  }

  constructor(
    src: string,
    fileName: string,
    fileType: string,
    fileSize: number | string,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__fileName = fileName;
    this.__fileType = fileType;
    this.__fileSize = fileSize;
    // this.__maxWidth = maxWidth;
    // this.__width = width || 'inherit';
    // this.__height = height || 'inherit';
  }

  exportJSON(): SerializedAttachmentNode {
    return {
      // height: this.__height === 'inherit' ? 0 : this.__height,
      // maxWidth: this.__maxWidth,
      // showCaption: this.__showCaption,
      src: this.getSrc(),
      type: 'attachment',
      version: 1,
      // width: this.__width === 'inherit' ? 0 : this.__width,
    };
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number,
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    //TODO:
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <AttachmentComponent
          src={this.__src}
          fileType={this.__fileType}
          fileName={this.__fileName}
          fileSize={this.__fileSize}
        />
      </Suspense>
    );
  }
}

export function $createAttachmentNode({
  src,
  fileType,
  fileName,
  fileSize,
}: AttachmentPayload): AttachmentNode {
  return new AttachmentNode(src, fileName, fileType, fileSize);
}

export function $isAttachmentNode(
  node: LexicalNode | null | undefined,
): node is AttachmentNode {
  return node instanceof AttachmentNode;
}
