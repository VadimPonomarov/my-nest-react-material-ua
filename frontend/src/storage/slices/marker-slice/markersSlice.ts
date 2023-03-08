import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {initialState} from './constants';
import {IChangeMarkerPayload, IIcon, IMarker} from './interfaces';


const markersSlice = createSlice({
    name: 'markers',
    initialState,
    reducers: {
        addMarker(state, action: PayloadAction<IMarker>) {
            state.markers.push({...action.payload, ...state.currentIcon});
        },
        setCurrentIcon(state, action: PayloadAction<IIcon>) {
            state.currentIcon = action.payload;
        },
        changeMarker(state, action: PayloadAction<IChangeMarkerPayload>) {
            state.markers = state.markers.map(marker => {
                return marker.id.includes(action.payload.marker.id)
                    ? {...marker, latLng: action.payload.latLng}
                    : marker;
            });
        },
        setTruckMarkerToList(state, action: PayloadAction<{ id: number }>) {
            const candidate = state.truckMarkerList.filter(value => value !== action.payload.id);
            candidate.push(action.payload.id);
            state.truckMarkerList = candidate;
        },
        removeTruckMarkerFromList(state, action: PayloadAction<{ id: number }>) {
            const candidate = state.truckMarkerList.filter(value => value !== action.payload.id);
            state.truckMarkerList = candidate;
        },
        removeTruckMarkerFromListAll(state) {
            state.truckMarkerList = []
        },

        changeMarkerIcon(state, action: PayloadAction<IMarker>) {
            const candidate = state.markers.find(item => item.id === action.payload.id);
            if (!candidate) return;
            const index = state.markers.indexOf(candidate);
            state.markers[index] = action.payload;
        },

        deleteMarker(state, action: PayloadAction<IMarker>) {
            state.markers = state.markers.filter(marker => !marker.id.includes(action.payload.id));
        }

    }
});

export const {
    addMarker,
    setCurrentIcon,
    changeMarker,
    deleteMarker,
    changeMarkerIcon,
    setTruckMarkerToList,
    removeTruckMarkerFromListAll,
    removeTruckMarkerFromList
} = markersSlice.actions;
export default markersSlice.reducer;

