import React from 'react';

import Node, { NodeProps } from './Node';

export type UrlNodeType = {
  url: string;
} & NodeProps;

const UrlNode = (props: UrlNodeType) => {
  const style = {wordWrap: 'break-word'};

  return <Node id={props.id}
    highlightStyle={Object.assign({}, style, props.highlightStyle)}
    charIndex={props.charIndex}
    range={props.range}
    style={style}>
    <a data-position={(props.charIndex + props.url.length)}
      href={props.url}
      target="blank">
      {props.url}
    </a>
  </Node>;
};

export default UrlNode;
