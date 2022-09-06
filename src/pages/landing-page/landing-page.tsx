import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '../../animations/fade';
import waveImage from '../../assets/images/wave.png';
import { Button } from '../../components/button/button';
import { Header } from '../../components/header/header';
import { paths } from '../../routing/paths';
import './landing-page.scss';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header showSearchBar={false} fixed={false} />
      <Fade className="landing-page">
        {/* todo: wrap these in an other div called 'full-viewport' for page chunking */}
        <div className="front">
          <div className="heading-text">
            <div>
              echo<span className="text-bold">Study</span>
            </div>
            <div className="learn-anything">learn anything. study anywhere.</div>
          </div>
          <img className="wave-image" src={waveImage} loading="lazy" />
          <Button className="sign-in-button" variant="light" onClick={handleSignInClick}>
            {'sign in'}
          </Button>
        </div>
      </Fade>
    </>
  );

  function handleSignInClick() {
    navigate(paths.decks);
  }
};
