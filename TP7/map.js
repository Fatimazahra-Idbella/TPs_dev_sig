require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Sketch"
], function (esriConfig, Map, MapView, FeatureLayer, GraphicsLayer, Sketch) {
 
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurIJbcyg--Z0NSed8P7Wqjib8XaB6ReHxsI9uVRBG4mOQHyy68IHpPQKm2rhwoAkpyohdEfQhUt5VnG3UJJnvJq-PORkyhy-nXqsdSN36oinyWBcIeNPIU6qSHTRm553G6yhI-n4l7BHaMVetcIQJ03AZTDRpHJTEYYwtPUj0rXeybf8c_bmclVepwxfTEIGercXvmVgvZxjQ3jgfuA27NnizjoLrHy3baTl9zRDlL1h0AT1_HNOoAM8o";
 
    const map = new Map({
        basemap: "arcgis-topographic"
    });
 
    const view = new MapView({
        map: map,
        center: [-7.62, 33.59],
        zoom: 13,
        container: "viewDiv"
    });
 
    const communeLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Communes/FeatureServer"
    });
 
    const populationLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/casa_population1/FeatureServer",
    });
 
    map.addMany([communeLayer, populationLayer]);
 
    const maCoucheGraphique = new GraphicsLayer();
    map.add(maCoucheGraphique);
 
    const sketch = new Sketch({
        layer: maCoucheGraphique,
        view: view,
        creationMode: "update"
    });
 
    view.ui.add(sketch, "top-right");
 
    sketch.on("update", (event) => {
        if (event.state === "start") {
            queryFeatureLayers(event.graphics[0].geometry);
        }
        if (event.state === "complete") {
            maCoucheGraphique.remove(event.graphics[0]);
        }
        if (event.toolEventInfo && ["scale-stop", "reshape-stop", "move-stop"].includes(event.toolEventInfo.type)) {
            queryFeatureLayers(event.graphics[0].geometry);
        }
    });
 
    function queryFeatureLayers(geometry) {
        const query = {
            spatialRelationship: "intersects",
            geometry: geometry,
            outFields: ["*"],
            returnGeometry: true
        };
 
        communeLayer.queryFeatures(query).then((communeResults) => {
            populationLayer.queryFeatures(query).then((populationResults) => {
                console.log("Communes:", communeResults.features);
                console.log("Population:", populationResults.features);
                displayResults(communeResults, populationResults);
            });
        });
    }
 
    function displayResults(communeResults, populationResults) {
        const communeSymbol = {
            type: "simple-fill",
            color: [20, 130, 200, 0.5],
            outline: { color: "white", width: 0.5 }
        };
 
        const populationSymbol = {
            type: "simple-marker",
            color: [200, 50, 50, 0.5],
            outline: { color: "black", width: 1 }
        };
 
        communeResults.features.forEach((feature) => {
            feature.symbol = communeSymbol;
            feature.popupTemplate = {
                title: "Commune {COMMUNE_AR}",
                content: "Prefecture : {PREFECTURE} <br> Population : {POPULATION} <br> Surface : {Shape_Area}"
            };
        });
 
        populationResults.features.forEach((feature) => {
            feature.symbol = populationSymbol;
            feature.popupTemplate = {
                title: "Population Zone",
                content: "Zone : {ZONE} <br> Population : {POPULATION} <br> Densité : {DENSITE}"
            };
        });
 
        maCoucheGraphique.addMany([...communeResults.features, ...populationResults.features]);
    }
});