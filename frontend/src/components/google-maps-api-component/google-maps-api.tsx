import React, {FC, memo, useCallback, useRef, useState} from 'react';

import {Box, Dialog, Tooltip} from '@mui/material';
import Button from '@mui/material/Button';
import {DirectionsRenderer, GoogleMap, InfoWindow, Marker, useLoadScript} from '@react-google-maps/api';

import {iconsEnum} from '../../icons';
import {
    addMarker,
    deleteMarker, removeTruckMarkerFromList,
    setCurrentEmpty,
    setForceReRendering,
    setMapRef, setTruckMarkerToList,
    useAppDispatch,
    useAppSelector
} from '../../storage';
import {ILatLng, IMarker} from '../../storage/slices/marker-slice/interfaces';
import {DialogList} from '../dialog/dialogList';
import {PlacesAutocompleteForm} from '../places-autocomplete/places-autocomplete-form';
import {PositionedPopper} from '../popper/popper';
import {PopperTypesEnum} from '../popper/popper-types.enum';
import {mapContainerStyle, mapOptions, markerOptions, markerPosition, useLoadOptions} from './conf';
import css from './index.module.scss';
import {IIwContent} from './interfaces';
import {
    changeMarkerLatLngService,
    getContentByIdService,
    onDblClickPointerSevice,
    onMarkerClickService,
    onMarkerRightClickHandlerService
} from './services';
import {addMarkerService} from './services/addMarkerService';

