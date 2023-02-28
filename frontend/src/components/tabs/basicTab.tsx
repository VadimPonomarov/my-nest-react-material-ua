import React, {FC, memo} from 'react';

import {Box, Tab, Tabs} from '@mui/material';

import {TruckList} from '../truckList/truckList';

const _BasicTab = () => {
    return (
        <TruckList/>
    );
};

export const BasicTab = memo(_BasicTab);

