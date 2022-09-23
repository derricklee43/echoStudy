import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '../../../../helpers/func';
import { createNewDeck, Deck } from '../../../../models/deck';
import { createNewLessonCard, LessonCard } from '../../../../models/lesson-card';
import {
  getTestFoxCard,
  getTestMonkeyCard,
  getTestMouseCard,
} from '../../../../models/mock/card.mock';
import { StudyResultCards } from './study-result-cards';

const MARK_AS_CORRECT_LABEL = 'mark as correct';
const MARK_AS_INCORRECT_LABEL = 'mark as incorrect';
const MARK_AS_SKIPPED_LABEL = 'mark as skipped';

describe('StudyResultCards', () => {
  let testDeck: Deck;
  let testLessonCards: LessonCard[];

  beforeEach(() => {
    testDeck = createNewDeck();

    const testCards = [getTestFoxCard(), getTestMonkeyCard(), getTestMouseCard()];
    testLessonCards = testCards.map((card) => createNewLessonCard(card, testDeck, 1));
  });

  it('should render correctly with default props', () => {
    render(<StudyResultCards lessonCards={testLessonCards} onLessonCardsChange={noop} />);

    for (const card of testLessonCards) {
      expect(screen.queryByText(card.front.text)).toBeInTheDocument();
      expect(screen.queryByText(card.back.text)).toBeInTheDocument();
    }
    const numCards = testLessonCards.length;
    expect(screen.queryAllByRole('button', { name: 'kebab-menu' }).length).toEqual(numCards);
    expect(screen.queryAllByRole('graphics-document', { name: 'skipped' }).length).toEqual(
      numCards
    );
  });

  it('should show all outcome icons', () => {
    testLessonCards[0].outcome = 'correct';
    testLessonCards[1].outcome = 'incorrect';
    testLessonCards[2].outcome = 'unseen';
    render(<StudyResultCards lessonCards={testLessonCards} onLessonCardsChange={noop} />);

    expect(screen.queryByRole('graphics-document', { name: 'skipped' })).toBeInTheDocument();
    expect(screen.queryByRole('graphics-document', { name: 'correct' })).toBeInTheDocument();
    expect(screen.queryByRole('graphics-document', { name: 'incorrect' })).toBeInTheDocument();
  });

  it('menu should show all options besides current outcome', () => {
    const { rerender } = render(
      <StudyResultCards lessonCards={[testLessonCards[0]]} onLessonCardsChange={noop} />
    );

    userEvent.click(screen.getByRole('button', { name: 'kebab-menu' }));

    expect(screen.queryByText(MARK_AS_CORRECT_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(MARK_AS_INCORRECT_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(MARK_AS_SKIPPED_LABEL)).not.toBeInTheDocument();

    testLessonCards[0] = { ...testLessonCards[0], outcome: 'correct' };
    rerender(<StudyResultCards lessonCards={[testLessonCards[0]]} onLessonCardsChange={noop} />);

    expect(screen.queryByText(MARK_AS_INCORRECT_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(MARK_AS_SKIPPED_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(MARK_AS_CORRECT_LABEL)).not.toBeInTheDocument();

    testLessonCards[0] = { ...testLessonCards[0], outcome: 'incorrect' };
    rerender(<StudyResultCards lessonCards={[testLessonCards[0]]} onLessonCardsChange={noop} />);

    expect(screen.queryByText(MARK_AS_CORRECT_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(MARK_AS_SKIPPED_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(MARK_AS_INCORRECT_LABEL)).not.toBeInTheDocument();
  });

  it('should call onLessonCardsChange when outcome is overridden', () => {
    const mockOnLessCardsChange = jest.fn<void, [LessonCard[]]>();
    render(
      <StudyResultCards
        lessonCards={[testLessonCards[0]]}
        onLessonCardsChange={mockOnLessCardsChange}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'kebab-menu' }));
    userEvent.click(screen.getByText(MARK_AS_CORRECT_LABEL));

    const expectedCard = { ...testLessonCards[0], outcome: 'correct' };
    expect(mockOnLessCardsChange).toHaveBeenCalledWith([expectedCard]);
  });
});
