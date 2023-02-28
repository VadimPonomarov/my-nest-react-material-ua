import {useLoadScript} from '@react-google-maps/api';

import {libraries} from './map-libraries';

type ILoadScript = typeof useLoadScript;
export const useLoadOptions = {
    id: 'my-map-id',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries
};
