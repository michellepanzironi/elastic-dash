import React, { useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
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
import Table from './Table';
import Chart from './Chart';
import './Dashboard.css'

const Dashboard = () => {
	const [data, setData] = useLocalStorageState('fetchData', [])
	
	const getSampleData = useCallback(async (controller) => {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/proxy`,
			{ signal: controller?.signal }
		);
		const results = await response.json()

		setData([...data, ...results.hits.hits])
	}, [data, setData])

	useEffect(() => {
		const controller = new AbortController();
		if (data.length === 0) getSampleData(controller);
		return () => {
			controller.abort()
		}
	}, [data, getSampleData])


	return (
		<div className='dashboard'>

			<div className='flex chartButtons'>
				<div>date range</div>
				<Button onClick={() => getSampleData()} variant="contained" startIcon={<RefreshIcon />}>Refresh</Button>
			</div>

			<div><b>{data.length}</b> Hits</div>
			<div className='flex bold'>
				<div>DATERANGESTART - DATERANGEEND</div>
				<div>HOURLY</div>
			</div>

			<Chart data={data} />

			<Table data={data} />

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