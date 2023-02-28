import {ISign} from '../../../components/places-autocomplete/interfaces';
type ILatLng = {lat: number, lng: number};
export interface ILocation {
    id?: string;
    location?: string;
    latLng?: ILatLng;
}

export interface IPayloadThrough extends ILocation {
    sign?: ISign;
}


export interface IDirection {
    id?: string;
    active?: boolean;
    from?: {location: string, latLng: ILatLng};
    to?: {location: string, latLng: ILatLng};
    through?: ILocation[];
    result?: any;
    distance?: string;
}

export interface IShowCurrent {
    show: boolean;
}

export interface IInitialState {
    forceReRendering: boolean;
    showCurrent: boolean;
    directions: IDirection[];
    showAllDirections: boolean;
    directionCurrent: IDirection;

}