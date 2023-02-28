export interface IMapCoordinates {
    clientX: number;
    clientY: number;
}

export type IMap = google.maps.Map;

export interface IInitialState {
    mapRef?: IMap;
    mapCoordinates: IMapCoordinates | undefined;
}