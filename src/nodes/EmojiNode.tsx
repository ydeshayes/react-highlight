import React from 'react';

import Node, { NodeProps } from './Node';

export type EmojiNodeType = {
  text: string;
} & NodeProps;

const EmojiNode = (props: EmojiNodeType) => {

  return <Node id={props.id}
    highlightStyle={props.highlightStyle}
    charIndex={props.charIndex}
    range={props.range}>
    {`${props.text[props.charIndex]}${props.text[props.charIndex + 1]}`}
  </Node>;
};

export default EmojiNode;
