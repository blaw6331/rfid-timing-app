import { Container, Header, Button } from '@cloudscape-design/components';
import React, { useEffect, useState } from 'react';
import useTimer from 'renderer/hooks/useTimer';

type Props = {};

// eslint-disable-next-line no-empty-pattern
export default function Timer({}: Props) {
  const timer = useTimer();
  return (
    <Container
      header={
        <Header variant="h1">
          <div>
            <span>
              {('0' + Math.floor((timer.elapsedTime / 600000) % 60)).slice(-2)}:
            </span>
            <span>
              {('0' + Math.floor((timer.elapsedTime / 60000) % 60)).slice(-2)}:
            </span>
            <span>
              {('0' + Math.floor((timer.elapsedTime / 1000) % 60)).slice(-2)}:
            </span>
            <span>{('0' + ((timer.elapsedTime / 1000) % 100)).slice(-2)}</span>
          </div>
        </Header>
      }
    >
      <div className="buttons">
        <Button
          onClick={() => {
            timer.handleStart();
          }}
        >
          Start
        </Button>
        <Button
          onClick={() => {
            timer.handlePause();
          }}
        >
          Stop
        </Button>
        <Button
          onClick={() => {
            timer.handleReset();
          }}
        >
          Reset
        </Button>
      </div>
    </Container>
  );
}
