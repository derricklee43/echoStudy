import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '../../animations/fade';
import { ArrowIcon } from '../../assets/icons/arrow-icon/arrow-icon';
import waveImage from '../../assets/images/wave.png';
import { Button } from '../../components/button/button';
import { Header } from '../../components/header/header';
import { useUserClient } from '../../hooks/api/use-user-client';
import './landing-page.scss';

const headerClassName = 'header-anchor';
const enum pages {
  topLanding = 'top-landing',
  usingSpeechSynth = 'using-speech-synth',
  spacedRepetition = 'spaced-reptition',
  sharedDecks = 'shared-decks',
}

export const LandingPage = () => {
  const { loginDebug } = useUserClient();
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
              <div className="description text-md-dynamic">
                the world&apos;s first hands-free audio flashcard app
              </div>
              <div className="action-button-container">
                <Button className="action-button" variant="dark" onClick={handleSignInClick}>
                  {'sign in'}
                </Button>
              </div>
              <div className="action-button-container">
                <Button className="action-button" variant="dark" onClick={handleSignUpClick}>
                  {'create an account'}
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
              <div className="showcase-description">
                <span className="text-sm-md">using state of the art</span>
                <span className="text-md-lg">speech</span>
                <span className="text-md-lg">synthesis,</span>
                <span className="text-sm-md text-alternate">study as you please</span>
              </div>
              <div className="showcase-image">
                <img className="wave-image" src={waveImage} loading="lazy" />
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
                <img className="wave-image" src={waveImage} loading="lazy" />
              </div>
              <div className="showcase-description text-right-align">
                <span className="text-md-lg">spaced repetition</span>
                <span className="text-sm-md">to never miss a beat</span>
              </div>
            </div>
            {getScrollAnchor(fromId(pages.sharedDecks), 'down')}
          </>
        )}

        {withFullViewport(
          pages.sharedDecks,
          <>
            <div className="showcase-page">
              <div className="showcase-description">
                <span className="text-sm-md">collaborate to reach your goals with</span>
                <span className="text-md-lg">shared decks</span>
              </div>
              <div className="showcase-image">
                <img className="wave-image" src={waveImage} loading="lazy" />
              </div>
            </div>
            {getScrollAnchor(fromClass(headerClassName), 'up')}
          </>
        )}
      </Fade>
    </>
  );

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
    // hardcoded user; we should really have a login page but this will suffice for now
    // also, it might make sense to not show this landing page to users who are logged in already
    loginDebug().then(() => {
      // navigate to the previous page redirected here, or /decks page as a fallback
      const hasPreviousPage = window.history.state && window.history.state.idx > 0;
      if (hasPreviousPage) {
        navigate(-1);
      } else {
        navigate('/decks');
      }
    });
  }

  function handleSignUpClick() {
    navigate('/404'); // intentionally go to 404 page
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
