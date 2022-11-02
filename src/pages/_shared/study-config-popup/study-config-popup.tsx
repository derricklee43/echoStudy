import React, { useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/button/button';
import { DropDown } from '@/components/drop-down/drop-down';
import { PopupModal } from '@/components/popup-modal/popup-modal';
import { ProgressBar } from '@/components/progress-bar/progress-bar';
import {
  RadioButtonGroup,
  RadioButtonOption,
} from '@/components/radio-button-group/radio-button-group';
import { TextBox } from '@/components/text-box/text-box';
import { getFormattedDate } from '@/helpers/time';
import { isNumber } from '@/helpers/validator';
import { Deck } from '@/models/deck';
import { paths } from '@/routing/paths';
import { AllSortRules, SortRule } from '@/state/user-decks';
import './study-config-popup.scss';

interface StudyConfigPopupProps {
  studyConfig?: StudyConfiguration; // optionally prefill initial values
  deck: Deck;
  showPopup: boolean;
  onClose: (studyConfig: StudyConfiguration) => void;
}

export interface StudyConfiguration {
  studyType: StudyType;
  order: SortRule;
  maxCards: number;
}

export type StudyType = 'new-cards' | 'review';
const studyTypeOptions: RadioButtonOption<StudyType, string>[] = [
  { id: 'new-cards', value: 'study new cards' },
  { id: 'review', value: 'review cards' },
];

export const StudyConfigPopup = ({
  studyConfig,
  deck,
  showPopup,
  onClose,
}: StudyConfigPopupProps) => {
  const numCards = deck.metaData.cardIds.length;
  const _initialMaxCards = Math.min(studyConfig?.maxCards ?? 5, numCards);
  const studiedPercent = deck.metaData.studiedPercent;
  const progressPercent = studiedPercent === 0 ? 0 : Math.max(5, studiedPercent);

  const [studyType, setStudyType] = useState<StudyType>(studyConfig?.studyType ?? 'new-cards');
  const [orderOption, setOrderOption] = useState<SortRule>(studyConfig?.order ?? 'last created');
  const [maxCardsValue, setMaxCardsValue] = useState<number | ''>(_initialMaxCards);
  const [maxCardsError, setMaxCardsError] = useState<string>();

  const navigate = useNavigate();

  return (
    <PopupModal
      headerLabel={deck.metaData.title}
      showTrigger={showPopup}
      onClose={handlePopupClose}
      escapeFiresOnClose={false}
      outsideClickFiresOnClose={false}
    >
      <div className="study-config-popup-content">
        <div className="scp-stats">
          <div>
            <span className="blue">{numCards} terms </span>
            <span className="grey">from </span>
            <span className="blue">
              {deck.metaData.frontLang} → {deck.metaData.backLang}
            </span>
          </div>
          <div>
            <span className="grey">last studied </span>
            <span className="blue">
              {getFormattedDate(deck.metaData.dateTouched, { withTimeString: true })}
            </span>
          </div>
          <div className="progress-bar-container">
            <ProgressBar variant="dark" className="scp-progress-bar" percent={progressPercent} />
            <span className="progress-label">{`${studiedPercent}% studied`}</span>
          </div>
        </div>

        <RadioButtonGroup
          className="scp-study-type"
          variant="light"
          radioButtonOptions={studyTypeOptions}
          selectedButtonId={studyType}
          onButtonSelect={setStudyType}
        />

        <AnimatePresence exitBeforeEnter>
          {studyType !== 'review' &&
            getFadeContainer(
              <DropDown
                className="scp-order-dropdown"
                variant="light"
                options={AllSortRules.map((item) => ({ id: item, value: item, focusable: true }))}
                label="order by"
                buttonLabel={orderOption}
                onOptionSelect={(option) => setOrderOption(option.id)}
              />
            )}
        </AnimatePresence>

        <div className="scp-max-cards">
          <div className="max-cards-content">
            <TextBox<number>
              inputType="number"
              className="max-cards-textbox"
              variant="light"
              value={maxCardsValue}
              onChange={handleMaxCardsChange}
            />
            <span>max card(s)</span>
          </div>
          <AnimatePresence exitBeforeEnter>
            {maxCardsError &&
              getFadeContainer(<div className="max-cards-error">{maxCardsError}</div>)}
          </AnimatePresence>
        </div>

        <div className="scp-start-lesson">
          <Button
            bubbleOnClickEvent={false}
            disabled={!!maxCardsError}
            onClick={onStartLessonClick}
          >
            start lesson
          </Button>
        </div>
      </div>
    </PopupModal>
  );

  function onStartLessonClick() {
    if (maxCardsError) {
      return;
    }

    const deckId = deck.metaData.id;
    const params: Partial<Record<keyof StudyConfiguration, string>> = {
      studyType: studyType,
      ...(studyType !== 'review' && { order: orderOption }),
      maxCards: isNumber(maxCardsValue) ? maxCardsValue.toString() : '1',
    };

    navigate({
      pathname: `${paths.study}/${deckId}`,
      search: `?${createSearchParams(params)}`,
    });
  }

  function handlePopupClose() {
    onClose({
      studyType: studyType,
      order: orderOption,
      maxCards: isNumber(maxCardsValue) ? maxCardsValue : 1,
    });
  }

  function handleMaxCardsChange(value: string) {
    // clear existing errors
    if (maxCardsError) {
      setMaxCardsError(undefined);
    }

    const parsedMaxCards = parseInt(value);

    if (value === '' || parsedMaxCards === 0) {
      setMaxCardsError('At least one term must be studied.');
    }

    if (!isNaN(parsedMaxCards)) {
      if (parsedMaxCards > numCards) {
        setMaxCardsError('Must be less than the number of terms.');
      }

      // coerce range [1, 999]
      if (parsedMaxCards < 1 || parsedMaxCards > 999) {
        return;
      }
    }

    const newMaxCardsValue = isNaN(parsedMaxCards) ? '' : parsedMaxCards;
    setMaxCardsValue(newMaxCardsValue);
  }

  function getFadeContainer(children: JSX.Element) {
    const fadeVariants = {
      visible: {
        height: 'fit-content',
        opacity: 0.8,
        transitionEnd: { opacity: 1.0, overflow: 'visible' },
      },
      hidden: { height: 0, opacity: 0, overflow: 'hidden' },
    };

    return (
      <motion.div
        key={'children'}
        variants={fadeVariants}
        initial={'hidden'}
        exit={'hidden'}
        animate={'visible'}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }
};
