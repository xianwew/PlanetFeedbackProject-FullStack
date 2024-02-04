mapboxgl.accessToken = mapToken;
const pinParsed = JSON.parse(pin);
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12',
    center: pinParsed.geometry.coordinates,
    zoom: 10, 
});

const marker1 = new mapboxgl.Marker()
.setLngLat(pinParsed.geometry.coordinates)
.addTo(map);
