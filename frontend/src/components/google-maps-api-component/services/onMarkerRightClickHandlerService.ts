export const onMarkerRightClickHandlerService =
    async (marker, setMarkerCurrent, infoWindowArray, setInfoWindow, setDialoglList, setShowModal ) => {
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
            const dialogListCandidate = [];
            results.forEach(item => dialogListCandidate.push(item.formatted_address));
            setDialoglList(dialogListCandidate);
            setShowModal(true);
        });
};