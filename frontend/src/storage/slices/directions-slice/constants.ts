import {IDirection, IInitialState} from './interfaces';

export const initialDirectionCurrent: IDirection = {
    id: undefined,
    active: true,
    from: {location: '', latLng: {lat: null, lng: null}},
    through: [],
    to: {location: '', latLng: {lat: null, lng: null}},
    distance: null,
    result: undefined
};
export const initialState: IInitialState = {
    forceReRendering: false,
    showCurrent: false,
    directions: [],
    showAllDirections: true,
    directionCurrent: initialDirectionCurrent,
};