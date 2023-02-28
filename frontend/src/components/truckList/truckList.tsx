import React, {memo, useEffect} from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {v4} from 'uuid';

import { columns } from '.';
import {useAppDispatch, useAppSelector, truckList} from '../../storage';

const _TruckList = () => {
    const dispatch = useAppDispatch();
    const {trucks, refresh} = useAppSelector(state => state.truck);
    const getTruckList = () => {
        dispatch(truckList());
    };
    useEffect(() => {

    }, [trucks, refresh])

    /*-----------*/


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{width: column.minWidth, padding: "0 4px", height: "15px"}}
                                >
                                    {column.label === 'Show' && <span><Checkbox size="small"/></span>}
                                    {column.label === 'Info' && <span>️"💬️"</span>}
                                    {column.label === 'Name' && <span>{column.label}</span>}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trucks
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align} style={{padding: "0 4px", height: "15px"}}>
                                                    {column.id === 'Show' && <Checkbox size="small"/>}
                                                    {column.id === 'Info' && <span>"💬️"</span>}
                                                    {column.id === 'Name' && row.name}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={trucks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>

    );
};

export const TruckList = memo(_TruckList);