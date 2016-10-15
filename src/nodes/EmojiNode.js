import React from 'react';

import Node from './Node';

const EmojiNode = props => {

  return <Node id={props.id}
               highlightStyle={props.highlightStyle}
               charIndex={props.charIndex}
               range={props.range}>
    {`${props.text[props.charIndex]}${props.text[props.charIndex + 1]}`}
  </Node>;
};

EmojiNode.propTypes = {
  highlightStyle: React.PropTypes.object,
  id: React.PropTypes.string,
  charIndex: React.PropTypes.number,
  range: React.PropTypes.object,
  text: React.PropTypes.string
};

export default EmojiNode;
