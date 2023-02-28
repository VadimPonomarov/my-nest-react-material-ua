import React, {FC, memo, useEffect, useState} from 'react';


import {AccountCircle, Menu as MenuIcon} from "@mui/icons-material";
import {AppBar, Box, FormControlLabel, FormGroup, IconButton, Menu, MenuItem, Switch, Toolbar} from "@mui/material";
import {useNavigate} from "react-router-dom";

import {changeDrawer,  setIsAuth, useAppDispatch, useAppSelector} from '../../storage';
import css from './index.module.scss';

const _AppBar: FC = () => {
    const {isAuth} = useAppSelector(state => state.auth);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const {isOpened, width} = useAppSelector(state => state.drawer.drawer);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.checked) {
            dispatch(setIsAuth(false));
            navigate("/logout");
        } else {
            navigate("/login");
        }
    };
    const [_width, setWidth] = useState<string>();
    
    useEffect(() => {
        setWidth((+width.split('px')[0] - 6) + "px");
    }, [width])

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickMenuIcon: React.MouseEventHandler<HTMLButtonElement> =
        (e: React.MouseEvent<HTMLButtonElement>) => {
            +width.split('px')[0] < 40 ?
                dispatch(changeDrawer({drawer: {width: "40px", isOpened: !isOpened}})) :
                dispatch(changeDrawer({drawer: {isOpened: !isOpened}}));
        };
    return (
        <Box sx={{
            flexGrow: 1,
            marginBottom: '5px',
            marginLeft: isOpened ? _width : null,
        }}>
            <AppBar id={'appBarId'} position={'static'}>
                <Toolbar
                    className={css.toolbar}
                >
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={
                            (e) =>
                                handleClickMenuIcon(e)
                        }
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Box
                        display={"flex"}
                        alignItems={'center'}
                    >
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isAuth}
                                        onChange={(e) => handleChange(e)}
                                        aria-label="login switch"
                                    />
                                }
                                label={!isAuth ? 'Login' : 'Logout'}
                            />
                        </FormGroup>
                        {isAuth && (
                            <div>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle/>
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleClose}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        My account
                                    </MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export const MyAppBar = memo(_AppBar);