import { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import geojsonData from './assets/new-york-counties.json';
import ndviData from './assets/new_ndvi.json';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function App() {
  const [hoverInfo, setHoverInfo] = useState(null);
  const [layerVisibility, setLayerVisibility] = useState({
    ndvi: true,
    precipitation: false,
    counties: false,
  });

  // TODO: we can add a visibility prop to each layger and assign it to the corresponding state -> layerVisibility
  const layer = [
    new GeoJsonLayer({
      id: 'GeoJsonLayer',
      data: geojsonData,
      stroked: true,
      visible: true,
      filled: true,
      pickable: true,
      // getFillColor: (f) => {
      //   // Use the feature's properties to generate a color
      //   const hash = [...f.properties.name].reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
      //   return [hash & 0xFF, (hash & 0xFF00) >> 8, (hash & 0xFF0000) >> 16];
      // },
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 2,
      onHover: (info) => setHoverInfo(info),
    }),
    new GeoJsonLayer({
      id: 'countiesLayer',
      data: geojsonData,
      stroked: true,
      visible: layerVisibility.counties,
      filled: true,
      pickable: true,
      getFillColor: (f) => {
        // Use the feature's properties to generate a color
        const hash = [...f.properties.name].reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        return [hash & 0xFF, (hash & 0xFF00) >> 8, (hash & 0xFF0000) >> 16];
      },
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 2,
      onHover: (info) => setHoverInfo(info),
    }),
    new HeatmapLayer({
      id: 'ndviLayer',
      data: ndviData,
      visible: layerVisibility.ndvi,
      aggregation: 'SUM',
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: (d) => d.NDVI,
      radiusPixels: 30,
      colorRange: [[0, 172, 105], [244, 161, 0], [247, 100, 0], [232, 21, 0], [227, 0, 89], [105, 0, 99]],
      opacity: 0.7,
    })
  ];

  const hoverLayer = hoverInfo?.object && new GeoJsonLayer({
    id: 'HoverLayer',
    data: hoverInfo.object,
    stroked: true,
    filled: false,
    getLineColor: [255, 249, 82],
    lineWidthMinPixels: 8,
  });

  const INITIAL_VIEW_STATE = {
    longitude: -74.5,
    latitude: 40.7,
    zoom: 9,
    pitch: 0,
    bearing: 0
  };

  // control layer visibility
  const handleChecked = (layer) => {
    setLayerVisibility({
      ...layerVisibility,
      [layer]: !layerVisibility[layer],
    });
  };
  
  return (
    <div>
      <div className='checkboxes'>
        <FormGroup>
          <FormControlLabel control={<Checkbox defaultChecked onChange={() => handleChecked("ndvi")}/>} label="NDVI" />
          <FormControlLabel control={<Checkbox onChange={() => handleChecked("percipitation")}/>} label="Percipitation" />
          <FormControlLabel control={<Checkbox onChange={() => handleChecked("counties")}/>} label="Counties" />
        </FormGroup>
      </div>

      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer, hoverLayer].filter(Boolean)}
      />
      {hoverInfo && hoverInfo.object && (
        <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y}}>
          <div style={{background: 'white', padding: '4px', border: '1px solid #ccc'}}>
            {hoverInfo.object.properties.name}
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;