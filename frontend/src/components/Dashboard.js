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
	const [dates, setDates] = useState([]);
	
	const getSampleData = useCallback(async (controller) => {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/proxy`,
			{ signal: controller?.signal }
		);
		const results = await response.json()
		await setData(results.hits.hits)		

		// set default start/end for dateRange
		const sortedDates = results.hits.hits.map(hit => new Date(hit._source.timestamp)).sort((a, b) => a - b)
		setDates(sortedDates);
		setStartDate(sortedDates[0]);
		setEndDate(sortedDates[sortedDates.length - 1]);
	}, [setData])

	

	useEffect(() => {
		const controller = new AbortController();
		if (data.length === 0) getSampleData(controller);

		return () => {
			controller.abort()
		}
	}, [data, getSampleData])

	

	// const dateRangedData = data.filter(hit => {
	// 	const start = new Date(startDate?.getTime())
	// 	const end = new Date(endDate?.getTime())
	// 	// where timestamp is greater than startDate and lessthan endDate
	// 	const hitDate = new Date(hit._source.timestamp)
	// 	return hitDate >= start?.setUTCHours(23,59,59) && hitDate <= end?.setUTCHours(23,59,59)
	// 	// d >= start && d <= end
	// })
	// // Mar 1 < Mar 10 === true
	// console.log({ dateRangedData })
	
	// console.log(startDate)
	// console.log(endDate)
	
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
				<Button onClick={resetDateRange} variant="contained" startIcon={<RefreshIcon />}>Refresh</Button>
			</div>

			<div><b>{data.length}</b> Hits</div>
			<div className='bold'>{startDate?.toString().slice(3, 24)}  -  {endDate?.toString().slice(3, 24)}</div>

			<Chart data={data} />
			<Table data={data} />

		</div>
	)
};

export default Dashboard;