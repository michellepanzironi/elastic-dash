import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

test('display the number of Hits', () => {
	render(<Dashboard />);
	const element = screen.getByText('Hits');
  expect(element).toBeInTheDocument();
})

test('should display a refresh button', () => {
	render(<Dashboard />);
	const element = screen.getByText('Reset');
	expect(element).toBeInTheDocument();
})