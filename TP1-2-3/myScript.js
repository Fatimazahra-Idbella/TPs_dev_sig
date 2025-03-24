require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/BasemapToggle",
  "esri/widgets/BasemapGallery",
  "esri/layers/FeatureLayer",
  "esri/PopupTemplate",
  "esri/widgets/Legend",
  "esri/renderers/ClassBreaksRenderer",
  "esri/renderers/SimpleRenderer",
], function (
  esriConfig,
  Map,
  MapView,
  BasemapToggle,
  BasemapGallery,
  FeatureLayer,
  PopupTemplate,
  Legend,
  ClassBreaksRenderer,
  SimpleRenderer
) {
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurIJbcyg--Z0NSed8P7Wqjib8XaB6ReHxsI9uVRBG4mOQHyy68IHpPQKm2rhwoAkpyohdEfQhUt5VnG3UJJnvJq-PORkyhy-nXqsdSN36oinyWBcIeNPIU6qSHTRm553G6yhI-n4l7BHaMVetcIQJ03AZTDRpHJTEYYwtPUj0rXeybf8c_bmclVepwxfTEIGercXvmVgvZxjQ3jgfuA27NnizjoLrHy3baTl9zRDlL1h0AT1_HNOoAM8o";
 
  // Create a map
  const map = new Map({
    basemap: "arcgis-topographic", // Basemap layer service
  });
 
  // Create a MapView
  const view = new MapView({
    map: map,
    center: [-7.62, 33.59], // Longitude, latitude
    zoom: 13, // Zoom level
    container: "viewDiv", // Div element
  });
 
  // Add a basemap toggle widget to toggle between basemaps
  let basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "hybrid",
  });
  view.ui.add(basemapToggle, "bottom-right"); // Add the widget to the top-right corner of the view
 
  // Add a basemap gallery widget to toggle between basemaps
  let basemapGallery = new BasemapGallery({
    view: view,
  });
  view.ui.add(basemapGallery, {
    position: "top-right",
  });
    // legend
    let legend = new Legend({
      view: view,
    });
     view.ui.add(legend, "bottom-left");

     const commRenderer = {
      type: "class-breaks",
      // attribute of interest
      field: "Shape_Area",
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 8000000,
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [255, 255, 212],
            style: "solid",
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: "white",
              width: 1,
            },
          },
        },
        {
          minValue: 8000001,
          maxValue: 16000000,
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [254, 227, 145],
            style: "solid",
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: "white",
              width: 1,
            },
          },
        },
        {
          minValue: 16000001,
          maxValue: 26000000,
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [254, 196, 79],
            style: "solid",
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: "white",
              width: 1,
            },
          },
        },
        {
          minValue: 26000001,
          maxValue: 48000000,
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [254, 153, 41],
            style: "solid",
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: "white",
              width: 1,
            },
          },
        },
        {
          minValue: 48000001,
          maxValue: 78000000,
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [217, 95, 14],
            style: "solid",
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: "white",
              width: 1,
            },
          },
        },
        {
          minValue: 78000001,
          maxValue: 135000000,
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [153, 52, 4],
            style: "solid",
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: "white",
              width: 1,
            },
          },
        },
      ],
    };

    


 
  // Ajout des couches FeatureLayer et des popup
 
  let popupCommune = new PopupTemplate({
    title: "<b>Commune: {COMMUNE_AR}</b>",
    content:
      "<p> PREFECTURE : {PREFECTURE} </p>" +
      "<p> Communes : {COMMUNE_AR} </p> " +
      "<p> Surface : {Shape_Area} </p> ",
  });
  let communeRenderer = {
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [51, 51, 204, 0.9],
      style: "solid",
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: "white",
        width: 1,
      },
    },
  };
  const Communes = new FeatureLayer({
    url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Communes/FeatureServer",
    outFields: ["PREFECTURE", "COMMUNE_AR", "Shape_Area"],
    popupTemplate: popupCommune,
    renderer: communeRenderer,
  });
 
  
 
  var popupVoirie = new PopupTemplate({
    title: "Voirie de Casablanca",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "NOM",
            label: "",
            isEditable: true,
            tooltip: "",
            visible: true,
            format: null,
            stringFieldOption: "text-box",
          },
          {
            fieldName: "LENGTH",
            label: "Longueur",
            isEditable: true,
            tooltip: "",
            visible: true,
            format: {
              places: 1,
              digitSeparator: true,
            },
            stringFieldOption: "text-box",
          },
        ],
      },
    ],
  });
  let voirieRenderer = {
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: {
      type: "simple-line",
      color: "black",
      width: "2px",
      style: "short-dot",
    },
  };
 
  const Voirie = new FeatureLayer({
    url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/voirie_casa_1/FeatureServer",
    outFields: ["NOM", "LENGTH"],
    popupTemplate: popupVoirie,
    renderer: voirieRenderer,
  });
 
  let popupPopulation = new PopupTemplate({
    title: "<b>Population de : {ARRONDISSE}</b>",
    content: [
      {
        type: "media",
        mediaInfos: [
          {
            type: "column-chart",
            caption: "Statistiques de Casablanca",
            value: {
              fields: ["TOTAL1994", "TOTAL2004"],
              normalizeField: null,
              tooltipField: "",
            },
          },
        ],
      },
    ],
  });

  
  let popRenderer = {
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      size: 6,
      color: "green",
      outline: {
        // autocasts as new SimpleLineSymbol()
        width: 0.5,
        color: "white",
      },
    },
  };
  
  const sizeVisualVariable = {
    type: "size",
    field: "TOTAL2004",
    minDataValue: 3365,
    maxDataValue: 323944,
    minSize: 8,
    maxSize: 30,
  };
  popRenderer.visualVariables = [sizeVisualVariable];
  const Population = new FeatureLayer({
    url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/casa_population1/FeatureServer",
    outFields: ["ARRONDISSE", "TOTAL1994", "TOTAL2004"],
    popupTemplate: popupPopulation,
    renderer: popRenderer,
   
  });

  const Sites = new FeatureLayer({
 
    url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/sites/FeatureServer"

  });
  map.addMany([Communes, Voirie, Population, Sites]);
});
 