import {v4} from 'uuid';

import {iconsEnum} from '../../../icons';
import { IIcon } from '../../../storage/slices/marker-slice/interfaces';

export const addMarkerService = (e, currentIcon: IIcon) => (
    {
        id: v4(),
        latLng: {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        },
        icon: !!currentIcon.url ? currentIcon : {url: iconsEnum.MAIN}
    }
);
