import { useState } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import geojsonData from "./assets/new-york-counties.json";
import { HexagonLayer } from "deck.gl";
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link } from 'react-router-dom';
// Date Selector
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// Banner
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import precip01 from "./assets/new_precip/merged-01.json";
import precip02 from "./assets/new_precip/merged-02.json";
import precip03 from "./assets/new_precip/merged-03.json";
import precip04 from "./assets/new_precip/merged-04.json";
import precip05 from "./assets/new_precip/merged-05.json";
import precip06 from "./assets/new_precip/merged-06.json";
import precip07 from "./assets/new_precip/merged-07.json";
import precip08 from "./assets/new_precip/merged-08.json";
import precip09 from "./assets/new_precip/merged-09.json";
import precip10 from "./assets/new_precip/merged-10.json";
import precip11 from "./assets/new_precip/merged-11.json";
import precip12 from "./assets/new_precip/merged-12.json";

import ndvi01 from "./assets/ndvi_monthly/ndvi_202301.json";
import ndvi02 from "./assets/ndvi_monthly/ndvi_202302.json";
import ndvi03 from "./assets/ndvi_monthly/ndvi_202303.json";
import ndvi04 from "./assets/ndvi_monthly/ndvi_202304.json";
import ndvi05 from "./assets/ndvi_monthly/ndvi_202305.json";
import ndvi06 from "./assets/ndvi_monthly/ndvi_202306.json";
import ndvi07 from "./assets/ndvi_monthly/ndvi_202307.json";
import ndvi08 from "./assets/ndvi_monthly/ndvi_202308.json";
import ndvi09 from "./assets/ndvi_monthly/ndvi_202309.json";
import ndvi10 from "./assets/ndvi_monthly/ndvi_202310.json";
import ndvi11 from "./assets/ndvi_monthly/ndvi_202311.json";
import ndvi12 from "./assets/ndvi_monthly/ndvi_202312.json";

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
const monthlyNdvi = {
  1: ndvi01,
  2: ndvi02,
  3: ndvi03,
  4: ndvi04,
  5: ndvi05,
  6: ndvi06,
  7: ndvi07,
  8: ndvi08,
  9: ndvi09,
  10: ndvi10,
  11: ndvi11,
  12: ndvi12,
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

function Home() {
  const [hoverInfo, setHoverInfo] = useState(null);

  const [selectedDay, setSelectedDay] = useState(0);

  const [layerVisibility, setLayerVisibility] = useState({
    ndvi: true,
    precipitation: true,
  });

  const [currentDate, setCurrentDate] = useState(dayjs('2023-01-01'));
  const [stringDate, setStringDate] = useState(currentDate.format("YYYYMMDD"));
  const [currentMonth, setCurrentMonth] = useState(currentDate.month()+1);

  // TODO: we can add a visibility prop to each layer and assign it to the corresponding state -> layerVisibility
  const layer = [
    new GeoJsonLayer({
      id: "baseLayer",
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
      id: "countyLayer",
      data: geojsonData,
      stroked: true,
      visible: false,
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
    new HeatmapLayer({
      id: 'ndviLayer',
      data: monthlyNdvi[currentMonth][stringDate],
      visible: layerVisibility.ndvi,
      aggregation: 'SUM',
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: (d) => d.ndvi,
      radiusPixels: 30,
      colorRange: [[0, 172, 105], [244, 161, 0], [247, 100, 0], [232, 21, 0], [227, 0, 89], [105, 0, 99]],
      opacity: 0.7,
    }),   
    new HexagonLayer({
      data: monthlyPrecip[currentMonth][stringDate],
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
      opacity: 0.4,
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
    longitude: -75.5,
    latitude: 43.5,
    zoom: 6,
    pitch: 45,
    bearing: 0,
  };

  const handleDate = (newValue) => {
    setCurrentDate(newValue);
    const newDate = newValue.format("YYYYMMDD");
    console.log(newDate);
    setStringDate(newDate);
    console.log(newValue.month()+1);
    setCurrentMonth(newValue.month()+1);
  };

  // control layer visibility
  const handleChecked = (layer) => {
    setLayerVisibility({
      ...layerVisibility,
      [layer]: !layerVisibility[layer],
    });
  };
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });
  return (
    <div>
      <div style={{ position: "relative", zIndex: 2, marginBottom: "1.5em" }}>
        <Box sx={{ flexGrow: 1 }}>
        <ThemeProvider theme={darkTheme}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Precip-Vegetation Spatial Information Model
              </Typography>
              <Typography variant="h6"><Link to="/Metadata" style={{color: "white"}}>Metadata</Link></Typography>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        </Box>
      </div>
      
      <Card variant="outlined" sx={{width: "20em", height: "13em", background: "white", position: "relative", zIndex: 2,}}>
        <CardContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']} sx={{marginLeft: "1em", marginBottom: "1em"}}>
              <DatePicker
                label="Date"
                minDate={dayjs('2023-01-01')}
                maxDate={dayjs('2023-12-31')}
                value={currentDate}
                onChange={(newValue) => handleDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
          <FormGroup sx={{marginLeft: "1em"}}>
            <FormControlLabel
              control={
                <Checkbox defaultChecked onChange={() => handleChecked("ndvi")} />
              }
              label="NDVI"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked onChange={() => handleChecked("precipitation")} />}
              label="Precipitation"
            />
          </FormGroup>
        </CardContent>
      </Card>

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
      
    </div>
  );
}

export default Home;