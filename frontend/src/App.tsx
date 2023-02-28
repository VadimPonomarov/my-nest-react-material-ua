import React, {FC} from 'react';

import {Outlet} from 'react-router-dom';

import {RoutesMain} from './routes';

const App: FC = () => {
    return (
        <>
            <RoutesMain/>
            <Outlet/>
        </>
    );
};


export default App;
