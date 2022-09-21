import { DropDownOption } from './drop-down-options';

// 0-indexed, (size = 1) generates [{id: 'test0', value: 'test0'}]
export const createTestOptions = (size: number): DropDownOption<string>[] =>
  [...Array(size)].map((_, index) => ({
    id: `test${index}`,
    value: `test${index}`,
    focusable: true,
  }));

export const TEST_OPTIONS_SINGLE: DropDownOption<string>[] = createTestOptions(1);
export const TEST_OPTIONS_SINGLE_VALUES: string[] = TEST_OPTIONS_SINGLE.map(getValue);

export const TEST_OPTIONS_SMALL: DropDownOption<string>[] = createTestOptions(10);
export const TEST_OPTIONS_SMALL_VALUES: string[] = TEST_OPTIONS_SMALL.map(getValue);

export const TEST_OPTIONS_MEDIUM: DropDownOption<string>[] = createTestOptions(100);
export const TEST_OPTIONS_MEDIUM_VALUES: string[] = TEST_OPTIONS_MEDIUM.map(getValue);

export const TEST_OPTIONS_LARGE: DropDownOption<string>[] = createTestOptions(1000);
export const TEST_OPTIONS_LARGE_VALUES: string[] = TEST_OPTIONS_LARGE.map(getValue);

function getValue(option: DropDownOption<string>) {
  return option.value;
}
