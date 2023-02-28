import React, { useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const Table = ({ data }) => {
	const rows = useMemo(() => 
		data.map(hit => {
			const { timestamp, ip, geo, request, response } = hit._source
			const ts = new Date(timestamp).toString().slice(3, 24)
			return {
				id: hit._id,
				timestamp: ts, 
				clientip: ip,
				geo: geo.srcdest,
				request: request,
				response: response,
			}
		}),
		[data]
	)

	return (
		<Box sx={{ height: 400, width: '100%' }}>
			<DataGrid
				columns={[
					{ field: 'timestamp', headerName: 'Time', minWidth: 200 },
					{ field: 'clientip', minWidth: 200 },
					{ field: 'geo', headerName: 'geo.srcdest', minWidth: 200 },
					{ field: 'request', minWidth: 200 },
					{ field: 'response', minWidth: 200 },
				]}
				rows={rows}
				pageSize={5}
				rowsPerPageOptions={[5]}
			/>
		</Box>
	)
};

export default Table;

