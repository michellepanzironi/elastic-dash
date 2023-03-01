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
	const [dates, setDates] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	
	const getSampleData = useCallback(async (controller) => {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/proxy`,
			{ signal: controller?.signal }
		);
		const results = await response.json()
		await setData(results.hits.hits)		
	}, [setData])

	useEffect(() => {
		const controller = new AbortController();
		if (data.length === 0) getSampleData(controller);

		return () => {
			controller.abort()
		}
	}, [data, getSampleData])

	useEffect(() => {
		if (data.length > 0 && !startDate && !endDate) {
			// set default start/end for dateRange
			const sortedDates = data.map(hit => new Date(hit._source.timestamp)).sort((a, b) => a - b)
			setDates(sortedDates);
			setStartDate(sortedDates[0]);
			setEndDate(sortedDates[sortedDates.length - 1]);
		}
	}, [data, startDate, endDate])

	const dateRangedData = data.filter(hit => {
		const start = new Date(startDate?.getTime()).toString().slice(0, 15)
		const end = new Date(endDate?.getTime()).toString().slice(0, 15)
		const hitDate = new Date(hit._source.timestamp).toString().slice(0, 15)
		
		if (start === end) {
			return hitDate === start
		}

		return new Date(hitDate) >= new Date(start) && new Date(hitDate) <= new Date(end)
	})	
	
	const resetDateRange = () => {
		setStartDate(dates[0]);
		setEndDate(dates[dates.length - 1]);
	}

	return (
		<div className='dashboard'>

			<div className='flex chartButtons'>
				<div className='flex dateRange'>
					<DatePicker
						selected={startDate}
						onChange={date => setStartDate(date)}
						selectsStart
						startDate={startDate}
						endDate={endDate}
					/>
					<DatePicker
						selected={endDate}
						onChange={date => setEndDate(date)}
						selectsEnd
						startDate={startDate}
						endDate={endDate}
						minDate={startDate}
					/>
				</div>
				<Button 
					onClick={resetDateRange} 
					variant="contained" 
					startIcon={<RefreshIcon />}
					disableElevation
				>
					Refresh
				</Button>
			</div>

			<div><b>{data.length}</b> Hits</div>
			<div className='bold'>{startDate?.toString().slice(3, 24)}  -  {endDate?.toString().slice(3, 24)}</div>

			<Chart data={dateRangedData} />
			<Table data={dateRangedData} />

		</div>
	)
};

export default Dashboard;