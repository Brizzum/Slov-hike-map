// --- Map Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map and set its view to a default location and zoom level
    const map = L.map('map').setView([ 46.378858, 13.848988 ], 10); // Default to Triglav

    // Base Layer
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    // --- Layer Groups ---
    const hikeLayers = L.featureGroup().addTo(map); // A group to hold all hike stages
    const hutLayers = L.featureGroup().addTo(map); // A group to hold hut markers

    // --- Process Hike Stages ---

    // Define a list of colors for the different hike stages
    const colors = ['#ff7800', '#3388ff', '#00e600', '#e60000', '#800080', '#ff00ff', '#ffff00', '#00ffff'];
    
    hikeStagesData.forEach((stage, index) => {
        fetch(stage.kml)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${stage.kml}`);
                }
                return response.text();
            })
            .then(kmlText => {
                const kmlDom = new DOMParser().parseFromString(kmlText, 'text/xml');
                const geojson = toGeoJSON.kml(kmlDom);
                
                const stageColor = colors[index % colors.length];

                const geoJsonLayer = L.geoJSON(geojson, {
                    style: function(feature) {
                        return { 
                            color: stageColor,
                            weight: 4,
                            opacity: 0.8
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        // Create a detailed popup from our data object
                        const popupContent = `
                            <h3>${stage.name}</h3>
                            <strong>Distance:</strong> ${stage.distance}<br>
                            <strong>Time:</strong> ${stage.time}<br>
                            <strong>Ascent:</strong> ${stage.ascent}<br>
                            <strong>Descent:</strong> ${stage.descent}<br>
                            <strong>Difficulty:</strong> ${stage.difficulty}<br>
                            <strong>Ground Type:</strong> ${stage.groundType}<br>
                        `;
                        layer.bindPopup(popupContent);
                    }
                });
                hikeLayers.addLayer(geoJsonLayer);

                // Fit map bounds after all layers are potentially loaded
                if (hikeLayers.getLayers().length > 0) {
                     map.fitBounds(hikeLayers.getBounds().pad(0.1));
                }
            })
            .catch(error => {
                console.error('Error loading or parsing KML file:', stage.kml, error);
                alert(`Could not load KML file: ${stage.kml}. Make sure the file exists and the path is correct.`);
            });
    });

    // --- Process Huts ---

    // Create a custom icon for the huts (using an inline SVG)
    const hutIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="brown" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 5.5l6 4.5v9H6v-9l6-4.5M12 3L4 9v12h16V9l-8-6z"/></svg>'),
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });


    hutsData.forEach(hut => {
        L.marker([hut.lat, hut.lon], { icon: hutIcon })
            .addTo(hutLayers)
            .bindPopup(`<h4>${hut.name}</h4><strong>Altitude:</strong> ${hut.alt} m`); 
    });

    // --- Layer Control ---
    const baseMaps = {
        "Satellite": satelliteLayer
    };
    const overlayMaps = {
        "Hike Stages": hikeLayers,
        "Huts": hutLayers
    };
    L.control.layers(baseMaps, overlayMaps).addTo(map);
});