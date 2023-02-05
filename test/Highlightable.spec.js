import sinon from 'sinon';
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Highlightable, { Range, Node } from '../src';

describe('Highlightable component', function () {
  describe('with basic props', function () {
    it('should render the text without highlight', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [];
      const text = 'test the text';

      const wrapper = mount(<Highlightable
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
           text={text}
        />);

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 0);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);

      wrapper.find('span').forEach((w, index) => {
        expect(w.props()['data-position']).to.equal(index);
        expect(w.props().style).to.equal(undefined);
        expect(w.props().children).to.equal(text[index]);
      });
    });
  });

  describe('with range props', function () {
    it('should render with highlighted text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new Range(0, 5)];
      const text = 'test the text';

      const wrapper = mount(<Highlightable
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

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);

      wrapper.find('span').forEach((w, index) => {
        if(index < 6) {
          expect(w.props()['data-position']).to.equal(index);
          expect(w.props().style.backgroundColor).to.equal('#ffcc80');
          expect(w.props().style.enabled).to.equal(true);
          expect(w.props().children).to.equal(text[index]);
        } else {
          expect(w.props()['data-position']).to.equal(index);
          expect(w.props().style).to.equal(undefined);
          expect(w.props().children).to.equal(text[index]);
        }
      });
    });
  });

  describe('testing update', function () {
    it('should highlight text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [];
      const text = 'test the text';

      const wrapper = mount(<Highlightable
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

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 0);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);

      wrapper.find('span').forEach((w, index) => {
        expect(w.props()['data-position']).to.equal(index);
        expect(w.props().style).to.equal(undefined);
        expect(w.props().children).to.equal(text[index]);
      });

      const newRange = [new Range(0, 5)];

      wrapper.setProps({ ranges: newRange });

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);

      wrapper.find('span').forEach((w, index) => {
        if(index < 6) {
          expect(w.props()['data-position']).to.equal(index);
          expect(w.props().style.backgroundColor).to.equal('#ffcc80');
          expect(w.props().style.enabled).to.equal(true);
          expect(w.props().children).to.equal(text[index]);
        } else {
          expect(w.props()['data-position']).to.equal(index);
          expect(w.props().style).to.equal(undefined);
          expect(w.props().children).to.equal(text[index]);
        }
      });
    });
  });

  describe('with smiley', function () {
    it('should highlight text and keep the smiley at the end of the text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [];
      const text = 'test the text 😘';

      const wrapper = mount(<Highlightable
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

      expect(wrapper.containsMatchingElement(<span>😘</span>)).to.equal(true);
    });

    it('should highlight text and keep the smiley at the end of the highlighted text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new Range(13, 14)];
      const text = 'test the text 😘';

      const wrapper = mount(<Highlightable
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

      expect(wrapper.containsMatchingElement(<span>😘</span>)).to.equal(true);

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
    });

    it('should highlight text and keep the smiley in the middle of the highlighted text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new Range(13, 18)];
      const text = 'test the text 😘 test again';

      const wrapper = mount(<Highlightable
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

      expect(wrapper.containsMatchingElement(<span>😘</span>)).to.equal(true);

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
    });
  });

  describe('with url', function () {
    it('should render with url', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [];
      const text = 'test http://www.google.fr';

      const wrapper = mount(<Highlightable
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

      expect(wrapper.containsMatchingElement(<a>http://www.google.fr</a>)).to.equal(true);
    });

    it('should render with highlighted url', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new Range(5, 7)];
      const text = 'test http://www.google.fr';

      const wrapper = mount(<Highlightable
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

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<a>http://www.google.fr</a>)).to.equal(true);
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

      const wrapper = mount(<Highlightable
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

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 0);
      expect(onTextHighlighted).to.have.property('callCount', 0);
      expect(nodeRenderer).to.have.property('callCount', 13);

      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);

      wrapper.find('span').forEach((w, index) => {
        expect(w.props()['data-position']).to.equal(index);
        expect(w.props().style).to.equal(undefined);
        expect(w.props().children).to.equal(text[index]);
      });
    });
  });
});
