import { DropDownOption } from './drop-down';

// 0-indexed, (size = 1) generates [{id: 'test0', value: 'test0'}]
export const createTestOptions = (size: number): DropDownOption[] =>
  [...Array(size)].map((_, index) => ({
    id: `test${index}`,
    value: `test${index}`,
  }));

export const TEST_OPTIONS_SINGLE: DropDownOption[] = createTestOptions(1);

export const TEST_OPTIONS_SMALL: DropDownOption[] = createTestOptions(10);

export const TEST_OPTIONS_MEDIUM: DropDownOption[] = createTestOptions(100);

export const TEST_OPTIONS_LARGE: DropDownOption[] = createTestOptions(1000);
