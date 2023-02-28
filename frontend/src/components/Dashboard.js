import React, { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import Table from './Table';
import Chart from './Chart';
import './Dashboard.css'


const Dashboard = () => {
	const [data, setData] = useLocalStorageState('fetchData', [])
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	
	const getSampleData = useCallback(async (controller) => {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/proxy`,
			{ signal: controller?.signal }
		);
		const results = await response.json()

		await setData([...data, ...results.hits.hits])
	}, [data, setData])

	useEffect(() => {
		const controller = new AbortController();
		if (data.length === 0) getSampleData(controller);
		return () => {
			controller.abort()
		}
	}, [data, getSampleData])

	const dateRangeData = data.filter(hit => {
		// where timestamp is > startDate and < endDate
		const hitDate = new Date(hit._source.timestamp)
		return startDate < hitDate && hitDate < endDate
	})
	// Feb 28 < Mar 10 === true
	// Mar 10 < Mar 12
	console.log(new Date() < startDate)
	console.log({ dateRangeData })

	return (
		<div className='dashboard'>

			<div className='flex chartButtons'>
				<div className='flex dateRange'>
					<DatePicker
						selected={startDate}
						onChange={date => setStartDate(date)}
						selectsStart
						startDate={startDate}
					/>
					<DatePicker
						selected={endDate}
						selectsEnd
						startDate={startDate}
						endDate={endDate}
						minDate={startDate}
						onChange={date => setEndDate(date)}
					/>
				</div>
				<Button onClick={() => getSampleData()} variant="contained" startIcon={<RefreshIcon />}>Refresh</Button>
			</div>

			<div><b>{data.length}</b> Hits</div>
			<div className='bold'>{startDate.toString().slice(3, 24)}  -  {endDate.toString().slice(3, 24)}</div>

			<Chart data={data} />
			<Table data={data} />

		</div>
	)
};

export default Dashboard;