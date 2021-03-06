import emojiRegex from 'emoji-regex';
import React from 'react';
import PropTypes from 'prop-types';

import EmojiNode from './nodes/EmojiNode';
import Node from './nodes/Node';
import Range from './Range';
import UrlNode from './nodes/UrlNode';
import {getUrl, debounce} from './helpers';

const Highlightable = (
  {
    ranges,
    onMouseOverHighlightedWord,
    id,
    highlightStyle,
    text,
    enabled,
    rangeRenderer,
    style,
    onTextHighlighted
  }) => {
  let dismissMouseUp = 0;

  let doucleckicked = false;

  const getRange = charIndex => {
    return ranges
            && ranges.find(r => charIndex >= r.start && charIndex <= r.end);
  };

  const onMouseOverHighlightedWordHandler = (range, visible) => {
    if(visible && onMouseOverHighlightedWord) {
      onMouseOverHighlightedWord(range);
    }
  };

  const getLetterNode = (charIndex, range) => {
    return (<Node id={id}
      range={range}
      charIndex={charIndex}
      key={`${id}-${charIndex}`}
      highlightStyle={highlightStyle}>
      {text[charIndex]}
    </Node>);
  };

  const getEmojiNode = (charIndex, range) => {
    return (<EmojiNode text={text}
      id={id}
      range={range}
      key={`${id}-emoji-${charIndex}`}
      charIndex={charIndex}
      highlightStyle={highlightStyle} />);
  };

  const getUrlNode = (charIndex, range, url) => {
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
    } else if (document.selection && document.selection.type !== 'Control') {
      t = document.selection.createRange().text;
    }

    if(!t || !t.length) {
      return false;
    }

    const r = window.getSelection().getRangeAt(0);

    const startContainerPosition = parseInt(r.startContainer.parentNode.dataset.position);
    const endContainerPosition = parseInt(r.endContainer.parentNode.dataset.position);

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

  const onDoubleClick = e => {
    e.stopPropagation();

    doucleckicked = true;
    mouseEvent();
  };

  const rangeRendererDefault = (letterGroup, range, textCharIndex, onMouseOverHighlightedWord) => {
    return rangeRenderer
      ? rangeRenderer(letterGroup, range, textCharIndex, onMouseOverHighlightedWord)
      : letterGroup;
  };

  const getNode = (i, r, t, url, isEmoji) => {
    if(url.length) {
      return getUrlNode(i, r, url);
    } else if(isEmoji) {
      return getEmojiNode(i, r);
    }

    return getLetterNode(i, r);
  };

  const getRanges = () => {
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

      for(;rangeCharIndex < parseInt(range.end) + 1;rangeCharIndex++) {
        const isEmoji = emojiRegex().test(`${text[rangeCharIndex]}${text[rangeCharIndex + 1]}`);

        if(isEmoji) {
          letterGroup.push(getEmojiNode(rangeCharIndex, range));
          // Because an emoji is composed of 2 chars
          rangeCharIndex++;
        } else {
          letterGroup.push(getLetterNode(rangeCharIndex, range));
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

Highlightable.propTypes = {
  ranges: PropTypes.array,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  text: PropTypes.string,
  enabled: PropTypes.bool,
  onMouseOverHighlightedWord: PropTypes.func,
  onTextHighlighted: PropTypes.func,
  highlightStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),
  style: PropTypes.object,
  rangeRenderer: PropTypes.func
};

export default Highlightable;
