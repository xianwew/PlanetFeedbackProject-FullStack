async function getToken() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const pinParsed = JSON.parse(pin);; 
                resolve(pinParsed);
            } 
            catch (error) {
                reject(error);
            }
        }, 100);
    });
}

async function initializeMap() {
    try {
        // Await the resolution of getToken() promise
        const pinParsed = await getToken();

        console.log(pinParsed.geometry);
        mapboxgl.accessToken = mapToken; // Ensure 'mapToken' is defined and holds your Mapbox access token

        // Initialize the map with the parsed pin data
        const map = new mapboxgl.Map({
            container: 'map', // The HTML element ID where the map will be rendered
            style: 'mapbox://styles/mapbox/streets-v12',
            center: pinParsed.geometry.coordinates, // Expects [longitude, latitude]
            zoom: 10,
        });

        // Add a marker to the map at the pin's coordinates
        new mapboxgl.Marker()
            .setLngLat(pinParsed.geometry.coordinates)
            .addTo(map);
    } catch (error) {
        // Handle any errors that occur during the getToken call or map initialization
        console.error('Failed to parse pin or create map:', error);
    }
}

// Call the async function to initialize the map
initializeMap();





