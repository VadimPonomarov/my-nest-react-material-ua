import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {v4} from 'uuid';

import {initialDirectionCurrent, initialState} from './constants';
import {IDirection, IPayloadThrough, IShowCurrent} from './interfaces';
import {ISign} from '../../../components/places-autocomplete/interfaces';
import {ILatLng} from '../marker-slice/interfaces';

const directionsSlice = createSlice({
    name: "directions",
    initialState,
    reducers: {
        setDirectionCurrent(state, action: PayloadAction<IDirection>) {
            state.directionCurrent = {...state.directionCurrent, ...action.payload};
        },
        setIdDirectionCurrent(state, action: PayloadAction<null | undefined>) {
            if (state.directionCurrent.id) return;
            state.directionCurrent.id = v4();
        },
        setDistanceCurrent(state, action: PayloadAction<string>) {
            state.directionCurrent.distance = action.payload;
        },
        setDirectionCurrentThrough(state, action: PayloadAction<IPayloadThrough>) {
            const candidate = state.directionCurrent.through.find(item => item.id === action.payload.id);
            const index = state.directionCurrent.through.indexOf(candidate);

            switch (action.payload.sign) {
                case ISign.PLUS:
                    if (candidate) {
                        console.log("Record is not unique !!!");
                        break;
                    }
                    state.directionCurrent.through.push(action.payload);
                    break;
                case ISign.MINUS:
                    state.directionCurrent.through.splice(index, 1);
                    break;
                default:
                    if (!candidate) {
                        console.log("There is no such a record !!!");
                        break;
                    }
                    state.directionCurrent.through[index] = action.payload;
            }
        },
        addDirectionToArray(state, action: PayloadAction<null | undefined>) {
            const isExist = state.directions
                .find(item => JSON.stringify({...item, id: null}) === JSON.stringify({
                    ...state.directionCurrent,
                    id: null
                }));
            if (isExist) return;
            state.directions.push({...state.directionCurrent, id: v4()});
        },
        removeDirectionFromArray(state, action: PayloadAction<IDirection>) {
            state.directions = state.directions.filter(item => item.id !== action.payload.id);
        },
        updateDirectionInArray(state, action: PayloadAction<IDirection>) {
            const isExist = state.directions.find(item => item.id === action.payload.id);
            const index = state.directions.indexOf(isExist);
            state.directions[index] = {...isExist, ...action.payload};
            state.directions = [...state.directions];
        },
        setCurrentEmpty(state, action: PayloadAction<null | undefined>) {
            state.directionCurrent = initialDirectionCurrent;
        },
        setWatchCurrent(state, action: PayloadAction<IShowCurrent>) {
            state.showCurrent = action.payload.show;
        },
        setWatchAll(state, action: PayloadAction<null | undefined>) {
            state.directions = state.directions.map(item => ({...item, active: !state.showAllDirections}));
            state.showAllDirections = !state.showAllDirections;
        },
        setForceReRendering(state, action: PayloadAction<null | undefined>) {
            state.forceReRendering = !state.forceReRendering;
        },
        getDirectionFromByLatLng(state, action: PayloadAction<ILatLng>) {
            const result = state.directions.find(item =>
                (Math.abs(item.from.latLng.lat - action.payload.latLng.lat) < 0.05 &&
                    Math.abs(item.from.latLng.lng - action.payload.latLng.lng) < 0.05)
            );
            if (result) return console.log(result.id);
        }
    }
});

export const {
    setDirectionCurrent,
    setCurrentEmpty,
    addDirectionToArray,
    updateDirectionInArray,
    setDirectionCurrentThrough,
    removeDirectionFromArray,
    setForceReRendering,
    setDistanceCurrent,
    getDirectionFromByLatLng,
    setWatchAll
} = directionsSlice.actions;
export default directionsSlice.reducer;