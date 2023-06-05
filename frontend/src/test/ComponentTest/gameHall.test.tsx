import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GameHall from '../../pages/gameHall/index';

test('renders GameHall component with the title text', () => {
  render(
    <BrowserRouter>
      <GameHall />
    </BrowserRouter>
  );
  const titleElement = screen.getByText(/Waiting for players to join/i);
  expect(titleElement).toBeInTheDocument();
});
