import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '@/helpers/func';
import { withFakeTimers } from '@/helpers/test';
import { DropDownOptions } from './drop-down-options';
import {
  TEST_OPTIONS_SINGLE,
  TEST_OPTIONS_SINGLE_VALUES,
  TEST_OPTIONS_SMALL,
  TEST_OPTIONS_SMALL_VALUES,
} from './options.mock';

describe('DropDownOptions', () => {
  it('should render correctly with default props', () => {
    render(
      <DropDownOptions
        ellipsisOverflow={false}
        show={true}
        options={TEST_OPTIONS_SINGLE}
        onOptionSelect={noop}
      />
    );
    expect(screen.queryByText(TEST_OPTIONS_SINGLE_VALUES[0])).toBeVisible();
  });

  it('should hide when component rerenders with show as false', () => {
    return withFakeTimers(async () => {
      const { rerender } = render(
        <DropDownOptions
          ellipsisOverflow={false}
          show={true}
          options={TEST_OPTIONS_SINGLE}
          onOptionSelect={noop}
        />
      );
      expect(screen.queryByText(TEST_OPTIONS_SINGLE_VALUES[0])).toBeVisible();

      rerender(
        <DropDownOptions
          ellipsisOverflow={false}
          show={false}
          options={TEST_OPTIONS_SINGLE}
          onOptionSelect={noop}
        />
      );

      // wrt `Fade` having transition duration of 0.2 (200ms)
      jest.advanceTimersByTime(208); // 16 * Math.ceil(200 / 16)
      expect(screen.queryByText(TEST_OPTIONS_SINGLE_VALUES[0])).not.toBeVisible();
    });
  });

  it('should click the right dropdown option', () => {
    const mockOnOptionSelect = jest.fn();
    render(
      <DropDownOptions
        ellipsisOverflow={false}
        show={true}
        options={TEST_OPTIONS_SMALL}
        onOptionSelect={(option) => mockOnOptionSelect(option.value)}
      />
    );

    // target element at index 1 (so, 2nd element)
    const secondOptionText = TEST_OPTIONS_SMALL_VALUES[1];
    userEvent.click(screen.getByText(secondOptionText));
    expect(mockOnOptionSelect).toBeCalledWith(secondOptionText);
  });

  it('should ignore click on dropdown option when not focusable', () => {
    const mockOnOptionSelect = jest.fn();
    const testOptions = [...TEST_OPTIONS_SMALL];
    testOptions[0] = { ...TEST_OPTIONS_SMALL[0], focusable: false };
    render(
      <DropDownOptions
        ellipsisOverflow={false}
        show={true}
        options={testOptions}
        onOptionSelect={(option) => mockOnOptionSelect(option.value)}
      />
    );

    const firstOptionText = TEST_OPTIONS_SMALL_VALUES[0];
    userEvent.click(screen.getByText(firstOptionText));
    expect(mockOnOptionSelect).not.toHaveBeenCalled();
  });
});
