import React from 'react';
import { 
	BarChart, 
	ResponsiveContainer, 
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Bar,
} from 'recharts';

const Chart = ({ data }) => {

	// have to group hits data by hour via timestamp, to get count
	const hourlyCount = Object.create(null);
	data.forEach(hit => {
		// `2023-02-11 08:00`
		const { timestamp } = hit._source
		const dateTime = `${timestamp.slice(0, 10)} ${timestamp.slice(11, 13)}:00`
		if (!hourlyCount[dateTime]) {
			hourlyCount[dateTime] = 1
		} else {
			hourlyCount[dateTime] += 1
		}
	});

	// [{
		// date: `2023-02-11 08:00`
		// count: 2
	// }]
	const keys = Object.keys(hourlyCount);
	const chartData = keys.map(key => {
		const result = {}
		result['hour'] = key
		result['count'] = hourlyCount[key]
		return result;
	});

	console.log(chartData)

	return (
		<div style={{ width: "100%", height: 300 }}>
			<ResponsiveContainer>
				<BarChart
					width={500}
					height={300}
					data={chartData}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="hour" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="count" fill="#82ca9d" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default Chart;