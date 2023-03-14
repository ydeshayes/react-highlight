import React from 'react';
import { HighlightStyle, HighlightStyleFunc } from '../Highlightable';
import Range from '../Range';

export interface NodeProps {
  range: Range;
  charIndex: number;
  highlightStyle?: HighlightStyle | HighlightStyleFunc;
  style?: Record<string, string>;
  id?: string;
  children?: JSX.Element | string;
};

const Node = (props: NodeProps) => {
  const getStyle = (range: Range) => range ? (typeof props.highlightStyle === 'function' ? props.highlightStyle(range, props.charIndex) : props.highlightStyle) : props.style;
  const getRangeKey = () => `${props.id}-${props.range.start}-${props.charIndex}`;
  const getNormalKey = () => `${props.id}-${props.charIndex}`;
  const getKey = (range: Range) => range ? getRangeKey() : getNormalKey();

  return (<span
    data-position={props.charIndex}
    key={getKey(props.range)}
    style={getStyle(props.range)}>
    {props.children}
  </span>);
};

export default Node;
