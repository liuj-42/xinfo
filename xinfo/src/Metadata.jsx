import { useNavigate } from "react-router-dom";

function Metadata() {
    const navigate = useNavigate();
    return (
      <div>
        <button onClick={() => navigate("/")}>Home</button>
        <h1>Geo-Vegetation Spatial Information Model</h1>
        <h2>Metadata</h2>
        <ul>
            <li>VegScape. Vegscape - vegetation condition explorer. URL: <a href="https://nassgeo.csiss.gmu.edu/VegScape/.7">https://nassgeo.csiss.gmu.edu/VegScape/.7</a> </li>
            <li>GPM DISC. GPM IMERG Late Precipitation. URL: <a href="https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGDL_06/summary?keywords=%22IMERG%20late%22">https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGDL_06/summary?keywords=%22IMERG%20late%22</a></li>
        </ul>
      </div>
    );
  }
  
  export default Metadata;