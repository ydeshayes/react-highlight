export default class Range {
  constructor(start, end, text, data = {}) {
    this.start = start;
    this.end = end;
    this.text = text;
    this.data = data;
  }
}
