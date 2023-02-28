import React, {FC, memo} from 'react';

import {Outlet} from 'react-router-dom';

import {AppDrawer, MyAppBar} from '../../components';


const mainLayout: FC = () => {
    return (
        <>
            <MyAppBar />
            <AppDrawer />
            <Outlet />
        </>
    );
};

export const MainLayout = memo(mainLayout);