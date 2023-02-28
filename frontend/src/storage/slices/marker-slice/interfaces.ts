export interface IIcon {
    url: string | undefined;
}

export interface ILatLng {
    latLng: {
        lat: number,
        lng: number,
    };
}

export interface IInfoWindow {
    content: string;
}

export interface IMarker extends ILatLng {
    id: string,
    icon: IIcon,
    infoWindow?: IInfoWindow
}

export interface ICurrentIcon {
    currentIcon: IIcon;
}

export interface IInitialState extends ICurrentIcon {
    markers: IMarker[];
}

export interface IChangeMarkerPayload extends ILatLng {
    marker: IMarker;
}
