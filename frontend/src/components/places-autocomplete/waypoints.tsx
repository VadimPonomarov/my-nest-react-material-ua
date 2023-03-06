import React, {FC, memo} from 'react';

import {PlacesAutocomplete} from './places-autocomplete';
import {useAppSelector} from '../../storage';


const _Waypoints: FC = () => {
    const {directionCurrent: {through}} = useAppSelector(state => state.directions);
    return (
        <>
            {
                through.map(item =>
                    <PlacesAutocomplete
                        key={item.id}
                        propId={item.id}
                        placeHolder={"Through ..."}
                        isThrough={true}
                    />
                )}
        </>
    );
};

export const Waypoints = memo(_Waypoints);