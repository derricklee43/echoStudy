import React, { ReactNode, useRef, useState } from 'react';
import { useFocusTrap } from '../../../../hooks/use-focus-trap';
import { useEscapePress } from '../../../../hooks/use-key-press';
import { useOutsideClick } from '../../../../hooks/use-outside-click';
import { DropDownButton } from '../../../drop-down/drop-down-button/drop-down-button';
import { DropDownOption, DropDownOptions } from '../../../drop-down-options/drop-down-options';
import './category-search-bar-dropdown.scss';

interface SearchBarCategoryDropdownProps<T, S> {
  categories: DropDownOption<T, S>[];
  selectedCategory: DropDownOption<T, S>;
  onCategorySelect: (category: DropDownOption<T, S>) => void;
  onClick: () => void;
}

export function SearchBarCategoryDropdown<T extends string, S extends ReactNode>({
  selectedCategory,
  categories,
  onCategorySelect,
  onClick,
}: SearchBarCategoryDropdownProps<T, S>) {
  const [isOpen, setIsOpen] = useState(false);

  const categoryDropdownRef = useRef(null);
  useOutsideClick(categoryDropdownRef, () => setIsOpen(false));
  useFocusTrap(categoryDropdownRef, isOpen);
  useEscapePress(() => setIsOpen(false));

  return (
    <div className="category-dropdown" ref={categoryDropdownRef} onClick={onClick}>
      <DropDownButton
        variant={'dark'}
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        className="category-dropdown-button"
      >
        {selectedCategory.value}
      </DropDownButton>
      <DropDownOptions
        className="category-dropdown-options"
        show={isOpen}
        options={categories}
        onOptionSelect={handleCategoryDropdownSelect}
        ellipsisOverflow={true}
      />
    </div>
  );

  function handleCategoryDropdownSelect(category: DropDownOption<T, S>) {
    setIsOpen(false);
    onCategorySelect(category);
  }
}
