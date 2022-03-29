import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TextArea, TextAreaProps } from './text-area';

const LINES = 8;
const TEST_LABEL = 'TEST_LABEL';
const TEST_PLACEHOLDER = 'TEST_PLACEHOLDER';
const TEST_VALUE = 'TEST_VALUE';

// text box state is lifted, use this component to propagate changes
const MockTextArea = ({ lines, value, label, placeholder, readonly, onChange }: TextAreaProps) => {
  const [val, setVal] = useState(value ?? '');
  return (
    <TextArea
      lines={lines}
      value={val}
      label={label}
      placeholder={placeholder}
      readonly={readonly}
      onChange={(v: string) => {
        setVal(v);
        onChange?.(v);
      }}
    />
  );
};

describe('TextArea', () => {
  it('should render correctly with default props', () => {
    const { container } = render(<MockTextArea lines={LINES} />);
    const textArea = getTextArea(container);
    expect(textArea).toHaveAttribute('rows', `${LINES}`);
  });

  it('should render label', () => {
    const { container } = render(<MockTextArea lines={LINES} label={TEST_LABEL} />);
    const label = getTextAreaLabel(container);
    expect(label).toBeTruthy();
    expect(label).toBeInTheDocument();
  });

  it('should render placeholder', () => {
    const { container } = render(<MockTextArea lines={LINES} placeholder={TEST_PLACEHOLDER} />);
    const placeholder = screen.getByPlaceholderText(TEST_PLACEHOLDER);
    expect(placeholder).toBeInTheDocument();

    // type 'some text'
    const textArea = getTextArea(container);
    fireEvent.change(textArea, { target: { value: 'some text' } });
    expect(textArea).toHaveValue('some text');
    expect(textArea).not.toHaveValue(TEST_PLACEHOLDER);
  });

  it('should work nicely with placeholder when value is set', () => {
    const { container } = render(
      <MockTextArea lines={LINES} placeholder={TEST_PLACEHOLDER} value={TEST_VALUE} />
    );
    const textArea = getTextArea(container);
    expect(textArea).toHaveValue(TEST_VALUE);
    expect(textArea).not.toHaveValue(TEST_PLACEHOLDER);
  });

  it('should be immutable and show footer when readonly', () => {
    const { container } = render(<MockTextArea lines={LINES} value={TEST_VALUE} readonly={true} />);
    const textArea = getTextArea(container);
    expect(textArea).toHaveValue(TEST_VALUE);

    const readonlyFooter = getTextAreaFooter(container);
    expect(readonlyFooter).toBeTruthy();
  });

  it('should propagate state changes through onChange', () => {
    const mockOnChangeCallback = jest.fn();
    const callsRef = mockOnChangeCallback.mock.calls;
    const { container } = render(<MockTextArea lines={LINES} onChange={mockOnChangeCallback} />);
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
