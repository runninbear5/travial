import logo from './travial.png';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import UserInput from './components/UserInput'
import MapDisplay from './components/MapDisplay'

function App() {
  const [mapData, setMapData] = useState(null);
  const [displayMap, setDisplayMap] = useState(false);
  console.log(process.env.URL );
  return (
    <div className="App">
      {/* <h2><p style="color:powderblue;"title="Travial">Insert Travel Criteria</p></h2> */}
      <div style={{height:'25px'}}></div>
      {/* <h2>Travial</h2> */}
      <img src={logo} width="150" height="150"/>
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
      <p><strong>Select the date, climate, and activities that you would like to do when you travel, and Travial will generate the best places for you to visit.</strong></p>
      </div>
      {!displayMap ? <UserInput mapData={mapData} setMapData={setMapData} setDisplayMap={setDisplayMap}/> : <MapDisplay mapData={mapData} setMapData={setMapData} displayMap={displayMap} setDisplayMap={setDisplayMap}/>}
    </div>
  );
}

export default App;