import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '@/animations/fade';
import { ArrowIcon } from '@/assets/icons/arrow-icon/arrow-icon';
import retroImage from '@/assets/images/retro-aesthetic.png';
import waveImage from '@/assets/images/wave.png';
import womanOnPhoneImage from '@/assets/images/woman-on-phone.png';
import { Button } from '@/components/button/button';
import { DeckCover } from '@/components/deck-cover/deck-cover';
import { Header } from '@/components/header/header';
import { noop } from '@/helpers/func';
import { testEnglishDeck } from '@/models/mock/deck.mock';
import { paths } from '@/routing/paths';
import './landing-page.scss';

const headerClassName = 'header-anchor';
const enum pages {
  topLanding = 'top-landing',
  usingSpeechSynth = 'using-speech-synth',
  spacedRepetition = 'spaced-repetition',
  sharedDecks = 'shared-decks',
}

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header className={`darker ${headerClassName}`} showSearchBar={false} fixed={false} />
      <Fade className="landing-page">
        {withFullViewport(
          pages.topLanding,
          <>
            <div className="top-page">
              <div className="heading-text">
                <div className="text-lg-dynamic">
                  echo<span className="text-bold">Study</span>
                </div>
                <div className="learn-anything text-md-dynamic">
                  learn anything. study anywhere.
                </div>
              </div>
              <img className="wave-image" src={waveImage} loading="lazy" />
              <div className="description text-md-lg-dynamic">
                the world&apos;s first hands-free audio flashcard app
              </div>
              <div className="action-button-container">
                <Button className="action-button" variant="dark" onClick={handleSignInClick}>
                  sign in
                </Button>
              </div>
              <div className="action-button-container">
                <Button className="action-button" variant="dark" onClick={handleSignUpClick}>
                  create an account
                </Button>
              </div>
            </div>
            {getScrollAnchor(fromId(pages.usingSpeechSynth), 'down')}
          </>
        )}

        {withFullViewport(
          pages.usingSpeechSynth,
          <>
            <div className="showcase-page">
              <div className="showcase-image">
                <img className="wave-image" src={womanOnPhoneImage} loading="lazy" />
              </div>
              <div className="showcase-description text-right-align">
                <span className="text-sm-md">using state of the art</span>
                <span className="text-md-lg">speech synthesis,</span>
                <span className="text-alternate">study as you please</span>
              </div>
            </div>
            {getScrollAnchor(fromId(pages.sharedDecks), 'down')}
          </>
        )}

        {withFullViewport(
          pages.sharedDecks,
          <>
            <div className="showcase-page dotted">
              <div className="showcase-description place-left">
                <span className="text-sm-md">collaborate to reach your goals with</span>
                <span className="text-md-lg">shared decks</span>
              </div>
              <div className="showcase-deck-preview">
                <div className="column left">
                  {[...Array(5)].map((_val, index) => {
                    return getDeckCover(index, index % 2 == 0);
                  })}
                </div>
                <div className="column right">
                  {[...Array(5)].map((_val, index) => {
                    return getDeckCover(index + 10, index % 2 == 1);
                  })}
                </div>
                <div className="showcase-image">
                  <img className="wave-image" src={retroImage} loading="lazy" />
                </div>
              </div>
            </div>
            {getScrollAnchor(fromId(pages.spacedRepetition), 'down')}
          </>
        )}

        {withFullViewport(
          pages.spacedRepetition,
          <>
            <div className="showcase-page">
              <div className="showcase-image">
                <img className="wave-image" src={retroImage} loading="lazy" />
              </div>
              <div className="showcase-description text-right-align">
                <span className="text-md-lg">spaced repetition</span>
                <span className="text-sm-md">to never miss a beat</span>
              </div>
            </div>
            {getScrollAnchor(fromClass(headerClassName), 'up')}
          </>
        )}
      </Fade>
    </>
  );

  function getDeckCover(index: number, startFlipped: boolean) {
    console.log(startFlipped);
    return (
      <DeckCover
        deck={testEnglishDeck(index)}
        startFlipped={startFlipped}
        onStudyClick={noop}
        onViewClick={noop}
      />
    );
  }

  function withFullViewport(id: string, children: JSX.Element) {
    return (
      <div id={id} className="full-viewport">
        {children}
      </div>
    );
  }

  function getScrollAnchor(selector: string, iconOrientation: 'up' | 'down') {
    return (
      <div className="scroll-down-anchor">
        <Button onClick={() => scrollToElement(selector)} variant="invisible">
          <ArrowIcon className="scroll-down-icon" orientation={iconOrientation} />
        </Button>
      </div>
    );
  }

  function handleSignInClick() {
    navigate(paths.signIn);
  }

  function handleSignUpClick() {
    navigate(paths.signUp);
  }

  function scrollToElement(selector: string) {
    const element = document.querySelector(selector) ?? document.querySelector('.header');
    element?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }

  function fromClass(selector: string) {
    return '.' + selector;
  }

  function fromId(selector: string) {
    return '#' + selector;
  }
};
