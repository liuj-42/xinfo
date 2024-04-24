import { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import geojsonData from "./assets/new-york-counties.json";
import { HexagonLayer } from "deck.gl";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Link } from "react-router-dom";
// Date Selector
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// Banner
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import "./App.css";

import precip01 from "./assets/merged-01.json";
import precip02 from "./assets/merged-02.json";
import precip03 from "./assets/merged-03.json";

import ndvi01 from "./assets/ndvi_202301.json";
import ndvi02 from "./assets/ndvi_202302.json";
import ndvi03 from "./assets/ndvi_202303.json";

const linkList ={
  "precip": [
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/new_precip/merged-04.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/new_precip/merged-05.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/new_precip/merged-06.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/new_precip/merged-07.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/new_precip/merged-08.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/new_precip/merged-09.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/new_precip/merged-10.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/new_precip/merged-11.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/new_precip/merged-12.json"
  ],
  "ndvi": [
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/ndvi_monthly/ndvi_202304.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/ndvi_monthly/ndvi_202305.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/ndvi_monthly/ndvi_202306.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/ndvi_monthly/ndvi_202307.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/ndvi_monthly/ndvi_202308.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/ndvi_monthly/ndvi_202309.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/ndvi_monthly/ndvi_202310.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/ndvi_monthly/ndvi_202311.json",
    "https://xinfo-storage.s3.us-east-2.amazonaws.com/ndvi_monthly/ndvi_202312.json"
  ]

}

const colorRanges = {
  precipitation: [
    [255, 255, 204, 192],
    [199, 233, 180, 192],
    [127, 205, 187, 192],
    [65, 182, 196, 192],
    [44, 127, 184, 192],
    [37, 52, 148, 192],
  ],
  ndvi: [
    [105, 0, 99],
    [227, 0, 89],
    [232, 21, 0],
    [247, 100, 0],
    [244, 161, 0],
    [0, 172, 105],
  ],
};



function Home() {
  const [hoverInfo, setHoverInfo] = useState(null);
  const [monthlyPrecip, setMonthlyPrecip] = useState({ 1: precip01, 2: precip02, 3: precip03});
  const [monthlyNdvi, setMonthlyNdvi] = useState({ 1: ndvi01, 2: ndvi02, 3: ndvi03});

  const [layerVisibility, setLayerVisibility] = useState({
    ndvi: true,
    precipitation: true,
  });

  const [currentDate, setCurrentDate] = useState(dayjs("2023-01-01"));
  const [stringDate, setStringDate] = useState(currentDate.format("YYYYMMDD"));
  const [currentMonth, setCurrentMonth] = useState(currentDate.month() + 1);
  const [loaded, setLoaded] = useState(3);


  async function loadFromURLS() {

    let tempMonthlyPrecip = {...monthlyPrecip};
    let tempMonthlyNdvi = {...monthlyNdvi};


    for (let i of (linkList.precip).keys()) {
      const precipUrl = linkList.precip[i];
      const NDVIUrl = linkList.ndvi[i];
      const responseNDVI = await fetch(NDVIUrl);
      const responsePrecip = await fetch(precipUrl);
      const dataNDVI = await responseNDVI.json();
      const dataPrecip = await responsePrecip.json();
      tempMonthlyNdvi[i + 4] = dataNDVI;
      tempMonthlyPrecip[i + 4] = dataPrecip;
      setMonthlyNdvi({ ...monthlyNdvi, [i + 4]: dataNDVI });
      setMonthlyPrecip({ ...monthlyPrecip, [i + 4]: dataPrecip });
      setLoaded(i + 4);
    }
    setMonthlyNdvi(tempMonthlyNdvi);
    setMonthlyPrecip(tempMonthlyPrecip);
    setLoaded(12);
  }

  useEffect(() => {
    // loadData().then(({ monthlyPrecip, monthlyNDVI }) => {
    //   setMonthlyPrecip(monthlyPrecip);
    //   setMonthlyNdvi(monthlyNDVI);
    //   console.log("loaded data");
    //   setLoaded(true);
    // });
    loadFromURLS();
  }, []);

  // TODO: we can add a visibility prop to each layer and assign it to the corresponding state -> layerVisibility
  const layer = [
    new GeoJsonLayer({
      id: "baseLayer",
      data: geojsonData,
      stroked: true,
      visible: true,
      filled: true,
      pickable: true,
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
      id: "ndviLayer",
      data: monthlyNdvi[currentMonth][stringDate],
      visible: layerVisibility.ndvi,
      aggregation: "SUM",
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: (d) => d.ndvi,
      radiusPixels: 30,
      colorRange: colorRanges.ndvi,
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
      colorRange: colorRanges.precipitation,
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
    setStringDate(newDate);
    setCurrentMonth(newValue.month() + 1);
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
      mode: "dark",
      primary: {
        main: "#1976d2",
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
                <Typography variant="h6" sx={{ margin: "auto" }}>
                  Geo-Vegetation Spatial Information Model
                </Typography>
                <Typography variant="h6">
                  <Link to="/Metadata" style={{ color: "white" }}>
                    Metadata
                  </Link>
                </Typography>
              </Toolbar>
            </AppBar>
          </ThemeProvider>
        </Box>
      </div>
      
      {/* progess bar for loading data (based off of the value of loading) */}
      {loaded < 12 && (
        <div className="progress">
          <h1>Loading Data...</h1>
          <progress max="12" value={loaded}></progress>
        </div>
      )}


      <Card
        variant="outlined"
        sx={{
          width: "20em",
          height: "13em",
          background: "white",
          position: "relative",
          zIndex: 2,
        }}
      >
        <CardContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker", "DatePicker"]}
              sx={{ marginLeft: "1em", marginBottom: "1em" }}
            >
              <DatePicker
                label="Date"
                minDate={dayjs("2023-01-01")}
                maxDate={dayjs(`2023-${loaded}-31`)}
                value={currentDate}
                onChange={(newValue) => handleDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
          <FormGroup sx={{ marginLeft: "1em" }}>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  onChange={() => handleChecked("ndvi")}
                />
              }
              label="NDVI"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  onChange={() => handleChecked("precipitation")}
                />
              }
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
      {Object.values(layerVisibility).some((v) => v) && (
        <div className="legend-container">
          <div className="legends">
            {layerVisibility.ndvi && (
              <Legend
                colorRange={colorRanges.ndvi}
                units=""
                title="NDVI"
                max={Math.max(
                  ...monthlyNdvi[currentMonth][stringDate].map((d) => d.ndvi)
                )}
              />
            )}
            {layerVisibility.precipitation && (
              <Legend
                colorRange={colorRanges.precipitation}
                units="mm"
                title="Precipitation"
                max={Math.max(
                  ...monthlyPrecip[currentMonth][stringDate].map(
                    (d) => d.precip
                  )
                )}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import "./Legend.css";
function Legend({ colorRange, max, units, title }) {
  return (
    <div className="legend">
      <h4 style={{ margin: "0", "fontFamily": '"Roboto","Helvetica","Arial",sans-serif'}}>
        {title} {units && `(${units})`}
      </h4>
      {colorRange.map((color, index) => {
        return (
          <div key={index} className="legend-row">
            <div
              style={{
                background: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                width: "20px",
                height: "20px",
                margin: "5px",
              }}
            ></div>
            <p style={{"fontFamily": '"Roboto","Helvetica","Arial",sans-serif'}}>{`${((max / colorRange.length) * index).toFixed(3)}`}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
