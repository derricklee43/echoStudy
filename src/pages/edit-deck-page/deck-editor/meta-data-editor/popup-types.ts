import { RadioButtonOption } from '../../../../components/radio-button-group/radio-button-group';

export type TermSeparator = ' ' | ',';
export type CardSeparator = ';' | '\n';

export const termDefSeparatorOptions: RadioButtonOption<TermSeparator, string>[] = [
  { id: ',', value: 'commas' },
  { id: ' ', value: 'spaces' },
];

export const cardSeparatorOptions: RadioButtonOption<CardSeparator, string>[] = [
  { id: ';', value: 'semicolons' },
  { id: '\n', value: 'new lines' },
];
