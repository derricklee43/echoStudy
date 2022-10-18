import { DropDownOption } from '@/components/drop-down-options/drop-down-options';

export const useSearchResultFilter = (isCaseSensitive: boolean) => {
  return { filterDropdownOptions, stringArrayIncludesValue };

  function filterDropdownOptions<T>(
    searchValue: string,
    searchOptions?: DropDownOption<T, string>[]
  ) {
    return searchOptions?.filter(({ value }) => stringArrayIncludesValue([value], searchValue));
  }

  function stringArrayIncludesValue(result: string[], searchValue: string) {
    result = result.map(normalizeString);
    searchValue = normalizeString(searchValue);
    return result.some((resultField) => resultField.includes(searchValue));
  }

  function normalizeString(str: string) {
    if (!isCaseSensitive) {
      str = str.toLocaleLowerCase();
    }
    return str.trim();
  }
};
