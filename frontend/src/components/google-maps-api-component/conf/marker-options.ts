import {IMarker} from '../../../storage/slices/marker-slice/interfaces';
import {iconOptions} from './icon-options';

type IMap = google.maps.Map;
type IMarkerOptions = google.maps.MarkerOptions;
type IFunction = (mapRef: IMap, marker?: IMarker) => IMarkerOptions;
export const markerOptions: IFunction = (mapRef, marker) => ({
    zIndex: 1004,
    map: mapRef,
    title: 'name',
    clickable: true,
    draggable: true,
    icon: iconOptions(marker),
});
 export const markerPosition = (marker: IMarker) => ({lat: marker.latLng.lat, lng: marker.latLng.lng})