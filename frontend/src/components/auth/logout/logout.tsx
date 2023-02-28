import React, {memo, useCallback, useEffect} from 'react';

import {useNavigate} from "react-router-dom";

import {clearToken, setIsAuth, useAppDispatch, useAppSelector} from "../../../storage";

const _Logout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        dispatch( clearToken());
        dispatch( setIsAuth(false));
        navigate('/login');
    }, [dispatch, navigate])
    return (
        <div>
            <h1>Logout</h1>
        </div>
    );
};

export const Logout = memo(_Logout);