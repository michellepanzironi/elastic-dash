import React, { useCallback, useEffect } from 'react';
import Table from './Table';
// import { 
// 	BarChart, 
// 	ResponsiveContainer, 
// 	CartesianGrid,
// 	XAxis,
// 	YAxis,
// 	Tooltip,
// 	Legend,
// 	Bar,
// } from 'recharts';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import './Dashboard.css'

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
		if (!data) getSampleData(controller);
		return () => {
			controller.abort()
		}
	}, [data, getSampleData])


	return (
		<div className='dashboard'>

			<div className='flex'>
				<div>date range picker</div>
				<div>refresh</div>
			</div>

			<div>hits</div>
			<div className='flex'>
				<div>date range</div>
				<div>hourly</div>
			</div>

			<div>chart</div>

			<Table data={data.hits.hits} />

		</div>
	)
};

// _source: {
// 	timestamp: "2022-01-02T00:00:00Z",
// 	clientip: "5.6.7.8",
// 	geo: { srcdest: "CA" },
// 	request: "GET /about",
// 	response: 200,
// },

export default Dashboard;