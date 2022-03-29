import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TextArea } from './text-area';

const LINES = 8;
const TEST_LABEL = 'TEST_LABEL';
const TEST_PLACEHOLDER = 'TEST_PLACEHOLDER';
const TEST_INITIAL_TEXT = 'TEST_INITIAL_TEXT';

describe('TextArea', () => {
  it('should render correctly with default props', () => {
    const { container } = render(<TextArea lines={LINES} />);
    const textArea = getTextArea(container);
    expect(textArea).toHaveAttribute('rows', `${LINES}`);
  });

  it('should render label', () => {
    const { container } = render(<TextArea lines={LINES} label={TEST_LABEL} />);
    const label = getTextAreaLabel(container);
    expect(label).toBeTruthy();
    expect(label).toBeInTheDocument();
  });

  it('should render placeholder', () => {
    const { container } = render(<TextArea lines={LINES} placeholder={TEST_PLACEHOLDER} />);
    const placeholder = screen.getByPlaceholderText(TEST_PLACEHOLDER);
    expect(placeholder).toBeInTheDocument();

    // type 'some text'
    const textArea = getTextArea(container);
    fireEvent.change(textArea, { target: { value: 'some text' } });
    expect(textArea).toHaveValue('some text');
    expect(textArea).not.toHaveValue(TEST_PLACEHOLDER);
  });

  it('should work nicely with placeholder when initial text is set', () => {
    const { container } = render(
      <TextArea lines={LINES} placeholder={TEST_PLACEHOLDER} initialText={TEST_INITIAL_TEXT} />
    );
    const textArea = getTextArea(container);
    expect(textArea).toHaveValue(TEST_INITIAL_TEXT);
    expect(textArea).not.toHaveValue(TEST_PLACEHOLDER);
  });

  it('should be immutable and show footer when readonly', () => {
    const { container } = render(
      <TextArea lines={LINES} initialText={TEST_INITIAL_TEXT} readonly={true} />
    );
    const textArea = getTextArea(container);
    expect(textArea).toHaveValue(TEST_INITIAL_TEXT);

    const readonlyFooter = getTextAreaFooter(container);
    expect(readonlyFooter).toBeTruthy();
  });

  it('should propagate state changes through onChange', () => {
    const mockOnChangeCallback = jest.fn();
    const callsRef = mockOnChangeCallback.mock.calls;
    const { container } = render(<TextArea lines={LINES} onChange={mockOnChangeCallback} />);
    expect(callsRef.length).toBe(0);

    // type 'some text'
    const textArea = getTextArea(container);
    fireEvent.change(textArea, { target: { value: 'some text' } });
    expect(callsRef.length).toBe(1);

    // check the first argument of the first call
    expect(callsRef[0][0]).toBe('some text');
  });

  function getTextArea(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('c-text-area')[0] as HTMLElement;
  }

  function getTextAreaLabel(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('c-text-area-label')[0] as HTMLElement;
  }

  function getTextAreaFooter(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('c-text-area-footer')[0] as HTMLElement;
  }
});
