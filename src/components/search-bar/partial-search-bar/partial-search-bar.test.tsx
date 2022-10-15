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
import { noop } from '@/helpers/func';
import { PartialSearchBar } from './partial-search-bar';

const TEST_PLACEHOLDER = 'TEST_PLACEHOLDER';
const TEST_INITIAL_TEXT = 'TEST_INITIAL_TEXT';

describe('PartialSearchBar', () => {
  it('should render correctly with default props', () => {
    const { container } = render(
      <PartialSearchBar leftChild="" shouldShowResults={false} onShouldShowResultsChange={noop} />
    );
    const input = getSearchBarInput(container);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should render placeholder', () => {
    const { container } = render(
      <PartialSearchBar
        leftChild=""
        shouldShowResults={false}
        onShouldShowResultsChange={noop}
        placeholder={TEST_PLACEHOLDER}
      />
    );
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
      <PartialSearchBar
        leftChild=""
        shouldShowResults={false}
        onShouldShowResultsChange={noop}
        placeholder={TEST_PLACEHOLDER}
        searchValue={TEST_INITIAL_TEXT}
      />
    );
    const input = getSearchBarInput(container);
    expect(input).toHaveValue(TEST_INITIAL_TEXT);
    expect(input).not.toHaveValue(TEST_PLACEHOLDER);
  });

  it('should clear input when clear button is clicked', () => {
    const mockOnSearchValueChange = jest.fn();
    const { container } = render(
      <PartialSearchBar
        leftChild=""
        shouldShowResults={false}
        onShouldShowResultsChange={noop}
        searchValue={'some text'}
        onSearchValueChange={mockOnSearchValueChange}
      />
    );

    // clear and check if empty
    const input = getSearchBarInput(container);
    const clearButton = getClearButton(container);
    fireEvent.click(clearButton);
    expect(mockOnSearchValueChange).toHaveBeenCalledWith('');
  });

  it('should show dropdown when search matches', () => {
    const { container } = render(
      <PartialSearchBar
        leftChild=""
        shouldShowResults={true}
        onShouldShowResultsChange={noop}
        searchValue={'test'}
        searchResults={TEST_OPTIONS_SINGLE}
      />
    );
    const input = getSearchBarInput(container);
    userEvent.click(input);
    expect(screen.getByText(TEST_OPTIONS_SINGLE[0].value as string)).toBeInTheDocument();
  });

  it('should autocomplete search and hide dropdown when result clicked', () => {
    const mockOnSearchValueChange = jest.fn();
    const { container } = render(
      <PartialSearchBar
        leftChild=""
        shouldShowResults={true}
        onShouldShowResultsChange={noop}
        searchResults={TEST_OPTIONS_SINGLE}
        searchValue={'test'}
        onSearchValueChange={mockOnSearchValueChange}
      />
    );
    const input = getSearchBarInput(container);

    // search 'test' and click the 'test0' option
    const optionTest0 = screen.getByText('test0');
    fireEvent.click(optionTest0);

    // check for autocomplete and hidden dropdown
    expect(mockOnSearchValueChange).toHaveBeenCalledWith('test0');

    TEST_OPTIONS_SMALL_VALUES.splice(1).forEach((option) =>
      expect(screen.queryByText(option)).not.toBeInTheDocument()
    );
  });

  it('should hide dropdown when clicking outside and reshow when clicking input', async () => {
    const mockOnShouldShowResultsChange = jest.fn();
    const { container } = render(
      <PartialSearchBar
        leftChild=""
        shouldShowResults={true}
        onShouldShowResultsChange={mockOnShouldShowResultsChange}
        searchResults={TEST_OPTIONS_SMALL}
        searchValue={'test'}
      />
    );
    const input = getSearchBarInput(container);

    userEvent.click(document.body);
    expect(mockOnShouldShowResultsChange).toHaveBeenCalledWith(false);

    // click back into input; use userEvent to focus input as well
    userEvent.click(input);

    expect(mockOnShouldShowResultsChange).toHaveBeenCalledWith(true);
  });

  it('should fire `onEnterPressed` when the `enter` key is pressed', () => {
    const mockOnEnter = jest.fn();
    const { container } = render(
      <PartialSearchBar
        leftChild=""
        shouldShowResults={false}
        onShouldShowResultsChange={noop}
        searchResults={TEST_OPTIONS_SINGLE}
        onEnterPressed={mockOnEnter}
        searchValue={'test'}
      />
    );
    const input = getSearchBarInput(container);
    userEvent.click(input);

    fireEvent.keyPress(input, { key: 'Enter', keyCode: 13 });
    expect(mockOnEnter).toBeCalledWith('test');
  });

  it('should debounce `onDebouncedChange` when input is changed', async () => {
    const mockOnDebouncedChange = jest.fn();
    const { container } = render(
      <PartialSearchBar
        leftChild=""
        shouldShowResults={false}
        onShouldShowResultsChange={noop}
        searchResults={TEST_OPTIONS_SINGLE}
        onDebouncedChange={mockOnDebouncedChange}
        debounceMs={50}
      />
    );
    const input = getSearchBarInput(container);

    // type the word 'test' character by character
    userEvent.type(input, 'test');
    await waitFor(() => expect(mockOnDebouncedChange).toBeCalledWith('test'), { timeout: 500 });
  });

  it('should not show no results or loading option, when searchValue is empty', () => {
    render(
      <PartialSearchBar
        leftChild=""
        shouldShowResults={true}
        onShouldShowResultsChange={noop}
        searchResults={[]}
        areResultsLoading={true}
      />
    );
    expect(screen.queryByText('no results found...')).not.toBeInTheDocument();
    expect(screen.queryByText('loading...')).not.toBeInTheDocument();
  });

  it('should show no results option when there are no results', () => {
    render(
      <PartialSearchBar
        leftChild=""
        shouldShowResults={true}
        onShouldShowResultsChange={noop}
        searchResults={[]}
        searchValue="a"
      />
    );
    expect(screen.queryByText('no results found...')).toBeInTheDocument();
  });

  it('should show loading icon when is loading', () => {
    render(
      <PartialSearchBar
        leftChild=""
        shouldShowResults={true}
        onShouldShowResultsChange={noop}
        searchResults={[]}
        searchValue={'a'}
        areResultsLoading={true}
      />
    );
    expect(screen.queryByText('loading...')).toBeInTheDocument();
  });

  function getSearchBarInput(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('c-search-bar-input')[0] as HTMLElement;
  }

  function getClearButton(container: HTMLElement): HTMLElement {
    return container.getElementsByClassName('cancel-icon')[0] as HTMLElement;
  }
});
