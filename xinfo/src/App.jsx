import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

function App() {
  const center = [40.7128, -74.0060]; // Center of the map (New York in this case)
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    // Fetch GeoJSON data
    fetch('./assets/new-york-counties.geojson')
      .then((response) => response.json())
      .then((data) => setGeojsonData(data));
  }, []);

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {geojsonData && <GeoJSON data={geojsonData} />}
    </MapContainer>
  );
}

export default App;