const _GoogleMaps: FC = () => {
    const {isLoaded, loadError} = useLoadScript(useLoadOptions);
    const mapRef = useRef();
    const dispatch = useAppDispatch();

    const {markers, currentIcon, truckMarkerList} = useAppSelector(state => state.markers);
    const {trucks, checked} = useAppSelector(state => state.truck);
    const [startMarkerOnDrag, setStartMarkerOnDrag] = useState<ILatLng>();
    const [markerCurrent, setMarkerCurrent] = useState(undefined);
    const [showPlacesAutocomplete, setShowPlacesAutocomplete] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [dialogList, setDialoglList] = useState<string[]>();
    const [infoWindowArray, setInfoWindow] = useState<IIwContent[]>([]);
    const {directionCurrent, directions} = useAppSelector(state => state.directions);
    const {width: drawerWidth} = useAppSelector(state => state.drawer.drawer);

    const onLoadHandler = useCallback((map) => {
        mapRef.current = map;
        dispatch(setMapRef(mapRef.current));
        onDblClickPointerSevice();
    }, [dispatch]);

    const onClickHandler = useCallback(async (e) => {
            const payLoad = await addMarkerService(e, currentIcon);
            await dispatch(addMarker(payLoad));
        },
        [dispatch, currentIcon]
    );

    const onDragStartHandler = useCallback(async (e: google.maps.MapMouseEvent, marker: IMarker) => {
        const payLoad: ILatLng = {latLng: {lat: e.latLng.lat(), lng: e.latLng.lng()}};
        await setStartMarkerOnDrag(payLoad);
    }, []);

    const onDragEndHandler = useCallback(
        (e: google.maps.MapMouseEvent, marker: IMarker) => {
            changeMarkerLatLngService(e, marker, startMarkerOnDrag, dispatch);
            dispatch(setForceReRendering());
        },
        [dispatch, startMarkerOnDrag]);

    const onMarkerClickHandler = useCallback((marker) =>
            onMarkerClickService(marker, setMarkerCurrent, infoWindowArray, setInfoWindow),
        [infoWindowArray]);

    const onTruckMarkerClickHandler = (id: number) => {
        dispatch(setTruckMarkerToList({id}));
    }
    const onCloseTruckMarker = (id: number) => {
        dispatch(removeTruckMarkerFromList({id}));
    }

    const onMarkerRightClickHandler = useCallback((marker) =>
        onMarkerRightClickHandlerService(
            marker,
            setMarkerCurrent,
            infoWindowArray,
            setInfoWindow,
            setDialoglList,
            setShowModal
        ), [infoWindowArray]);


    const getContentById = useCallback((marker) =>
            getContentByIdService(marker, infoWindowArray),
        [infoWindowArray]);

    const onDblClickHandler = useCallback(
        (e: google.maps.MapMouseEvent, marker) => {
            dispatch(deleteMarker(marker));
        }, [dispatch]);

    const onPointerClickHandler = () => {
        dispatch(setCurrentEmpty());
        setShowPlacesAutocomplete(!showPlacesAutocomplete);
    };

    if (loadError) return <h1>"Oops! Loading error ..."</h1>;
    if (!isLoaded) return <h1>"Map is loading ..."</h1>;

    return (
        <Box className={css.mainBox}>
            <Box className={css.boxPopper} marginLeft={drawerWidth}>
                <Box className={css.boxIconPointer}>
                    <PositionedPopper PopperPlacementType={PopperTypesEnum.BOTTOM}/>
                </Box>
                <Box marginX={5}>
                    <span
                        id="pointerId"
                        onClick={() => onPointerClickHandler()}
                    >
                        {showPlacesAutocomplete ? "????" : "????"}
                    </span>
                    {showPlacesAutocomplete &&
                        <PlacesAutocompleteForm/>
                    }
                </Box>
            </Box>
            <GoogleMap
                ref={mapRef}
                mapContainerStyle={mapContainerStyle}
                options={mapOptions}
                onLoad={(map) => onLoadHandler(map)}
                onClick={(e) => onClickHandler(e)}
            >
                <>
                    {markers &&
                        markers.map(marker => {
                            return <Marker
                                key={marker.id}
                                options={markerOptions(mapRef.current, marker)}
                                position={markerPosition(marker)}
                                onClick={() => onMarkerClickHandler(marker)}
                                onDragStart={(e) => onDragStartHandler(e, marker)}
                                onDragEnd={(e) => onDragEndHandler(e, marker)}
                                onDblClick={(e) => onDblClickHandler(e, marker)}
                                onRightClick={() => onMarkerRightClickHandler(marker)}
                            >
                                {(markerCurrent &&
                                        markerCurrent.id === marker.id) &&
                                    <InfoWindow
                                        key={marker.id}
                                        onCloseClick={() => setMarkerCurrent(null)}
                                        position={{...marker.latLng}}
                                    >
                                        <p>{getContentById(marker)}</p>
                                    </InfoWindow>
                                }
                            </Marker>;
                        })
                    }

                    {trucks &&
                        trucks
                            .filter(item => checked.includes(item.id))
                            .map(truck => {
                                const position = {lat: +truck.lat, lng: +truck.lng};
                                const options = markerOptions(mapRef.current,
                                    {
                                        id: '' + truck.id,
                                        latLng: {...position},
                                        icon: {url: iconsEnum.TRUCK_1}
                                    })

                                return <Marker
                                    key={truck.id}
                                    options={options}
                                    position={position}
                                    onClick={() => onTruckMarkerClickHandler(truck.id)}
                                >
                                    {
                                        truckMarkerList.includes(truck.id) &&
                                        <InfoWindow
                                            key={truck.id}
                                            onCloseClick={() => onCloseTruckMarker(truck.id)}
                                            position={{lat: +truck.lat, lng: +truck.lng}}
                                        >
                                            <small>{truck.name}</small>
                                        </InfoWindow>
                                    }
                                </Marker>
                            })}

                    {directions &&
                        directions
                            .map(resp =>
                                resp.active &&
                                <DirectionsRenderer
                                    key={resp.id}
                                    directions={resp.result}
                                />
                            )
                    }
                    <Dialog open={showModal}>
                        <DialogList selectList={dialogList}/>
                        <Button onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Dialog>
                </>
            </GoogleMap>
        </Box>
    )
        ;
};

export const MyGoogleMaps = memo(_GoogleMaps);