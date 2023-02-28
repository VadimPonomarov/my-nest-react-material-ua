import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IChangeMarkerPayload, IIcon, IInitialState, IMarker} from './interfaces';

const initialState: IInitialState = {
    markers: [],
    currentIcon: {
        url: "http://maps.google.com/mapfiles/marker.png"
    }
};


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
    changeMarkerIcon
} = markersSlice.actions;
export default markersSlice.reducer;

