import React, {FC, memo, useCallback, useRef} from 'react';

import {Box, Paper} from '@mui/material';
import Drawer from '@mui/material/Drawer';

import {changeDrawer, useAppDispatch, useAppSelector} from '../../storage';
import {TruckList} from "../truckList/truckList";
import css from './index.module.scss'

const _AppDrawer: FC = () => {
    const drawerRef = useRef();
    const {isOpened, width: drawerWidth, title} = useAppSelector(state => state.drawer.drawer);
    const dispatch = useAppDispatch();
    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(changeDrawer({drawer: {isOpened: false}}));
    }, [dispatch]);
    const handleDrag = useCallback((e: React.MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(changeDrawer({drawer: {width: `${e.clientX}px`}}));
    }, [dispatch]);

    return (
        <Drawer
            ref={drawerRef}
            sx={{
                width: drawerWidth,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                }
            }}
            variant="persistent"
            anchor="left"
            open={isOpened}
            onDragEnd={
                (e) =>
                    handleDrag(e)
            }
        >
            <Box draggable={true} className={css.mainBox} >
                <Paper className={css.paper} draggable={false}>
                    <Box>
                        <h1
                            onClick={
                                (e) => handleClick(e)}
                        >
                            Header
                        </h1>
                    </Box>
                    <TruckList/>
                </Paper>
            </Box>
        </Drawer>
    );
};

export const AppDrawer = memo(_AppDrawer);