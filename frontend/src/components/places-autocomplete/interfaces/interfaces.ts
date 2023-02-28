import {fieldType} from './enums';

export interface IProps {
    placeHolder?: string;
    isFrom?: boolean;
    isThrough?: boolean;
    propId?: string;
    getMapRef?: () => google.maps.Map;
}

export interface IIwContent {
    id: string;
    content: string;
}

export interface IPayloadGetCurrentInputValue {
    id?: string;
    isFrom?: boolean;
    isThrough?: boolean;
}