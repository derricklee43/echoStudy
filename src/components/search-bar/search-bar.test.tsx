import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  TEST_OPTIONS_SINGLE,
  TEST_OPTIONS_SMALL,
  TEST_OPTIONS_SMALL_VALUES,
} from '@/components/drop-down-options/options.mock';
import { SearchBar } from './search-bar';

const TEST_PLACEHOLDER = 'TEST_PLACEHOLDER';
const TEST_INITIAL_TEXT = 'TEST_INITIAL_TEXT';

describe('SearchBar', () => {
  it('should render correctly with default props', () => {
    const { container } = render(<SearchBar />);
    const input = getSearchBarInput(container);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should render placeholder', () => {
    const { container } = render(<SearchBar placeholder={TEST_PLACEHOLDER} />);
    const placeholder = screen.getByPlaceholderText(TEST_PLACEHOLDER);
    expect(placeholder).toBeInTheDocument();

    // type 'some text'
    const input = getSearchBarInput(container);
    fireEvent.change(input, { target: { value: 'some text' } });
    expect(input).toHaveValue('some text');
    expect(input).not.toHaveValue(TEST_PLACEHOLDER);
  });

  it('should work nicely with placeholder when initial text is set', () => {
    const { container } = render(
      <SearchBar placeholder={TEST_PLACEHOLDER} initialText={TEST_INITIAL_TEXT} />
    );
    const input = getSearchBarInput(container);
    expect(input).toHaveValue(TEST_INITIAL_TEXT);
    expect(input).not.toHaveValue(TEST_PLACEHOLDER);
  });

  it('should clear input when clear button is clicked', () => {
    const { container } = render(<SearchBar />);

    // type 'some text'
    const input = getSearchBarInput(container);
    fireEvent.change(input, { target: { value: 'some text' } });
    expect(input).toHaveValue('some text');

    // clear and check if empty
    const clearButton = getClearButton(container);
    fireEvent.click(clearButton);
    expect(input).toHaveValue('');
  });

  it('should show dropdown when search matches', () => {
    const { container } = render(<SearchBar dropDownData={TEST_OPTIONS_SINGLE} />);
    const input = getSearchBarInput(container);
    TEST_OPTIONS_SMALL_VALUES.forEach((value) =>
      expect(screen.queryByText(value)).not.toBeInTheDocument()
    );

    // type 'test' which should reveal 'test0' option
    fireEvent.change(input, { target: { value: 'test' } });
    expect(screen.getByText(TEST_OPTIONS_SINGLE[0].value as string)).toBeInTheDocument();
  });

  it('should autocomplete search and hide dropdown when result clicked', () => {
    const { container } = render(<SearchBar dropDownData={TEST_OPTIONS_SINGLE} />);
    const input = getSearchBarInput(container);

    // search 'test' and click the 'test0' option
    fireEvent.change(input, { target: { value: 'test' } });
    const optionTest0 = screen.getByText('test0');
    fireEvent.click(optionTest0);

    // check for autocomplete and hidden dropdown
    expect(input).toHaveValue('test0');

    TEST_OPTIONS_SMALL_VALUES.splice(1).forEach((option) =>
      expect(screen.queryByText(option)).not.toBeInTheDocument()
    );
  });

  it('should hide dropdown when clicking outside and reshow when clicking input', async () => {
    const { container } = render(<SearchBar dropDownData={TEST_OPTIONS_SMALL} />);
    const input = getSearchBarInput(container);

    // dropdown should be shown after searching 'test'
    fireEvent.change(input, { target: { value: 'test' } });

    TEST_OPTIONS_SMALL_VALUES.forEach((value) =>
      expect(screen.queryByText(value)).toBeInTheDocument()
    );

    // click outside component; use userEvent since hook requires 'mousedown'
    // alternatively, fireEvent.mouseDown(...) could have been used
    userEvent.click(document.body);

    await waitForElementToBeRemoved(() => screen.queryByText(TEST_OPTIONS_SMALL_VALUES[0]));
    TEST_OPTIONS_SMALL_VALUES.forEach((value) =>
      expect(screen.queryByText(value)).not.toBeInTheDocument()
    );

    // click back into input; use userEvent to focus input as well
    userEvent.click(input);

    TEST_OPTIONS_SMALL_VALUES.forEach((value) =>
      expect(screen.queryByText(value)).toBeInTheDocument()
    );
  });

  it('should fire `onEnterPressed` when the `enter` key is pressed', () => {
    const mockOnEnter = jest.fn();
    const { container } = render(
      <SearchBar dropDownData={TEST_OPTIONS_SINGLE} onEnterPressed={mockOnEnter} />
    );
    const input = getSearchBarInput(container);

    // type the word 'test'
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyPress(input, { key: 'Enter', keyCode: 13 });
    expect(mockOnEnter).toBeCalledWith('test');
  });

  it('should fire `onChange` when input is changed', () => {
    const mockOnChange = jest.fn();
    const { container } = render(
      <SearchBar dropDownData={TEST_OPTIONS_SINGLE} onChange={mockOnChange} />
    );
    const input = getSearchBarInput(container);

    // type the word 'test' character by chararacter
    userEvent.type(input, 'test');
    expect(mockOnChange).toBeCalledTimes(4);
  });

  it('should debounce `onDebouncedChange` when input is changed', async () => {
    const mockOnDebouncedChange = jest.fn();
    const { container } = render(
      <SearchBar
        dropDownData={TEST_OPTIONS_SINGLE}
        onDebouncedChange={mockOnDebouncedChange}
        debounceMs={50}
      />
    );
    const input = getSearchBarInput(container);

    // type the word 'test' character by character
    userEvent.type(input, 'test');
    await waitFor(() => expect(mockOnDebouncedChange).toBeCalledWith('test'), { timeout: 500 });
  });

  function getSearchBarInput(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('c-search-bar-input')[0] as HTMLElement;
  }

  function getClearButton(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('cancel-icon')[0] as HTMLElement;
  }
});
