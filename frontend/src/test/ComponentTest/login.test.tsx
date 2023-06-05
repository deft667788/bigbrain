import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginComponent from '../../pages/login/index';

describe('LoginComponent', () => {
  test('renders the component', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginComponent />
      </MemoryRouter>
    );
    // Get the input whose text is email
    const emailComponent = screen.getByPlaceholderText('email');
    // Get the input with the text password
    const passwordComponent = screen.getByPlaceholderText('Password');
    // Test whether the two texts appear on the page
    expect(emailComponent).toBeInTheDocument();
    expect(passwordComponent).toBeInTheDocument();

    // Test the button
    const buttonComponent = screen.getByText('Log in');
    // Test whether the button appears on the page
    expect(buttonComponent).toBeInTheDocument();

    // Test the register link
    const registerLink = screen.getByText('register now!');
    // Test whether the register link appears on the page
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.getAttribute('href')).toBe('/register');
  });
});
