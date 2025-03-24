require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
], function (esriConfig, Map, MapView, FeatureLayer) {
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurIJbcyg--Z0NSed8P7Wqjib8XaB6ReHxsI9uVRBG4mOQHyy68IHpPQKm2rhwoAkpyohdEfQhUt5VnG3UJJnvJq-PORkyhy-nXqsdSN36oinyWBcIeNPIU6qSHTRm553G6yhI-n4l7BHaMVetcIQJ03AZTDRpHJTEYYwtPUj0rXeybf8c_bmclVepwxfTEIGercXvmVgvZxjQ3jgfuA27NnizjoLrHy3baTl9zRDlL1h0AT1_HNOoAM8o";

  const map = new Map({
    basemap: "arcgis-topographic", // Fond de carte
  });

  const view = new MapView({
    map: map,
    center: [-7.62, 33.59], // Longitude, latitude
    zoom: 13, // Niveau de zoom
    container: "viewDiv",
  });

  // Couche Communes
  const featureLayer = new FeatureLayer({
    url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Communes/FeatureServer",
  });
  map.add(featureLayer);

  // Couche Population
  const populationLayer = new FeatureLayer({
    url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/casa_population1/FeatureServer",
  });
  map.add(populationLayer);

  // 🔹 Filtres pour la couche COMMUNES
  const communesQueries = [
    "-- Critère de recherche --",
    "PREFECTURE='PREFECTURE DE CASABLANCA'",
    "COMMUNE_AR='MUNICIPALITE BOUSKOURA'",
    "PLAN_AMENA='PA ENQUETE PUBLIQUE'",
    "Shape_Area > 40000000",
    "PREFECTURE='PROVINCE DE NOUACEUR' AND PLAN_AMENA='PA ENQUETE PUBLIQUE'",
  ];
  
  let communesWhereClause = communesQueries[0]; 

  // 🔹 Filtres pour la couche POPULATION
  const populationQueries = [
    "-- Critère de recherche --",
    "TOTAL2004 > 100000 ",
    "MÉNAGES200 > 30000"
  ];

  let populationWhereClause = populationQueries[0]; 

  // 📌 Fonction pour créer un menu déroulant
  function createSelect(queries, onChange) {
    const select = document.createElement("select");
    select.style.position = "absolute";
    select.style.top = "10px";
    select.style.right = "10px";
    select.style.padding = "5px";

    queries.forEach((query) => {
      let option = document.createElement("option");
      option.value = query;
      option.innerHTML = query;
      select.appendChild(option);
    });

    select.addEventListener("change", onChange);
    document.body.appendChild(select);
    return select;
  }

  // 📌 Menu déroulant pour COMMUNES
  createSelect(communesQueries, (event) => {
    communesWhereClause = event.target.value;
    queryFeatureLayer(featureLayer, communesWhereClause);
  });

  // 📌 Menu déroulant pour POPULATION
  createSelect(populationQueries, (event) => {
    populationWhereClause = event.target.value;
    queryFeatureLayer(populationLayer, populationWhereClause);
  });

  // 📌 Fonction pour exécuter la requête SQL
  function queryFeatureLayer(layer, whereClause) {
    const query = {
      where: whereClause,
      outFields: ["*"],
      returnGeometry: true,
    };

    layer
      .queryFeatures(query)
      .then((results) => {
        console.log("Feature count: " + results.features.length);
        displayResults(results);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // 📌 Fonction pour afficher les résultats
  function displayResults(results) {
    const symbol = {
      type: "simple-fill",
      color: [226, 135, 67, 0.5],
      outline: { color: "black", width: 1 },
    };

    const popupTemplate = {
      title: "Commune",
      content: "Préfecture : {PREFECTURE} <br> Plan d'Aménagement : {PLAN_AMENA} <br> Population (2004) : {TOTAL2004} <br> Ménages (2004) : {MENAGES2004}",
    };

    results.features.forEach((feature) => {
      feature.symbol = symbol;
      feature.popupTemplate = popupTemplate;
    });

    // Nettoyage avant d'afficher les nouveaux résultats
    view.popup.visible = false;
    view.graphics.removeAll();
    view.graphics.addMany(results.features);
  }
});
