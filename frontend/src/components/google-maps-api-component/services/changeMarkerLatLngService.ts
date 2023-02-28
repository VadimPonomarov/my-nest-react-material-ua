import {AnyAction, Dispatch} from '@reduxjs/toolkit';

import {iconsEnum} from '../../../icons';
import {changeMarker, changeMarkerIcon, getDirectionFromByLatLng} from '../../../storage';
import {IChangeMarkerPayload, ILatLng} from '../../../storage/slices/marker-slice/interfaces';

export const changeMarkerLatLngService = (e, marker, startMarkerOnDrag?: ILatLng, dispatch?: Dispatch<AnyAction>) => {
    if (marker.icon.url.toLowerCase().includes('truck')) {
        dispatch(changeMarkerIcon({...marker, icon: {url: iconsEnum.TRUCK_1.split('.')[0] + 'R.svg'}}));
        return dispatch(getDirectionFromByLatLng({latLng: {lat: e.latLng.lat(), lng: e.latLng.lng()}}));
    } else {
        return dispatch(changeMarker({marker, latLng: {lat: e.latLng.lat(), lng: e.latLng.lng()}}));
    }
};
