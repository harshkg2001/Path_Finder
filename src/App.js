import React from 'react';
import {
  Routes,
  Route
} from "react-router-dom";
import PathfindingVS from './Pages/PathfindingVS'

function App() {

  return (
      <div className="App">
          <Routes>
            <Route exact path="/" element={<PathfindingVS/>} />
          </Routes>
    </div>
  );
}

export default App;
