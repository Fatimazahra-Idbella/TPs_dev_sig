require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GraphicsLayer",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",
  "esri/Graphic",
  "esri/widgets/Sketch"

], function (esriConfig, Map, MapView, GraphicsLayer, Point, Polyline, Polygon, Graphic, Sketch) {

  esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurDbsYHINrVfeJUjyYqMCmBPBY5hhGTzzNr1VtzwF6xn8fDvaScRVcO9tAqwIOrboENAU7ZRuYivYYCdnTiLAFCQIW5xQCTDTtQEV-2f4tM1LDqbGM15Dh3fQ3jghx63opci20X1J-jYX1mcf81Gju42xO25ZtXyGRTkCrzm6lVDxkb9Jy-6Ip6LQTwCvh-fB1_xmijO_T_kx4Q7aMBJmMes.AT1_Xhr019s3";



  const map = new Map({
    basemap: "arcgis-topographic" // Fond de carte
  });

  const view = new MapView({
    map: map,
    center: [-7.62, 33.59], // Longitude, latitude
    zoom: 13, // Niveau de zoom
    container: "viewDiv"
  })


  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  const point = new Point({
    longitude: -7.62,
    latitude: 33.59
  });

  let symbol = {
    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
    style: "diamond",
    color: "blue",
    size: "8px", // pixels
    outline: { // autocasts as new SimpleLineSymbol()
      color: [255, 255, 0],
      width: 3 // points
    }
  };

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: symbol
  });

  graphicsLayer.add(pointGraphic);
  const polyline = new Polyline({
    paths: [
      [-7.66, 33.54], //Longitude, latitude
      [-7.64, 33.56], //Longitude, latitude
      [-7.57, 33.58] //Longitude, latitude
    ]
  });

  const simpleLineSymbol = {
    type: "simple-line",
    color: "blue", // Orange
    width: 2
  };

  const lineGraphic = new Graphic({
    geometry: polyline,
    symbol: simpleLineSymbol
  });
  graphicsLayer.add(lineGraphic);
  const polygon = new Polygon({
    rings: [
      [-7.51, 33.61], //Longitude, latitude
      [-7.47, 33.64], //Longitude, latitude
      [-7.45, 33.61], //Longitude, latitude
      [-7.48, 33.60] //Longitude, latitude
    ]
  });
  const simpleFillSymbol = {
    type: "simple-fill",
    color: "blue", // Orange, opacity 80%
    outline: {
      color: [255, 255, 255],
      width: 1
    }
  };
  const polygonGraphic = new Graphic({
    geometry: polygon,
    symbol: simpleFillSymbol
  });
  graphicsLayer.add(polygonGraphic);

  let sketch = new Sketch({
    layer: graphicsLayer,
    view: view
  });
  view.ui.add(sketch, "top-left");


});