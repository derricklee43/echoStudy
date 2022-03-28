import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TextArea } from './text-area';

const LINES = 8;
const TEST_LABEL = 'TEST_LABEL';
const TEST_PLACEHOLDER = 'TEST_PLACEHOLDER';
const TEST_INITIAL_TEXT = 'TEST_INITIAL_TEXT';

describe('TextArea', () => {
  function getTextAreaElement(container: HTMLElement) {
    return container.getElementsByClassName('c-text-area')[0];
  }

  it('should render correctly with default props', () => {
    const { container } = render(<TextArea lines={LINES} />);
    expect(container.getElementsByClassName('c-text-area')[0]).toHaveAttribute('rows', `${LINES}`);
  });

  it('should render label', () => {
    const { container } = render(<TextArea lines={LINES} label={TEST_LABEL} />);
    expect(container.querySelector('.c-text-area-label')).toBeTruthy();

    // cannot use getByLabelText since label does not have a 'for' attribute
    const labelElement = screen.getByText(TEST_LABEL);
    expect(labelElement).toBeInTheDocument();
  });

  it('should render placeholder', () => {
    const { container } = render(<TextArea lines={LINES} placeholder={TEST_PLACEHOLDER} />);
    const placeholderElement = screen.getByPlaceholderText(TEST_PLACEHOLDER);
    expect(placeholderElement).toBeInTheDocument();

    // type 'some text'
    const textAreaElement = getTextAreaElement(container);
    fireEvent.change(textAreaElement, { target: { value: 'some text' } });
    expect(textAreaElement).toHaveTextContent('some text');
    expect(textAreaElement).not.toHaveTextContent(TEST_PLACEHOLDER);
  });

  it('should work nicely with placeholder when initial text is set', () => {
    const { container } = render(
      <TextArea lines={LINES} placeholder={TEST_PLACEHOLDER} initialText={TEST_INITIAL_TEXT} />
    );
    const textAreaElement = container.getElementsByClassName('c-text-area')[0];
    expect(textAreaElement).toHaveTextContent(TEST_INITIAL_TEXT);
    expect(textAreaElement).not.toHaveTextContent(TEST_PLACEHOLDER);
  });

  it('should be immutable and show footer when readonly', () => {
    const { container } = render(
      <TextArea lines={LINES} initialText={TEST_INITIAL_TEXT} readonly={true} />
    );
    const textAreaElement = container.getElementsByClassName('c-text-area')[0];
    expect(textAreaElement).toHaveTextContent(TEST_INITIAL_TEXT);
    expect(container.querySelector('.c-text-area-footer')).toBeTruthy();
  });

  it('should propagate state changes through onChange', () => {
    const mockOnChangeCallback = jest.fn();
    const callsRef = mockOnChangeCallback.mock.calls;
    const { container } = render(<TextArea lines={LINES} onChange={mockOnChangeCallback} />);
    expect(callsRef.length).toBe(0);

    // type 'some text'
    const textAreaElement = getTextAreaElement(container);
    fireEvent.change(textAreaElement, { target: { value: 'some text' } });
    expect(callsRef.length).toBe(1);

    // check the first argument of the first call
    expect(callsRef[0][0]).toBe('some text');
  });
});
