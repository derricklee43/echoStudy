import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TextBox, TextBoxProps } from './text-box';

const TEST_LABEL = 'TEST_LABEL';
const TEST_PLACEHOLDER = 'TEST_PLACEHOLDER';
const TEST_VALUE = 'TEST_VALUE';

// text box state is lifted, use this component to propagate changes
const MockTextBox = ({ value, label, placeholder }: Partial<TextBoxProps>) => {
  const [val, setVal] = useState(value ?? '');
  return (
    <TextBox
      value={val}
      label={label}
      placeholder={placeholder}
      onChange={(v: string) => setVal(v)}
    />
  );
};

describe('TextBox', () => {
  it('should render correctly with default props', () => {
    const { container } = render(<MockTextBox />);
    const input = getTextBoxInput(container);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should render label', () => {
    const { container } = render(<MockTextBox label={TEST_LABEL} />);
    const label = getTextBoxLabel(container);
    expect(label).toBeTruthy();
    expect(label).toBeInTheDocument();
  });

  it('should render placeholder', () => {
    const { container } = render(<MockTextBox placeholder={TEST_PLACEHOLDER} />);
    const placeholder = screen.getByPlaceholderText(TEST_PLACEHOLDER);
    expect(placeholder).toBeInTheDocument();

    // type 'some text'
    const input = getTextBoxInput(container);
    fireEvent.change(input, { target: { value: 'some text' } });
    expect(input).toHaveValue('some text');
    expect(input).not.toHaveValue(TEST_PLACEHOLDER);
  });

  it('should work nicely with placeholder when initial text is set', () => {
    const { container } = render(<MockTextBox placeholder={TEST_PLACEHOLDER} value={TEST_VALUE} />);
    const input = getTextBoxInput(container);
    expect(input).toHaveValue(TEST_VALUE);
    expect(input).not.toHaveValue(TEST_PLACEHOLDER);
  });

  it('should change label to legend view when input is focused or non-empty', () => {
    const { container } = render(<MockTextBox label={TEST_LABEL} />);
    const input = getTextBoxInput(container);
    const label = getTextBoxLabel(container);

    const expectLabelIsLegend = () => expect(label).toHaveClass('as-legend');
    const expectLabelIsNotLegend = () => expect(label).not.toHaveClass('as-legend');

    // check when just focused then unfocus
    expectLabelIsNotLegend();
    input.focus();
    expectLabelIsLegend();
    input.blur();
    expectLabelIsNotLegend();

    // check when just non-empty then make empty again
    expectLabelIsNotLegend();
    fireEvent.change(input, { target: { value: 'some text' } });
    expectLabelIsLegend();
    fireEvent.change(input, { target: { value: '' } }); // make empty
    expectLabelIsNotLegend();

    // check when both focused and non-empty
    expectLabelIsNotLegend();
    input.focus();
    fireEvent.change(input, { target: { value: 'some text' } });
    expectLabelIsLegend();
  });

  function getTextBoxInput(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('c-text-box-input')[0] as HTMLElement;
  }

  function getTextBoxLabel(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('c-text-box-label')[0] as HTMLElement;
  }
});
