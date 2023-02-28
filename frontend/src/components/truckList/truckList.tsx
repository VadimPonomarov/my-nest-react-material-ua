import React, {memo, useEffect} from 'react';

import Box from '@mui/material/Box';
import {v4} from 'uuid';

import {useAppDispatch, useAppSelector, truckList} from '../../storage';

const _TruckList = () => {
    const dispatch = useAppDispatch();
    const {trucks, refresh} = useAppSelector(state => state.truck);
    const getTruckList = () => {
        dispatch(truckList());
    };
    useEffect(() => {

    }, [trucks, refresh])

    return (
        <div>
            <button onClick={() => getTruckList()}>Click</button>
            {trucks.map(item => (
                <Box key={v4()}>
                    <div>{item.code}</div>
                    <div>{item.name}</div>
                </Box>
            ))}
        </div>

    );
};

export const TruckList = memo(_TruckList);