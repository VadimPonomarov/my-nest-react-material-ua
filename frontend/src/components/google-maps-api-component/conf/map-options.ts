export const mapOptions: google.maps.MapOptions = {
    center: {lat: 47.825030, lng: 35.209552},
    zoom: 10,
    disableDefaultUI: false,
    zoomControl: true,
    zoomControlOptions: {
        position: 7 // Right top
    },
    rotateControl: true,
    rotateControlOptions:{
        position: 4
    },
    mapTypeControlOptions: {
        position:3
    }
};