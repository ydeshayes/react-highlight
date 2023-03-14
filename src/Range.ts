import { HighlightableProps } from "./Highlightable";

export default class Range {
  start: number;
  end: number;
  text: string;
  data: HighlightableProps;
  
  constructor(start: number, end: number, text: string, data: HighlightableProps) {
    this.start = start;
    this.end = end;
    this.text = text;
    this.data = data;
  }
}
