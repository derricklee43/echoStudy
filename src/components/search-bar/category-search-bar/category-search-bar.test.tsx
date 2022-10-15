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
import { CategorySearchBar } from './category-search-bar';

describe('SearchBar', () => {
  it('should render correctly with default props', () => {
    const TEST_PLACEHOLDER = 'TEST_PLACEHOLDER';
    render(
      <CategorySearchBar
        placeholder={TEST_PLACEHOLDER}
        selectedCategory={TEST_OPTIONS_SMALL[0]}
        searchCategories={TEST_OPTIONS_SMALL}
        onCategorySelect={noop}
      />
    );
    expect(screen.getByText(TEST_OPTIONS_SMALL[0].value)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(TEST_PLACEHOLDER)).toBeInTheDocument();

    userEvent.click(screen.getByText(TEST_OPTIONS_SMALL[0].value));
    const [first, ...rest] = TEST_OPTIONS_SMALL;

    expect(screen.queryAllByText(first.value)).toHaveLength(2);
    rest.forEach((option) => expect(screen.getByText(option.value)).toBeInTheDocument());
  });
});
