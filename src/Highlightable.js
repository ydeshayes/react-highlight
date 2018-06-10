import emojiRegex from 'emoji-regex';
import { Component } from 'react';
import PropTypes from 'prop-types';
import EmojiNode from './nodes/EmojiNode';
import Node from './nodes/Node';
import Range from './Range';
import UrlNode from './nodes/UrlNode';
import { getUrl, debounce } from './helpers';

export default class Highlightable extends Component {
  constructor(props) {
    super(props);

    this.dismissMouseUp = 0;
  }

  shouldComponentUpdate(newProps) {
    return newProps.ranges.length !== this.props.ranges.length
      || newProps.text !== this.props.text
      || newProps.enabled !== this.props.enabled;
  }

  getRange(charIndex) {
    return this.props.ranges
      && this.props.ranges.find(range => charIndex >= range.start && charIndex <= range.end);
  }

  onMouseOverHighlightedWord(range, visible) {
    if (visible && this.props.onMouseOverHighlightedWord) {
      this.props.onMouseOverHighlightedWord(range);
    }
  }

  getLetterNode(charIndex, range) {
    return (<Node id={this.props.id}
      range={range}
      charIndex={charIndex}
      key={`${this.props.id}-${charIndex}`}
      highlightStyle={this.props.highlightStyle}>
      {this.props.text[charIndex]}
    </Node>);
  }

  getEmojiNode(charIndex, range) {
    return (<EmojiNode text={this.props.text}
      id={this.props.id}
      range={range}
      key={`${this.props.id}-emoji-${charIndex}`}
      charIndex={charIndex}
      highlightStyle={this.props.highlightStyle} />);
  }

  getUrlNode(charIndex, range, url) {
    return (<UrlNode url={url}
      id={this.props.id}
      range={range}
      key={`${this.props.id}-url-${charIndex}`}
      charIndex={charIndex}
      highlightStyle={this.props.highlightStyle} />);
  }

  mouseEvent() {
    if (!this.props.enabled) {
      return false;
    }

    let text = '';

    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== 'Control') {
      text = document.selection.createRange().text;
    }

    if (!text || !text.length) {
      return false;
    }

    const range = window.getSelection().getRangeAt(0);

    const startContainerPosition = parseInt(range.startContainer.parentNode.dataset.position);
    const endContainerPosition = parseInt(range.endContainer.parentNode.dataset.position);

    const startHL = startContainerPosition < endContainerPosition ? startContainerPosition : endContainerPosition;
    const endHL = startContainerPosition < endContainerPosition ? endContainerPosition : startContainerPosition;

    const rangeObj = new Range(startHL, endHL, text, Object.assign({}, this.props, { ranges: undefined }));

    this.props.onTextHighlighted(rangeObj);
  }

  onMouseUp(event) {
    debounce(() => {
      if (this.doucleckicked) {
        this.doucleckicked = false;
        this.dismissMouseUp++;
      } else if (this.dismissMouseUp > 0) {
        this.dismissMouseUp--;
      } else {
        this.mouseEvent.bind(this)();
      }
    }, 200).bind(this)();
  }

  onDoubleClick(event) {
    event.stopPropagation();

    this.doucleckicked = true;
    this.mouseEvent.bind(this)();
  }

  rangeRenderer(letterGroup, range, textCharIndex, onMouseOverHighlightedWord) {
    return this.props.rangeRenderer
      ? this.props.rangeRenderer(letterGroup, range, textCharIndex, onMouseOverHighlightedWord)
      : letterGroup;
  }

  getNode(i, range, text, url, isEmoji) {
    if (url.length) {
      return this.getUrlNode(i, range, url);
    } else if (isEmoji) {
      return this.getEmojiNode(i, range);
    }

    return this.getLetterNode(i, range);
  }

  getRanges() {
    const newText = [];
    let lastRange;

    // For all the characters on the text
    for (let textCharIndex = 0; textCharIndex < this.props.text.length; textCharIndex++) {
      const range = this.getRange(textCharIndex);
      const url = getUrl(textCharIndex, this.props.text);
      const isEmoji = emojiRegex().test(this.props.text[textCharIndex] + this.props.text[textCharIndex + 1]);
      // Get the current character node
      const node = this.getNode(textCharIndex, range, this.props.text, url, isEmoji);

      // If the next node is an url one, we fast forward to the end of it
      if (url.length) {
        textCharIndex += url.length - 1;
      } else if (isEmoji) {
        // Because an emoji is composed of 2 chars
        textCharIndex++;
      }

      if (!range) {
        newText.push(node);
        continue;
      }

      // If the char is in range
      lastRange = range;
      // We put the first range node on the array
      const letterGroup = [node];

      // For all the characters in the highlighted range
      let rangeCharIndex = textCharIndex + 1;

      for (; rangeCharIndex < parseInt(range.end) + 1; rangeCharIndex++) {
        const isEmoji = emojiRegex().test(`${this.props.text[rangeCharIndex]}${this.props.text[rangeCharIndex + 1]}`);

        if (isEmoji) {
          letterGroup.push(this.getEmojiNode(rangeCharIndex, range));
          // Because an emoji is composed of 2 chars
          rangeCharIndex++;
        } else {
          letterGroup.push(this.getLetterNode(rangeCharIndex, range));
        }

        textCharIndex = rangeCharIndex;
      }

      newText.push(this.rangeRenderer(letterGroup,
        range,
        textCharIndex,
        this.onMouseOverHighlightedWord.bind(this)));
    }

    if (lastRange) {
      // Callback function
      this.onMouseOverHighlightedWord(lastRange, true);
    }

    return newText;
  }

  render() {
    const newText = this.getRanges();

    return (
      <div style={this.props.style}
        
        onMouseUp={this.onMouseUp.bind(this)}
        onDoubleClick={this.onDoubleClick.bind(this)}>
        {newText}
      </div>
    );
  }
}

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
  highlightStyle: PropTypes.object,
  style: PropTypes.object,
  rangeRenderer: PropTypes.func
};
