import React from 'react';

import Node from './Node';

const UrlNode = props => {
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

UrlNode.propTypes = {
  highlightStyle: React.PropTypes.object,
  id: React.PropTypes.string,
  charIndex: React.PropTypes.number,
  range: React.PropTypes.object,
  url: React.PropTypes.string
};

export default UrlNode;
