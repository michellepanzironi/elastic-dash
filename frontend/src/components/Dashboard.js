import React, { useCallback, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const Dashboard = () => {
	const [data, setData] = useLocalStorageState('fetchData', null)
	
	const getSampleData = useCallback(async (controller) => {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/proxy`,
			{ signal: controller.signal }
		);
		const results = await response.json()
		console.log('results', results)

		setData(results)
	}, [setData])

	useEffect(() => {
		const controller = new AbortController();
		if (Object.keys(data).length === 0) getSampleData(controller);
		return () => {
			controller.abort()
		}
		console.log('data', data)
	}, [data, getSampleData])


	return (
		<div>
			hello charles
		</div>
	)
};

export default Dashboard;