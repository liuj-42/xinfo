import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Home';
import Metadata from './Metadata';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/metadata" element={<Metadata />}></Route>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;