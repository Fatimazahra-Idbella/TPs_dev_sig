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
  ], function (esriConfig, Map, MapView, GraphicsLayer, Point, Polyline, Polygon, Graphic,  Sketch) {
   
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurIJbcyg--Z0NSed8P7Wqjib8XaB6ReHxsI9uVRBG4mOQHyy68IHpPQKm2rhwoAkpyohdEfQhUt5VnG3UJJnvJq-PORkyhy-nXqsdSN36oinyWBcIeNPIU6qSHTRm553G6yhI-n4l7BHaMVetcIQJ03AZTDRpHJTEYYwtPUj0rXeybf8c_bmclVepwxfTEIGercXvmVgvZxjQ3jgfuA27NnizjoLrHy3baTl9zRDlL1h0AT1_HNOoAM8o";
   
   
   
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

    let sketch = new Sketch({
        layer: graphicsLayer,
        view: view
        });
        view.ui.add(sketch, "top-left");
        
   
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
    const popupTemplate = {
        title: "{Nom}",
        content: "{Description}"
        }
        const attributes = {
        Nom: "Graphic",
        Description: "Un graphic point"
        }
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
   
   
   
  });