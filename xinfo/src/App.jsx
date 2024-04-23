import { useState } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import geojsonData from "./assets/new-york-counties.json";
import { HexagonLayer } from "deck.gl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import precip01 from "./assets/precip/merged-01.json";
import precip02 from "./assets/precip/merged-02.json";
import precip03 from "./assets/precip/merged-03.json";
import precip04 from "./assets/precip/merged-04.json";
import precip05 from "./assets/precip/merged-05.json";
import precip06 from "./assets/precip/merged-06.json";
import precip07 from "./assets/precip/merged-07.json";
import precip08 from "./assets/precip/merged-08.json";
import precip09 from "./assets/precip/merged-09.json";
import precip10 from "./assets/precip/merged-10.json";
import precip11 from "./assets/precip/merged-11.json";
import precip12 from "./assets/precip/merged-12.json";

const monthlyPrecip = {
  1: precip01,
  2: precip02,
  3: precip03,
  4: precip04,
  5: precip05,
  6: precip06,
  7: precip07,
  8: precip08,
  9: precip09,
  10: precip10,
  11: precip11,
  12: precip12,
};



const getDateFromDayNum = function (dayNum) {
  let date = new Date();
  date.setFullYear(2023);

  date.setMonth(0);
  date.setDate(0);
  let timeOfFirst = date.getTime(); // this is the time in milliseconds of 1/1/YYYY
  let dayMilli = 1000 * 60 * 60 * 24;
  let dayNumMilli = dayNum * dayMilli;
  date.setTime(timeOfFirst + dayNumMilli);
  return date;
};

const getDayNumFromDate = function (dayNum) {
  if ( dayNum > 365) {
    return -1;
  }
  return getDateFromDayNum(dayNum).getDay();
}

const getMonthNumFromDate = function (dayNum) {
  return getDateFromDayNum(dayNum).getMonth() + 1;
}




function App() {
  const [hoverInfo, setHoverInfo] = useState(null);

  const [selectedDay, setSelectedDay] = useState(0);

  const [layerVisibility, setLayerVisibility] = useState({
    ndvi: true,
    precipitation: false,
    temperature: false,
  });

  // TODO: we can add a visibility prop to each layer and assign it to the corresponding state -> layerVisibility
  const layer = [
    new GeoJsonLayer({
      id: "countiesLayer",
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
      id: "ndviLayer",
      data: geojsonData,
      stroked: true,
      visible: layerVisibility.ndvi,
      filled: true,
      pickable: true,
      getFillColor: (f) => {
        // Use the feature's properties to generate a color
        const hash = [...f.properties.name].reduce(
          (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
          0
        );
        return [hash & 0xff, (hash & 0xff00) >> 8, (hash & 0xff0000) >> 16];
      },
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 2,
      onHover: (info) => setHoverInfo(info),
    }),
    new HexagonLayer({
      data: monthlyPrecip[getMonthNumFromDate(selectedDay + 1)][getDayNumFromDate(selectedDay+1)],
      visible: layerVisibility.precipitation,
      getPosition: (d) => d.COORDINATES,
      getElevationWeight: (d) => d.precip,
      getColorWeight: (d) => d.precip,
      elevationScale: 300,
      radius: 12500,
      extruded: true,
      pickable: true,
      colorRange: [
        [255, 255, 204, 192],
        [199, 233, 180, 192],
        [127, 205, 187, 192],
        [65, 182, 196, 192],
        [44, 127, 184, 192],
        [37, 52, 148, 192],
      ],
      onClick: (info) => console.log(info),
    }),
  ];

  const hoverLayer =
    hoverInfo?.object &&
    new GeoJsonLayer({
      id: "HoverLayer",
      data: hoverInfo.object,
      stroked: true,
      filled: false,
      getLineColor: [255, 0, 0],
      lineWidthMinPixels: 4,
    });

  const INITIAL_VIEW_STATE = {
    longitude: -74.5,
    latitude: 43,
    zoom: 6,
    pitch: 45,
    bearing: 0,
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
      <div style={{ position: "relative", zIndex: 2 }}>
        <button onClick={() => setSelectedDay(selectedDay - 1)}>
          Previous Day
        </button>
        <button onClick={() => setSelectedDay(selectedDay + 1)}>
          Next Day
        </button>
        <span>
          Date: {getDateFromDayNum(selectedDay + 1).toDateString()}
        </span>
      </div>
      <DeckGL
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer, hoverLayer].filter(Boolean)}
        getTooltip={({ object }) =>
          object &&
          `Precip: ${object.elevationValue}, coordinates: ${object.position}`
        }
      />
      {hoverInfo && hoverInfo.object && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            pointerEvents: "none",
            left: hoverInfo.x,
            top: hoverInfo.y,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "4px",
              border: "1px solid #ccc",
            }}
          >
            {hoverInfo.object.properties.name} <br /> {hoverInfo.coordinate[0]},{" "}
            {hoverInfo.coordinate[1]}
          </div>
        </div>
      )}
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox defaultChecked onChange={() => handleChecked("ndvi")} />
          }
          label="NDVI"
        />
        <FormControlLabel
          control={<Checkbox onChange={() => handleChecked("precipitation")} />}
          label="Percipitation"
        />
        <FormControlLabel
          control={<Checkbox onChange={() => handleChecked("temperature")} />}
          label="Temperature"
        />
      </FormGroup>
    </div>
  );
}

export default App;