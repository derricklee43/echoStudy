import React from 'react';
import { DropDownOption, DropDownOptions } from './drop-down-options';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '../../helpers/func';
import {
  TEST_OPTIONS_SINGLE,
  TEST_OPTIONS_SINGLE_VALUES,
  TEST_OPTIONS_SMALL,
  TEST_OPTIONS_SMALL_VALUES,
} from './options.mock';

describe('Button', () => {
  it('should render correctly with default props', () => {
    render(<DropDownOptions show={true} options={TEST_OPTIONS_SINGLE} onOptionSelect={noop} />);
    expect(screen.queryByText(TEST_OPTIONS_SINGLE_VALUES[0])).toBeVisible();
  });

  it('should hide when component rerenders with show as false', async () => {
    const { rerender } = render(
      <DropDownOptions show={true} options={TEST_OPTIONS_SINGLE} onOptionSelect={noop} />
    );
    expect(screen.queryByText(TEST_OPTIONS_SINGLE_VALUES[0])).toBeVisible();

    rerender(<DropDownOptions show={false} options={TEST_OPTIONS_SINGLE} onOptionSelect={noop} />);
    await waitForElementToBeRemoved(() => screen.queryByText(TEST_OPTIONS_SINGLE_VALUES[0]), {
      timeout: 1000, // wrt `Fade` having transition duration of 0.2 (200ms)
    });
  });

  it('should click the right dropdown option', () => {
    const mockOnOptionSelect = jest.fn();
    render(
      <DropDownOptions
        show={true}
        options={TEST_OPTIONS_SMALL}
        onOptionSelect={(option: DropDownOption) => mockOnOptionSelect(option.value)}
      />
    );

    // target element at index 1 (so, 2nd element)
    const secondOptionText = TEST_OPTIONS_SMALL_VALUES[1];
    userEvent.click(screen.getByText(secondOptionText));
    expect(mockOnOptionSelect).toBeCalledWith(secondOptionText);
  });
});
