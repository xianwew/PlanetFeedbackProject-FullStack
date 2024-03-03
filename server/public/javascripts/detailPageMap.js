mapboxgl.accessToken = mapToken; 
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/standard',
    center: planetpins.geometry.coordinates, 
    zoom: 10,
});

new mapboxgl.Marker()
    .setLngLat(planetpins.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 40})
        .setHTML(
            `<div style="padding: 2px; padding-Right: 1.5rem">
                <h5 style="font-Weight: 550">${planetpins.title}</h5>
                <p style="font-Size: 14px;" class="mb-0">${planetpins.location}</P>
            </div>`
        )
    )
    .addTo(map);





