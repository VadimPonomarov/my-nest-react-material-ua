import React, {FC, memo} from 'react';

import {useAppSelector} from '../../storage';
import {PlacesAutocomplete} from './places-autocomplete';


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