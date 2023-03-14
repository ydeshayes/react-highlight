import React, { FunctionComponent, ReactNode } from 'react';
import emojiRegex from 'emoji-regex';

import EmojiNode from './nodes/EmojiNode';
import Node from './nodes/Node';
import Range from './Range';
import UrlNode from './nodes/UrlNode';
import {getUrl, debounce} from './helpers';

export type CustomHTMLNode = {
  dataset: {
    position: string
  }
} & ParentNode;

export type HighlightStyle = Record<string, string>;
export type HighlightStyleFunc = ((range: Range, charIndex: number) => HighlightStyle);

export type OnMouseOverHighlightedWord = (range: Range) => void;
export type OnMouseOverHighlightedWordHandler = (range: Range, isVisible: boolean) => void;

export interface HighlightableProps {
    ranges: Range[],
    onMouseOverHighlightedWord: OnMouseOverHighlightedWord,
    id: string,
    highlightStyle?: HighlightStyle | HighlightStyleFunc,
    text: string,
    enabled: boolean,
    rangeRenderer?: (currentRenderedNodes: JSX.Element[], currentRenderedRange: Range, currentRenderedIndex: number, onMouseOverHighlightedWord: OnMouseOverHighlightedWordHandler) => JSX.Element,
    nodeRenderer?: (charIndex: number, range: Range, text: string, url: string, isEmoji: boolean) => JSX.Element,
    style: Record<string, string>,
    onTextHighlighted: (range: Range) => void
};

const Highlightable: FunctionComponent<HighlightableProps> = (
  {
    ranges,
    onMouseOverHighlightedWord,
    id,
    highlightStyle,
    text,
    enabled,
    rangeRenderer,
    nodeRenderer,
    style,
    onTextHighlighted
  }: HighlightableProps) => {
  let dismissMouseUp = 0;

  let doucleckicked = false;

  const getRange = (charIndex: number) => {
    return ranges
            && ranges.find(r => charIndex >= r.start && charIndex <= r.end);
  };

  const onMouseOverHighlightedWordHandler = (range: Range, visible: boolean): void => {
    if(visible && onMouseOverHighlightedWord) {
      onMouseOverHighlightedWord(range);
    }
  };

  const getLetterNode = (charIndex: number, range: Range) => {
    return (<Node id={id}
      range={range}
      charIndex={charIndex}
      key={`${id}-${charIndex}`}
      highlightStyle={highlightStyle}>
      {text[charIndex]}
    </Node>);
  };

  const getEmojiNode = (charIndex: number, range: Range) => {
    return (<EmojiNode text={text}
      id={id}
      range={range}
      key={`${id}-emoji-${charIndex}`}
      charIndex={charIndex}
      highlightStyle={highlightStyle} />);
  };

  const getUrlNode = (charIndex: number, range: Range, url: string) => {
    return (<UrlNode url={url}
      id={id}
      range={range}
      key={`${id}-url-${charIndex}`}
      charIndex={charIndex}
      highlightStyle={highlightStyle} />);
  };

  const mouseEvent = () => {
    if(!enabled) {
      return false;
    }

    let t = '';

    if (window.getSelection) {
      t = window.getSelection().toString();
    } else if (document.getSelection() && document.getSelection().type !== 'Control') {
      t = document.createRange().toString();
    }

    if(!t || !t.length) {
      return false;
    }

    const r = window.getSelection().getRangeAt(0);

    const startContainerPosition = parseInt((r.startContainer.parentNode as CustomHTMLNode).dataset.position);
    const endContainerPosition = parseInt((r.endContainer.parentNode as CustomHTMLNode).dataset.position);

    const startHL = startContainerPosition < endContainerPosition ? startContainerPosition : endContainerPosition;
    const endHL = startContainerPosition < endContainerPosition ? endContainerPosition : startContainerPosition;

    const rangeObj = new Range(startHL, endHL, text, {
      ranges: undefined,
      onMouseOverHighlightedWord,
      id,
      text,
      enabled,
      rangeRenderer,
      onTextHighlighted,
      style
    });

    onTextHighlighted(rangeObj);
  };

  const onMouseUp = () => {
    debounce(() => {
      if (doucleckicked) {
        doucleckicked = false;
        dismissMouseUp++;
      } else if(dismissMouseUp > 0) {
        dismissMouseUp--;
      } else {
        mouseEvent();
      }
    }, 200)();
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    doucleckicked = true;
    mouseEvent();
  };

  const rangeRendererDefault = (letterGroup: JSX.Element[], range: Range, textCharIndex: number, onMouseOverHighlightedWord: OnMouseOverHighlightedWordHandler) => {
    return rangeRenderer
      ? rangeRenderer(letterGroup, range, textCharIndex, onMouseOverHighlightedWord)
      : letterGroup;
  };

  // charIndex: number, range: Range, text: string, url: string, isEmoji: boolean
  const getNode = (i: number, r: Range, t: string, url: string, isEmoji: boolean): JSX.Element => {
    if(nodeRenderer) {
      return nodeRenderer(i, r, t, url, isEmoji);
    }
    
    if(url.length) {
      return getUrlNode(i, r, url);
    } else if(isEmoji) {
      return getEmojiNode(i, r);
    }

    return getLetterNode(i, r);
  };

  const getRanges = (): ReactNode => {
    const newText = [];

    let lastRange;

    // For all the characters on the text
    for(let textCharIndex = 0;textCharIndex < text.length;textCharIndex++) {
      const range = getRange(textCharIndex);
      const url = getUrl(textCharIndex, text);
      const isEmoji = emojiRegex().test(text[textCharIndex] + text[textCharIndex + 1]);
      // Get the current character node
      const node = getNode(textCharIndex, range, text, url, isEmoji);

      // If the next node is an url one, we fast forward to the end of it
      if(url.length) {
        textCharIndex += url.length - 1;
      } else if(isEmoji) {
        // Because an emoji is composed of 2 chars
        textCharIndex++;
      }

      if(!range) {
        newText.push(node);
        continue;
      }

      // If the char is in range
      lastRange = range;
      // We put the first range node on the array
      const letterGroup = [node];

      // For all the characters in the highlighted range
      let rangeCharIndex = textCharIndex + 1;

      for(;rangeCharIndex < range.end + 1;rangeCharIndex++) {
        const isEmoji = emojiRegex().test(`${text[rangeCharIndex]}${text[rangeCharIndex + 1]}`);

        
        if(isEmoji) {
          letterGroup.push(getEmojiNode(rangeCharIndex, range));
          // Because an emoji is composed of 2 chars
          rangeCharIndex++;
        } else {
          letterGroup.push(getNode(rangeCharIndex, range, text, url, isEmoji));
        }

        textCharIndex = rangeCharIndex;
      }

      newText.push(rangeRendererDefault(letterGroup,
        range,
        textCharIndex,
        onMouseOverHighlightedWordHandler));
    }

    if(lastRange) {
      // Callback function
      onMouseOverHighlightedWordHandler(lastRange, true);
    }

    return newText;
  };

  return (
    <div style={style}
      onMouseUp={onMouseUp}
      onDoubleClick={onDoubleClick}>
      {getRanges()}
    </div>
  );
};

export default Highlightable;
