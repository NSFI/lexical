/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import {$applyNodeReplacement, DecoratorNode} from 'lexical';
import * as React from 'react';
import {Suspense} from 'react';

const VideoComponent = React.lazy(
  // @ts-ignore
  () => import('./VideoComponent'),
);

export interface VideoPayload {
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  src: string;
  width?: number;
  bodyFormData?: any;
  uploading?: boolean;
}

function convertVideoElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLVideoElement) {
    const {src} = domNode;
    const node = $createVideoNode({src});
    return {node};
  }
  return null;
}

export type SerializedVideoNode = Spread<
  {
    height?: number;
    maxWidth: number;
    src: string;
    width?: number;
    type: 'video';
    version: 1;
  },
  SerializedLexicalNode
>;

export class VideoNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
  __maxWidth: number;
  __bodyFormData?: any;
  __uploading?: boolean;

  static getType(): string {
    return 'video';
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(
      node.__src,
      node.__maxWidth,
      node.__width,
      node.__height,
      // node.__showCaption,
      // node.__caption,
      // node.__captionsEnabled,
      node.__key,
      node.__uploading,
    );
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    const {height, width, maxWidth, src} = serializedNode;
    const node = $createVideoNode({
      height,
      maxWidth,
      src,
      width,
    });
    return node;
  }

  exportDOM(): DOMExportOutput {
    if (this.__uploading) {
      const element = document.createElement('div');
      return {element};
    } else {
      const element = document.createElement('video');
      element.setAttribute('src', this.__src);
      element.setAttribute('controls', 'constrols');
      return {element};
    }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      video: (node: Node) => ({
        conversion: convertVideoElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    key?: NodeKey,
    uploading?: boolean,
  ) {
    super(key);
    this.__src = src;
    // this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__uploading = uploading;
    // this.__showCaption = showCaption || false;
    // this.__caption = caption || createEditor();
    // this.__captionsEnabled = captionsEnabled || captionsEnabled === undefined;
  }

  exportJSON(): SerializedVideoNode {
    return {
      // altText: this.getAltText(),
      // caption: this.__caption.toJSON(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      // showCaption: this.__showCaption,
      src: this.getSrc(),
      type: 'video',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width,
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

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('div');
    // const theme = config.theme;
    //TODO:
    // const className = theme.image;
    // if (className !== undefined) {
    //   span.className = className;
    // }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  // getAltText(): string {
  //   return this.__altText;
  // }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <VideoComponent
          src={this.__src}
          // altText={this.__altText}
          width={this.__width}
          height={this.__height}
          maxWidth={this.__maxWidth}
          nodeKey={this.getKey()}
          // showCaption={this.__showCaption}
          // caption={this.__caption}
          // captionsEnabled={this.__captionsEnabled}
          resizable={true}
          uploading={this.__uploading}
        />
      </Suspense>
    );
  }
}

export function $createVideoNode({
  height,
  maxWidth = 500,
  src,
  width,
  key,
  uploading,
}: VideoPayload): VideoNode {
  return $applyNodeReplacement(
    new VideoNode(src, maxWidth, width, height, key, uploading),
  );
}

export function $isVideoNode(
  node: LexicalNode | null | undefined,
): node is VideoNode {
  return node instanceof VideoNode;
}
