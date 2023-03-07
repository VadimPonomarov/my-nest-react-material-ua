import React, {memo, useCallback, useEffect, useState, useTransition} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {v4} from 'uuid';

import {columns} from '.';
import {useAppDispatch, useAppSelector, truckList, setChecked, deleteChecked, toggleCheckedAll} from '../../storage';
import {ITruck} from '../../storage/slices/truck-slice/interfaces';

const _TruckList = () => {
    const dispatch = useAppDispatch();
    const {trucks, refresh, checked, checkedAll} = useAppSelector(state => state.truck);
    const getTruckList = () => {
        dispatch(truckList());
    };
    const [filtered, setFiltered] = useState(trucks);
    const [pending, startTransition] = useTransition();

    const filterHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        startTransition(() => {
            const candidate: ITruck[] = trucks
                .filter(truck =>
                    truck.name.toLowerCase()
                        .match(e.target.value.toLowerCase())
                );
            setFiltered(candidate);
        });
    };

    const _setChecked = useCallback((idList: number[]) => {
        dispatch(setChecked(idList));
    }, [dispatch]);
    const _deleteChecked = useCallback((idList: number[]) => {
        dispatch(deleteChecked(idList));
    }, [dispatch]);

    const _toggleCheckedAll = useCallback(() => {
        const _idList = trucks.map(item => item.id);
        if (!checkedAll) {
            _setChecked(_idList)
            dispatch(toggleCheckedAll())
        } else {
            _deleteChecked(_idList)
            dispatch(toggleCheckedAll())
        }
    }, [_setChecked, _deleteChecked, checkedAll, trucks, dispatch]);

    const handleCheck = (e, id: number) => {
        e.target['checked'] ?
            _setChecked([id]) :
            _deleteChecked([id])
    }

    useEffect(() => {
        setFiltered(trucks);
    }, [trucks]);

    const setFilterNullHandler = () => {
        setFiltered(trucks);
    };

    /*-----------*/

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <Button
                size='small'
                onClick={() => getTruckList()}
            >
                Refresh
            </Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow key={v4()}>
                            {columns.map((column) => (
                                <TableCell
                                    key={v4()}
                                    align={column.align}
                                    style={{width: column.minWidth, padding: "0 4px", height: "15px"}}
                                >
                                    {column.label === 'Show' &&
                                        <Checkbox
                                            defaultChecked={checkedAll}
                                            value={checkedAll}
                                            size="small"
                                            onClick={() => _toggleCheckedAll()}
                                        />}
                                    {column.label === 'Info' && ''}
                                    {column.label === 'Stop' && ''}
                                    {column.label === 'Tracing' && ''}
                                    {column.label === 'Name' &&
                                        <Box>
                                            <TextField
                                                placeholder={'Filter ...'}
                                                variant={'standard'}
                                                onChange={(e) => filterHandler(e)}
                                            />
                                        </Box>
                                    }
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (<TableRow hover role="checkbox" key={v4()}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={v4()} align={column.align}
                                                           style={{padding: "0 4px", height: "15px"}}>
                                                    {column.id === 'Show' &&
                                                        <Checkbox
                                                            defaultChecked={!!checked.includes(row.id)}
                                                            value={!!checked.includes(row.id)}
                                                            size="small"
                                                            onClick={(e) => handleCheck(e, row.id)}
                                                        />}
                                                    {column.id === 'Info' && '💬️'}
                                                    {(column.label === 'Stop' &&
                                                        row.stop.match("icon-device-stop")) ?
                                                        '⛔️' : ''}
                                                    {(column.label === 'Tracing' &&
                                                        row.tracing.match("green")) ? '👁️' : ''}
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
                rowsPerPageOptions={[10, 25, 50, 75, 100]}
                component="div"
                count={trucks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{display: 'flex', justifyContent: 'start'}}
            />
        </Paper>

    );
};

export const TruckList = memo(_TruckList);