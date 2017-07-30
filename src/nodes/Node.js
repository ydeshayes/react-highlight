import React from 'react';

const Node = props => {
  const getStyle = range => range ? props.highlightStyle : props.style;
  const getRangeKey = () => `${props.id}-${props.range.start}-${props.charIndex}`;
  const getNormalKey = () => `${props.id}-${props.charIndex}`;
  const getKey = range => range ? getRangeKey() : getNormalKey();

  return (<span data-position={props.charIndex}
    key={getKey(props.range)}
    style={getStyle(props.range)}>
    {props.children}
  </span>);
};

Node.propTypes = {
  highlightStyle: React.PropTypes.object,
  style: React.PropTypes.object,
  id: React.PropTypes.string,
  charIndex: React.PropTypes.number,
  range: React.PropTypes.object,
  children: React.PropTypes.node
};

export default Node;
