import { render } from '@testing-library/react';
import App from '../App';

test('use localStorage to persist candidate data', () => {
	render(<App />);
	const data = window.localStorage.getItem('fetchData');
	expect(data).toBeTruthy();
})