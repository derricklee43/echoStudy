import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '../../animations/fade';
import waveImage from '../../assets/images/wave.png';
import { Button } from '../../components/button/button';
import { paths } from '../../routing/paths';
import './landing-page.scss';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Fade className="landing-page">
      <div className="front">
        <div>
          echo<span className="text-bold">Study</span>
        </div>
        <img className="wave-image" src={waveImage} />
        <Button className="sign-in-button" variant="light" onClick={handleSignInClick}>
          {'sign in'}
        </Button>
      </div>
    </Fade>
  );

  function handleSignInClick() {
    navigate(paths.decks);
  }
};
