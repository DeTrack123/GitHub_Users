import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBox from './components/SearchBox';

// SNAPSHOT TEST - Verify SearchBox UI structure
test('SearchBox matches snapshot', () => {
  const mockOnSearch = jest.fn();
  const { container } = render(<SearchBox onSearch={mockOnSearch} />);
  expect(container).toMatchSnapshot();
});

// UNIT TESTS - Verify SearchBox component functionality
test('SearchBox renders input field', () => {
  const mockOnSearch = jest.fn();
  render(<SearchBox onSearch={mockOnSearch} />);
  expect(screen.getByPlaceholderText(/Search GitHub users/i)).toBeInTheDocument();
});

test('SearchBox renders search button', () => {
  const mockOnSearch = jest.fn();
  render(<SearchBox onSearch={mockOnSearch} />);
  expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
});
