import {ILocation} from '../interfaces';

export const geocoderService = (location:ILocation) => {
    const geocoder = new google.maps.Geocoder();
    return geocoder
        .geocode({location});
};