import {ILocation} from '../../../storage/slices/directions-slice/interfaces';

export const calculateRouteService = async (directionData) => {
    const waypoints: ILocation[] = [];
    directionData.through.map(item =>
        item.location ?
            waypoints
                .push({location: item.location}) :
            false
    );
    const directionsService = new google.maps.DirectionsService();
    return await directionsService.route({
        origin: directionData.from.location,
        destination: directionData.to.location,
        waypoints,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode.DRIVING,
    });
};