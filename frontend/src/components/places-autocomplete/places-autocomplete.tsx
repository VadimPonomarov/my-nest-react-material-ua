import React, {FC, memo, useEffect, useState} from 'react';

import {Box, Paper, Tooltip} from '@mui/material';
import Typography from '@mui/material/Typography';
import useOnclickOutside from "react-cool-onclickoutside";
import usePlacesAutocomplete, {getGeocode, getLatLng,} from "use-places-autocomplete";
import {v4} from 'uuid';

import css from './index.module.scss';
import {IProps, ISign} from './interfaces';
import {
    addMarker,
    setDirectionCurrent,
    setDirectionCurrentThrough,
    useAppDispatch,
    useAppSelector
} from '../../storage';
import {IDirection, ILocation} from '../../storage/slices/directions-slice/interfaces';

const _PlacesAutocomplete: FC<IProps> = (props) => {
    const {placeHolder, isFrom, isThrough, propId} = props;
    const dispatch = useAppDispatch();
    const {directionCurrent, forceReRendering} = useAppSelector(state => state.directions);
    const currentIcon = useAppSelector(state => state.markers.currentIcon);
    const {mapRef} = useAppSelector(state => state.map);
    const [showFlag, setShowFlag] = useState(true);
    const [isEmpty, setIsEmpty] = useState(true);
    const refOutside = useOnclickOutside(() => {
        clearSuggestions();
    });
    const {
        ready,
        value = '',
        suggestions: {status, data},
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search scope here */
        },
        debounce: 300,
    });
    const getValueCurrent = (): string => {
        if (isFrom) {
            return directionCurrent.from.location;
        } else if (isThrough) {
            const res = directionCurrent
                .through
                .find(item => item.id.includes(propId));
            return res.location || "";
        }
        return directionCurrent.to.location;
    };

    useEffect(() => {
        setValue(getValueCurrent());
        setShowFlag(true);
        setIsEmpty(false);
        // eslint-disable-next-line
    }, [forceReRendering]);
    const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value);
        e.target.value.trim() ?
            setIsEmpty(false) :
            setIsEmpty(true);
    };
    const handleSelect =
        ({description}) =>
            () => {
                setValue(description, false);
                clearSuggestions();
                setShowFlag(true);

                getGeocode({address: description})
                    .then((results) => {
                        const {lat, lng} = getLatLng(results[0]);
                        mapRef.panTo({lat, lng});
                        if (isThrough) {
                            return dispatch(setDirectionCurrentThrough({
                                id: propId,
                                location: description,
                                latLng: {lat, lng}
                            }));
                        }
                        const payloadData: IDirection =
                            isFrom ?
                                {from: {location: description, latLng: {lat, lng}}} :
                                {to: {location: description, latLng: {lat, lng}}};

                        dispatch(setDirectionCurrent(payloadData));
                    });
            };


    const handleDoubleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (!value) {
            setValue(getValueCurrent());
            setIsEmpty(false);
            setShowFlag(true);
        } else {
            setValue("");

            if (isThrough) {
                const payloadData: ILocation = {
                    id: propId,
                    location: '',

                };
                dispatch(setDirectionCurrent(payloadData));
            } else {
                const payloadData: IDirection =
                    isFrom ?
                        {from: {location: '', latLng: {lat: null, lng: null}}} :
                        {to: {location: '', latLng: {lat: null, lng: null}}};

                dispatch(setDirectionCurrent(payloadData));
            }

            setValue('');
            if (!isEmpty) setIsEmpty(true);
            if (showFlag) setShowFlag(false);
        }
    };
    const wayPointSignHandler = (sign: ISign) => {
        switch (sign) {
            case ISign.PLUS:
                dispatch(setDirectionCurrentThrough({id: v4(), sign: ISign.PLUS}));
                break;
            case ISign.MINUS:
                dispatch(setDirectionCurrentThrough({id: propId, sign: ISign.MINUS}));
                break;
            default:
        }
    };
    const handleCommit: React.MouseEventHandler = (e) => {
        getGeocode({address: value})
            .then((results) => {
                const {lat, lng} = getLatLng(results[0]);
                const payloadData: IDirection =
                    isFrom ?
                        {from: {location: value, latLng: {lat, lng}}} :
                        {to: {location: value, latLng: {lat, lng}}};
                mapRef.panTo({lat, lng});
                dispatch(addMarker({
                    id: v4(),
                    icon: currentIcon,
                    latLng: {lat, lng}
                }));
            });
        setShowFlag(false);
    };


    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: {
                    main_text,
                    secondary_text
                },
            } = suggestion;

            return (
                <li
                    key={place_id}
                    onClick={
                        handleSelect(suggestion)
                    }>
                    {main_text}
                    {secondary_text}
                </li>
            );
        });

    const ctrlKeyHandler = () => {
        setShowFlag(!showFlag);
        setIsEmpty(false);
    };

    return (
        <Box
            ref={refOutside}
            marginY={1}
        >
            <Box className={css.inputBox}>
                {isFrom &&
                  <span
                    onClick={
                        () => wayPointSignHandler(ISign.PLUS)
                    }>
                    ➕
                  </span>
                }
                {(isThrough &&
                        directionCurrent.through.length) &&
                  <span
                    onClick={
                        () => wayPointSignHandler(ISign.MINUS)
                    }>
                    ➖
                  </span>
                }
                <Tooltip
                    title={
                        getValueCurrent()
                    }
                    placement="top-start"
                >
                    <input
                        className={css.input}
                        value={value}
                        disabled={!ready}
                        placeholder={placeHolder}
                        onChange={
                            (e) => handleInput(e)
                        }
                        onClick={
                            (e) =>
                                e.nativeEvent.ctrlKey ?
                                    ctrlKeyHandler() :
                                    null
                        }
                        onDoubleClick={
                            (e) => handleDoubleClick(e)
                        } />
                </Tooltip>
                {(showFlag && !isEmpty) &&
                  <span onClick={
                      (e) => handleCommit(e)
                  }>
                    👁️‍🗨️
                  </span>}
            </Box>
            {status === "OK" &&
              <ul>
                <Paper
                  className={css.paper}
                >
                  <Typography
                    padding={3}
                  >
                      {renderSuggestions()}
                  </Typography>
                </Paper>
              </ul>}
        </Box>
    );
};

export const PlacesAutocomplete = memo(_PlacesAutocomplete);