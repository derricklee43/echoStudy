import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropDown } from './drop-down';
import { noop } from '../../helpers/func';
import { TEST_OPTIONS_SMALL, TEST_OPTIONS_SMALL_VALUES } from '../drop-down-options/options.mock';

const TEST_LABEL = 'TEST_LABEL';
const TEST_BUTTON_LABEL = 'TEST_BUTTON_LABEL';

describe('DropDown', () => {
  it('should render correctly with default props', () => {
    render(
      <DropDown
        label={TEST_LABEL}
        options={TEST_OPTIONS_SMALL}
        onOptionSelect={noop}
        buttonLabel={TEST_BUTTON_LABEL}
      />
    );
    expect(screen.queryByText(TEST_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(TEST_BUTTON_LABEL)).toBeInTheDocument();
    TEST_OPTIONS_SMALL_VALUES.forEach((value) =>
      expect(screen.queryByText(value)).not.toBeInTheDocument()
    );
  });

  it('should show options on button click', () => {
    render(
      <DropDown
        label={TEST_LABEL}
        options={TEST_OPTIONS_SMALL}
        onOptionSelect={noop}
        buttonLabel={TEST_BUTTON_LABEL}
      />
    );
    userEvent.click(screen.getByText(TEST_BUTTON_LABEL));

    TEST_OPTIONS_SMALL_VALUES.forEach((value) =>
      expect(screen.queryByText(value)).toBeInTheDocument()
    );
  });

  it('should hide buttons on outside click', async () => {
    render(
      <DropDown
        label={TEST_LABEL}
        options={TEST_OPTIONS_SMALL}
        onOptionSelect={noop}
        buttonLabel={TEST_BUTTON_LABEL}
      />
    );
    userEvent.click(screen.getByText(TEST_BUTTON_LABEL));

    TEST_OPTIONS_SMALL_VALUES.forEach((value) =>
      expect(screen.queryByText(value)).toBeInTheDocument()
    );

    userEvent.click(screen.getByText(TEST_BUTTON_LABEL));
    await waitForElementToBeRemoved(() => screen.queryByText(TEST_OPTIONS_SMALL_VALUES[0]));

    TEST_OPTIONS_SMALL_VALUES.forEach((value) =>
      expect(screen.queryByText(value)).not.toBeInTheDocument()
    );
  });

  it('should call onOptionSelect when option is selected', () => {
    const mockOnOptionSelect = jest.fn();
    render(
      <DropDown
        label={TEST_LABEL}
        options={TEST_OPTIONS_SMALL}
        onOptionSelect={mockOnOptionSelect}
        buttonLabel={TEST_BUTTON_LABEL}
      />
    );
    userEvent.click(screen.getByText(TEST_BUTTON_LABEL));
    userEvent.click(screen.getByText(TEST_OPTIONS_SMALL_VALUES[0]));

    expect(mockOnOptionSelect).toBeCalledWith(TEST_OPTIONS_SMALL[0]);
  });
});
