import React from 'react';
import { LanguageIcon } from '../../../assets/icons/language-icon/language-icon';
import { CardLanguages, DeckLanguages } from '../../../models/language';
import { DropDown } from '../../drop-down/drop-down';
import { DropDownOption } from '../../drop-down-options/drop-down-options';
import './language-drop-down.scss';

interface LanguageDropDownProps<T extends DeckLanguages | CardLanguages> {
  languages: T;
  language: T[number];
  label: string;
  variant: 'light' | 'dark';
  allowDefaultLanguage?: boolean;
  onLanguageSelect: (language: T[number]) => void;
}

export const LanguageDropDown = <T extends DeckLanguages | CardLanguages>({
  languages,
  language,
  label,
  variant,
  onLanguageSelect,
}: LanguageDropDownProps<T>) => {
  const langIconVariant = variant === 'light' ? 'dark' : 'light';
  const languageOptions = languages.map((lang) => ({ id: lang, value: lang }));
  return (
    <div className="c-language-drop-down">
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
