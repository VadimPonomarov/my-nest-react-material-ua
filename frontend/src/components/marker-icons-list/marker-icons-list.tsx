import React, {FC, memo, useCallback, useState} from 'react';

import {Box, Paper} from '@mui/material';

import {iconsEnum} from '../../icons';
import {setCurrentIcon, useAppDispatch} from '../../storage';
import css from './index.module.scss';

const _MarkerIconsList: FC = () => {
    const dispatch = useAppDispatch();
    const [currentKey, setCurrentKey] = useState(undefined);
    const handleClick =
        useCallback((e, key: string) => {
            dispatch(setCurrentIcon({url: iconsEnum[key]}));
            setCurrentKey(key);
        }, [dispatch]);

    return (
        <Box>
            <Box className={css.container}>
                {
                    Object.keys(iconsEnum)
                        .map((key) => (
                            <Paper key={key} className={css.paper} elevation={3}>
                                <img className={
                                    key !== currentKey
                                        ? css.icon
                                        : [css.icon, css.active].join(' ')
                                }
                                     src={iconsEnum[key]}
                                     alt={iconsEnum[key]}
                                     draggable={true}
                                     onClick={(e) =>
                                         handleClick(e, key)
                                     }
                                />
                            </Paper>
                        ))
                }
            </Box>
        </Box>
    );
};

export const MarkerIconsList = memo(_MarkerIconsList);