import { render, screen } from '@testing-library/react';
import App from './App';

test('renders smartcampus heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/smartcampus nexus/i);
  expect(headingElement).toBeInTheDocument();
});
