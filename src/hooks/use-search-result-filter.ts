import { SearchResult } from '../components/search-bar/base-search-bar/base-search-bar';

export const useSearchResultFilter = (isCaseSensitive: boolean) => {
  return { filterSearchResults };

  function filterSearchResults<T>(searchOptions: SearchResult<T, string>[], searchValue: string) {
    return searchOptions.filter(({ value }) => resultContainsValue(value, searchValue));
  }

  function resultContainsValue(result: string, searchValue: string) {
    result = normalizeString(result);
    searchValue = normalizeString(searchValue);
    return result.includes(searchValue);
  }

  function normalizeString(str: string) {
    if (!isCaseSensitive) {
      str = str.toLocaleLowerCase();
    }
    return str.trim();
  }
};
