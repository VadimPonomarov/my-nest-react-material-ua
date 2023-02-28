export const onMarkerClickService = async (marker, setMarkerCurrent, infoWindowArray, setInfoWindow) => {
    const geocoder = new google.maps.Geocoder();
    await setMarkerCurrent(marker);
    await geocoder
        .geocode({location: marker.latLng})
        .then(({results}) => {
            const result = results[0].formatted_address;
            const filtered = infoWindowArray
                .filter(item => item.id !== marker.id);
            filtered
                .push({id: marker.id, content: result});
            setInfoWindow(filtered);
        });
}