import React, {useEffect, useRef} from 'react';
import {loadModules} from 'esri-loader';

import './styles.scss';

// FIXME: We need to test if pull all sublayers individually is faster/slower
// than pulling the whole WebServer
// this lags too much, need to lazy load and apply to map
// We can either hardcore the import or use the endpoint:
// https://web-who.westus.cloudapp.azure.com/arcgis/rest/services/PJM?f=pjson
// import * as mapServers from "../../endpoints/MapServers.json";

const webmap = {
  height: '100vh',
  width: '100vw',
};

function WebMapView() {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/MapImageLayer',
        'esri/widgets/TimeSlider',
      ],
      {css: true}
    ).then(([ArcGISMap, MapView, MapImageLayer, TimeSlider]) => {
      const radarImageLayer = new MapImageLayer({
        id: 'radarImageLayerId',
        title: 'Radar imagery nexrad time',
        url:
          'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer',
        refreshInterval: 0,
        opacity: 0.6,
        sublayers: [
          {
            title: 'Radar overlay',
            id: 3,
            visible: true,
          },
        ],
        useViewTime: true,
        visible: true,
      });
      const layers = [
        // new MapImageLayer({
        // url:
        // "https://web-who.westus.cloudapp.azure.com/arcgis/rest/services/PJM/DIMA/MapServer",
        // }),
        radarImageLayer,
      ];

      // STUDY: how to capture MapImageLayer failing to load, we don't
      // have the loadError or a finished object status by this point
      const layeredMap = new ArcGISMap({
        basemap: 'osm',
        layers,
      });
      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: layeredMap,
        center: [-122, 47.5],
        zoom: 9,
      });

      const timeSlider = new TimeSlider({
        container: 'timeSliderDiv',
        view,
        playRate: 300,
        stops: {
          interval: {
            value: 10,
            unit: 'minutes',
          },
        },
        // show data within a given time range
        // in this case data within one year
        mode: 'time-window',
      });
      view.ui.add(timeSlider, 'bottom-leading');

      view.whenLayerView(radarImageLayer).then(() => {
        // TODO: Figure out this time offset from actual MapServer
        // layeredMap and request update
        // https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer?f=pjson&returnUpdates=true
        const TIME_OFFSET = 1209600000;
        const [
          startTime,
          endTime,
        ] = radarImageLayer.sourceJSON.timeInfo.timeExtent;

        const start = new Date(startTime + TIME_OFFSET);
        const end = new Date(endTime + TIME_OFFSET);

        timeSlider.fullTimeExtent = {start, end};
        timeSlider.values = [start, start];
      });

      return () => {
        if (view) {
          // destroy the map view
          view.container = null;
        }
      };
    });
  });

  return <div className="absolute" style={webmap} ref={mapRef} />;
}
export default WebMapView;
