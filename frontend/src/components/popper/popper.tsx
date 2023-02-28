import * as React from 'react';
import {FC, memo, useCallback} from 'react';

import {Box, Paper} from '@mui/material';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Popper, {PopperPlacementType} from '@mui/material/Popper';
import {motion} from 'framer-motion';

import {setCurrentIcon, useAppDispatch, useAppSelector} from '../../storage';
import {MarkerIconsList} from '../marker-icons-list/marker-icons-list';
import css from './index.module.scss';
import {IProps} from './interfaces/interfaces';


const _PositionedPopper: FC<IProps> = (props) => {
    const {PopperPlacementType, TransitionProps} = props;
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const [placement, setPlacement] = React.useState<PopperPlacementType>();
    const dispatch = useAppDispatch();
    const {currentIcon} = useAppSelector(state => state.markers);

    const handleClick =
        (newPlacement: PopperPlacementType) =>
            (event: React.MouseEvent<HTMLButtonElement>) => {
                setAnchorEl(event.currentTarget);
                setOpen((prev) => placement !== newPlacement || !prev);
                setPlacement(newPlacement);
            };

    const handleDblClickPointer = useCallback(() => {
        dispatch(setCurrentIcon({url: process.env.MARKER_URL_DEFAULT}));
    }, [dispatch]);
    const  popperAttr = {open, anchorEl, placement};

    return (
        <>
            <Popper transition {...popperAttr} sx={{zIndex: 1010}}>
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Box p={2}>
                            <MarkerIconsList />
                        </Box>
                    </Fade>
                )}
            </Popper>
            <Grid container padding={0}>
                <Button onClick={handleClick(PopperPlacementType)}>
                    <span onDoubleClick={() => handleDblClickPointer()}>
                            {currentIcon.url ?
                                <Paper className={css.iconPaper}>
                                    <motion.img
                                        className={css.iconImg}
                                        src={currentIcon.url}
                                        alt={"Current icon"}
                                        initial={{opacity: 0, scale: 0.5}}
                                        animate={{opacity: 1, scale: 1, rotate: 360}}
                                        transition={{duration: 1}}
                                    />
                                </Paper> :
                                    <span className={css.iconImg}>🔻</span>

                            }
                    </span>
                </Button>
            </Grid>
        </>
    );
};
export const PositionedPopper = memo(_PositionedPopper);
