import React from 'react';
import {
  TEST_OPTIONS_SINGLE,
  TEST_OPTIONS_SMALL,
  TEST_OPTIONS_SMALL_VALUES,
} from '@/components/drop-down-options/options.mock';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategorySearchBar } from './category-search-bar';
import { noop } from '@/helpers/func';
import { SearchBarCategoryDropdown } from './search-bar-category-dropdown/search-bar-category-dropdown';

describe('SearchBar', () => {
  it('should render correctly with default props', () => {
    render(
      <SearchBarCategoryDropdown
        selectedCategory={TEST_OPTIONS_SMALL[0]}
        categories={TEST_OPTIONS_SMALL}
        onCategorySelect={noop}
        onClick={noop}
      />
    );
    expect(screen.getByText(TEST_OPTIONS_SMALL[0].value)).toBeInTheDocument();

    userEvent.click(screen.getByText(TEST_OPTIONS_SMALL[0].value));
    const [first, ...rest] = TEST_OPTIONS_SMALL;

    expect(screen.queryAllByText(first.value)).toHaveLength(2);
    rest.forEach((option) => expect(screen.getByText(option.value)).toBeInTheDocument());
  });

  it('should call onCategorySelect when category is selected', () => {
    const mockOnCategorySelect = jest.fn();
    render(
      <SearchBarCategoryDropdown
        selectedCategory={TEST_OPTIONS_SMALL[0]}
        categories={TEST_OPTIONS_SMALL}
        onCategorySelect={mockOnCategorySelect}
        onClick={noop}
      />
    );
    userEvent.click(screen.getByText(TEST_OPTIONS_SMALL[0].value));
    userEvent.click(screen.getByText(TEST_OPTIONS_SMALL[1].value));

    expect(mockOnCategorySelect).toHaveBeenCalledWith(TEST_OPTIONS_SMALL[1]);
  });
});
