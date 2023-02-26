import React from 'react';
// import axios from 'axios';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const Dashboard = () => {
	const [data, setData] = useLocalStorageState('fetchData', {})
	// axios.get()


	console.log(`${process.env.REACT_APP_API_URL}/kibana_sample_data_logs/_search`);

	return (
		<div>
			hello charle
		</div>
	)
};

export default Dashboard;