import { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import geojsonData from './assets/new-york-counties.json';

function App() {
  const [hoverInfo, setHoverInfo] = useState(null);

  const layer = new GeoJsonLayer({
    id: 'GeoJsonLayer',
    data: geojsonData,
    stroked: false,
    filled: true,
    pickable: true,
    getFillColor: (f) => {
      // Use the feature's properties to generate a color
      const hash = [...f.properties.name].reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
      return [hash & 0xFF, (hash & 0xFF00) >> 8, (hash & 0xFF0000) >> 16];
    },
    getLineColor: [255, 255, 255],
    lineWidthMinPixels: 1,
    onHover: (info) => setHoverInfo(info),
  });

  const INITIAL_VIEW_STATE = {
    longitude: -74.5,
    latitude: 40.7,
    zoom: 9,
    pitch: 0,
    bearing: 0
  };

  return (
    <div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer]}
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