import React from 'react';
import sinon from 'sinon';
import { expect as expectChai } from 'chai';
import renderer from 'react-test-renderer';

import Highlightable, { Range, Node } from '../src';

describe('Highlightable component', function () {
  describe('with basic props', function () {
    it('should render the text without highlight', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [];
      const text = 'test the text';

      let component;
      renderer.act(() => {
        component = renderer.create(
          <Highlightable
                Range={range}
                enabled={true}
                onTextHighlighted={onTextHighlighted}
                name={'test'}
                onMouseOverHighlightedWord={onMouseOverHighlightedWord}
                rangeRenderer={(a, b) => b}
                highlightStyle={{
                  backgroundColor: '#ffcc80',
                  enabled: true
                }}
                text={text}
              />,
        )
      });
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();

      expectChai(onMouseOverHighlightedWord).to.have.property('callCount', 0);
      expectChai(onTextHighlighted).to.have.property('callCount', 0);
    });
  });
  
  describe('with range props', function () {
    it('should render with highlighted text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new Range(0, 5)];
      const text = 'test the text';

      let component;
      renderer.act(() => {
        component = renderer.create(
        <Highlightable
            ranges={range}
            enabled={true}
            onTextHighlighted={onTextHighlighted}
            name={'test'}
            onMouseOverHighlightedWord={onMouseOverHighlightedWord}
            rangeRenderer={a => a}
            highlightStyle={{
              backgroundColor: '#ffcc80',
              enabled: true
            }}
            text={text}
          />)
      });

      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();

      expectChai(onMouseOverHighlightedWord).to.have.property('callCount', 1);
      expectChai(onTextHighlighted).to.have.property('callCount', 0);
    });
  });

  describe('testing update', function () {
    it('should highlight text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [];
      const text = 'test the text';

      const component = renderer.create(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           name={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expectChai(onMouseOverHighlightedWord).to.have.property('callCount', 0);
      expectChai(onTextHighlighted).to.have.property('callCount', 0);

      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();

      const newRange = [new Range(0, 5)];
      renderer.act(() => {
        component.update(<Highlightable
          ranges={newRange}
          enabled={true}
          onTextHighlighted={onTextHighlighted}
          name={'test'}
          onMouseOverHighlightedWord={onMouseOverHighlightedWord}
          rangeRenderer={a => a}
          highlightStyle={{
            backgroundColor: '#ffcc80',
            enabled: true
          }}
          text={text}
       />);
      });

      tree = component.toJSON();
      expect(tree).toMatchSnapshot();

      expectChai(onMouseOverHighlightedWord).to.have.property('callCount', 1);
    });
  });

  describe('with smiley', function () {
    it('should highlight text and keep the smiley at the end of the text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [];
      const text = 'test the text 😘';

      const component = renderer.create(<Highlightable
        ranges={range}
        enabled={true}
        onTextHighlighted={onTextHighlighted}
        name={'test'}
        onMouseOverHighlightedWord={onMouseOverHighlightedWord}
        rangeRenderer={a => a}
        highlightStyle={{
          backgroundColor: '#ffcc80',
          enabled: true
        }}
        text={text}
     />);

     let tree = component.toJSON();
     expect(tree).toMatchSnapshot();
    });

    it('should highlight text and keep the smiley at the end of the highlighted text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new Range(13, 14)];
      const text = 'test the text 😘';

      const component = renderer.create(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           name={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();

      expectChai(onMouseOverHighlightedWord).to.have.property('callCount', 1);
    });

    it('should highlight text and keep the smiley in the middle of the highlighted text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new Range(13, 18)];
      const text = 'test the text 😘 test again';

      const component = renderer.create(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           name={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();

      expectChai(onMouseOverHighlightedWord).to.have.property('callCount', 1);
    });
  });

  describe('with url', function () {
    it('should render with url', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [];
      const text = 'test http://www.google.fr';

      const component = renderer.create(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           name={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render with highlighted url', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new Range(5, 7)];
      const text = 'test http://www.google.fr';

      const component = renderer.create(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           name={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);


      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
      
      expectChai(onMouseOverHighlightedWord).to.have.property('callCount', 1);
      expectChai(onTextHighlighted).to.have.property('callCount', 0);
    });
  });

  describe('with custom node', function() {
    it('should render the text wit custom node', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const nodeRenderer = sinon.spy((i, r, text) => {
        return <Node id="test"
        range={r}
        charIndex={i}
        key={`test-${i}`}>{text[i]}</Node>
      });
      const range = [];
      const text = 'test the text';

      const component = renderer.create(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           name={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={(a, b) => b}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           nodeRenderer={nodeRenderer}
           text={text}
        />);

      expectChai(onMouseOverHighlightedWord).to.have.property('callCount', 0);
      expectChai(onTextHighlighted).to.have.property('callCount', 0);
      expectChai(nodeRenderer).to.have.property('callCount', 13);

      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});