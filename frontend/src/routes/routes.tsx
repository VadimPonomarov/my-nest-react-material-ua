import React, {FC, memo} from 'react';

import {Route, Routes} from "react-router-dom";

import { PrivateRoute } from '.';
import {Login, Logout, MyGoogleMaps} from '../components';
import {Registration} from "../components/auth/registration/registration";
import {MainLayout} from "../layouts";
import {useAppSelector} from "../storage";

const _RoutesMain: FC = () => {

    return (
        <Routes>
            <Route path={'/'} element={<MainLayout/>}>
                <Route index element={<PrivateRoute><MyGoogleMaps/></PrivateRoute>}/>
                <Route path={'registration'} element={<Registration/>}/>
                <Route path={'login'} element={<Login/>}/>
                <Route path={'logout'} element={<Logout/>}/>
            </Route>
        </Routes>

    );
};

export const RoutesMain = memo(_RoutesMain);