import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchBar } from './search-bar';
import { TEST_OPTIONS_SINGLE, TEST_OPTIONS_SMALL } from '../drop-down/options.mock';
import userEvent from '@testing-library/user-event';

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
    const dropdown = getDropdown(container);
    expect(dropdown).toHaveClass('hidden');

    // type 'test' which should reveal 'test0' option
    fireEvent.change(input, { target: { value: 'test' } });
    expect(dropdown).not.toHaveClass('hidden');
  });

  it('should autocomplete search and hide dropdown when result clicked', () => {
    const { container } = render(<SearchBar dropDownData={TEST_OPTIONS_SINGLE} />);
    const input = getSearchBarInput(container);
    const dropdown = getDropdown(container);

    // search 'test' and click the 'test0' option
    fireEvent.change(input, { target: { value: 'test' } });
    const optionTest0 = screen.getByText('test0');
    fireEvent.click(optionTest0);

    // check for autocomplete and hidden dropdown
    expect(input).toHaveValue('test0');
    expect(dropdown).toHaveClass('hidden');
  });

  it('should hide dropdown when clicking outside and reshow when clicking input', () => {
    const { container } = render(<SearchBar dropDownData={TEST_OPTIONS_SMALL} />);
    const input = getSearchBarInput(container);
    const dropdown = getDropdown(container);

    // dropdown should be shown after searching 'test'
    fireEvent.change(input, { target: { value: 'test' } });
    expect(dropdown).not.toHaveClass('hidden');

    // click outside component; use userEvent since hook requires 'mousedown'
    // alternatively, fireEvent.mouseDown(...) could have been used
    userEvent.click(document.body);
    expect(dropdown).toHaveClass('hidden');

    // click back into input; use userEvent to focus input as well
    userEvent.click(input);
    expect(dropdown).not.toHaveClass('hidden');
  });

  function getSearchBarInput(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('c-search-bar-input')[0] as HTMLElement;
  }

  function getClearButton(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('c-cancel-icon')[0] as HTMLElement;
  }

  function getDropdown(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('c-drop-down')[0] as HTMLElement;
  }
});
