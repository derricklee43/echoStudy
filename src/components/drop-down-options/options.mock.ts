import { getValue } from '@testing-library/user-event/dist/utils';
import { DropDownOption } from './drop-down-options';

// 0-indexed, (size = 1) generates [{id: 'test0', value: 'test0'}]
export const createTestOptions = (size: number): DropDownOption[] =>
  [...Array(size)].map((_, index) => ({
    id: `test${index}`,
    value: `test${index}`,
  }));

export const TEST_OPTIONS_SINGLE: DropDownOption[] = createTestOptions(1);
export const TEST_OPTIONS_SINGLE_VALUES: string[] = TEST_OPTIONS_SINGLE.map(getValueAsString);

export const TEST_OPTIONS_SMALL: DropDownOption[] = createTestOptions(10);
export const TEST_OPTIONS_SMALL_VALUES: string[] = TEST_OPTIONS_SMALL.map(getValueAsString);

export const TEST_OPTIONS_MEDIUM: DropDownOption[] = createTestOptions(100);
export const TEST_OPTIONS_MEDIUM_VALUES: string[] = TEST_OPTIONS_MEDIUM.map(getValueAsString);

export const TEST_OPTIONS_LARGE: DropDownOption[] = createTestOptions(1000);
export const TEST_OPTIONS_LARGE_VALUES: string[] = TEST_OPTIONS_LARGE.map(getValueAsString);

function getValueAsString(option: DropDownOption) {
  return option.value as string;
}
