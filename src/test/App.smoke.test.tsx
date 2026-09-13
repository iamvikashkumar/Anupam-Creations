import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@/app/App';

describe('App shell', () => {
  it('renders the home page hero at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: /made just for you/i }),
    ).toBeInTheDocument();
  });

  it('renders the services page at /services', () => {
    render(
      <MemoryRouter initialEntries={['/services']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1, name: /our services/i })).toBeInTheDocument();
  });

  it('renders the admin placeholder at /admin', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1, name: /admin/i })).toBeInTheDocument();
  });
});
