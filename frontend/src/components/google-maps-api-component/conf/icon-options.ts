export const iconOptions = (marker) => ({
    url: marker.icon.url,
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(12.5, 12.5),
    scaledSize: new window.google.maps.Size(25, 25),
});