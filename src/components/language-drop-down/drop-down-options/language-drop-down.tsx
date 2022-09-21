import React from 'react';
import { LanguageIcon } from '../../../assets/icons/language-icon/language-icon';
import { CardLanguages, DeckLanguages } from '../../../models/language';
import { DropDown } from '../../drop-down/drop-down';
import { DropDownOption } from '../../drop-down-options/drop-down-options';
import './language-drop-down.scss';

interface LanguageDropDownProps<T extends DeckLanguages | CardLanguages> {
  className?: string;
  languages: T;
  language: T[number];
  label: string;
  variant: 'light' | 'dark';
  allowDefaultLanguage?: boolean;
  onLanguageSelect: (language: T[number]) => void;
}

export const LanguageDropDown = <T extends DeckLanguages | CardLanguages>({
  className = '',
  languages,
  language,
  label,
  variant,
  onLanguageSelect,
}: LanguageDropDownProps<T>) => {
  const langIconVariant = variant === 'light' ? 'dark' : 'light';
  const languageOptions = languages.map((lang) => ({ id: lang, value: lang, focusable: true }));
  return (
    <div className={`c-language-drop-down ${className}`}>
      <div>
        <LanguageIcon className="language-drop-down-icon" variant={langIconVariant} />
      </div>

      <DropDown
        label={label}
        buttonLabel={language}
        onOptionSelect={handleOptionSelect}
        options={languageOptions}
        variant={variant}
      />
    </div>
  );

  function handleOptionSelect(option: DropDownOption<T[number]>) {
    const newLanguage = option.value;
    onLanguageSelect(newLanguage);
  }
};
