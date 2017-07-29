[![Build Status](https://travis-ci.org/ydeshayes/react-highlight.svg?branch=master)](https://travis-ci.org/ydeshayes/react-highlight)
# Highlight component for ReactJS

ReactJS component that help you highlight ranges of text and give you callbacks to detect user text selection.

## Installation

```
  npm install highlightable
```

## Features

* Pass ranges and the component will highlight the text for you
* Callback function that give you the start and end of the user highlited text
* Customisable renderRange function that allow you to add tooltip on the top of user selection for exemple
* Convert url string into link

## Getting started


```jsx
<Highlightable ranges={ranges}
               enabled={true}
               onTextHighlighted={onTextHighlightedCallback}
               id={uniqueId}
               onMouseOverHighlightedWord={onMouseOverHighlightedWordCallback}
               highlightStyle={{
                 backgroundColor: '#ffcc80'
               }}
               text={'text'}
/>
```
### Props:

* **ranges** -> array: of Range objects (see Range object below).

* **text** -> string: the all text that the user can highlight.

* **enabled** -> bool: The user can't highlight text if false.

* **onMouseOverHighlightedWord** -> func: Callback function when the user mouse is over an highlighted text.
`(range) => {}`

* **onTextHighlighted** -> func: Callback function when the user highlight new text.
`(range) => {}`

* **highlightStyle** -> obj: Style of the text when the text is highlighted.
* **style** -> obj: The style of the main div container

* **rangeRenderer** -> func: Use this function to customise the render of the highlighted text.
`(currentRenderedNodes, currentRenderedRange, currentRenderedIndex, onMouseOverHighlightedWord) => {return node}`

### Range object:

The range object attributes:
* **start** -> int: the index of the character where the range start.
* **end** -> int: the index of the character where the range stop.
* **text** -> string: the highlighted text.
* **data** -> object: extra data (the props of the highlight component)

## Development

* `npm run build` - produces production version
* `npm run dev` - produces development version
* `npm test` - run the tests
