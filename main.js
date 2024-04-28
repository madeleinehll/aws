/* Wetterstationen Euregio Beispiel */

// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true
}).setView([ibk.lat, ibk.lng], 11);

// thematische Layer
let themaLayer = {
    stations: L.featureGroup().addTo(map)
}

// Hintergrundlayer
L.control.layers({
    "Relief avalanche.report": L.tileLayer(
        "https://static.avalanche.report/tms/{z}/{x}/{y}.webp", {
        attribution: `© <a href="https://sonny.4lima.de">Sonny</a>, <a href="https://www.eea.europa.eu/en/datahub/datahubitem-view/d08852bc-7b5f-4835-a776-08362e2fbf4b">EU-DEM</a>, <a href="https://lawinen.report/">avalanche.report</a>, all licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>`
    }).addTo(map),
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery")
}, {
    "Wetterstationen": themaLayer.stations
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// GeoJSON der Wetterstationen laden
async function showStations(url) {
    let response = await fetch(url);
    let geojson = await response.json();

    // Wetterstationen mit Icons und Popups
    console.log(geojson),
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
       <h4>${feature.properties.name} (${feature.properties.RH})</h4>
       <ul>
       <li> ${feature.properties.LT|| "-"} </li>
       <li>${feature.properties.WG_BOE || "-"}</li> 
       <li> ${feature.properties.ZEITRAUM || "-"} </li>
       <li> ${feature.properties.ZEITRAUM || "-"} </li>
       ${feature.properties.date}
        `);
        }
    .addTo(themaLayer.zones);

}
showStations("https://static.avalanche.report/weather_stations/stations.geojson");

async function loadZones(url) {
    console.log("Loading", url);
    let response = await fetch(url);
    let geojson = await response.json();
    L.geoJSON(geojson, {
        style: function (feature) {
            return {
                color: "#F012BE",
                weight: 1,
                opacity: 0.4,
                fillOpacity: 0.1,
            };
        },
        onEachFeature: function (feature, layer) {
            console.log(feature);
            console.log(`${feature.properties.ADRESSE}`);
            layer.bindPopup(`
       <h4> Fußgängerzone ${feature.properties.ADRESSE} </h4>
       <i class="fa-regular fa-clock"></i> ${feature.properties.ZEITRAUM || "dauerhaft"} <br>
       <i class="fa-solid fa-circle-info"></i> ${feature.properties.AUSN_TEXT || "ohne Ausnahme"}
        `);
        }
    }).addTo(themaLayer.zones);
}