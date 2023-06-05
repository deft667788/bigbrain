import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import JoinPlayComponent from '../../pages/joinPlay/index';

describe('Test JoinPlay Component', () => {
  test('renders the component', async () => {
    render(
      <MemoryRouter initialEntries={['/joinPlay']}>
        <JoinPlayComponent />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Give me a name'));
    expect(screen.getByText('Join the game'));
  });
});
