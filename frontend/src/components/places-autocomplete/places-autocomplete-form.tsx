import React, {FC, memo} from 'react';

import {Container} from '@mui/material';
import Button from '@mui/material/Button';

import {
    addDirectionToArray,
    setCurrentEmpty,
    setDirectionCurrent,
    setDistanceCurrent,
    setForceReRendering,
    useAppDispatch,
    useAppSelector
} from '../../storage';
import {calculateRouteService} from '../google-maps-api-component/services';
import {MultipleSelect} from '../multiple-select/multiple-select';
import {PlacesAutocomplete} from './places-autocomplete';
import {Waypoints} from './waypoints';

const _PlacesAutocompleteForm: FC = () => {
    const dispatch = useAppDispatch();
    const {directions, directionCurrent} = useAppSelector(state => state.directions);
    const handleAddRoute = () => {
        calculateRouteService(directionCurrent)
            .then(result => {
                dispatch(setDirectionCurrent({result}));
                dispatch(setDistanceCurrent(result.routes[0].legs[0].distance.text));
            })
            .then(result => dispatch(addDirectionToArray()))
            .catch(err => console.log(`!!! Fields "From ..." and "To ..." are supposed to be fulfilled`));
        /*setDistance(result.routes[0].legs[0].distance.text);
        setDuration(result.routes[0].legs[0].duration.text);*/
    };

    const buttonClickHandler = () => {
        dispatch(setCurrentEmpty());
        dispatch(setForceReRendering());
    };

    return (
        <Container>
            {!!directions.length &&
              <MultipleSelect />
            }
            <PlacesAutocomplete
                placeHolder={"Where are you going from: "}
                isFrom={true}
            />
            <Waypoints />
            <PlacesAutocomplete
                placeHolder={"Where are you going to: "}
            />
            <Button
                variant={'outlined'}
                onClick={() => handleAddRoute()}
            >
                Рассчитать
            </Button>
            <Button
                onClick={() => buttonClickHandler()}
            >
                Очистить {directionCurrent.distance}
            </Button>
        </Container>
    );
};

export const PlacesAutocompleteForm = memo(_PlacesAutocompleteForm);