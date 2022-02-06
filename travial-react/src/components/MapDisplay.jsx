import React, { useRef, useState, useEffect } from "react";
import makeAnimated from 'react-select/animated';
import Select from 'react-select'
import axios from 'axios'
import { VectorMap } from "react-jvectormap"
import { render } from "react-dom";
const { getCode, getName, getData } = require("country-list");

function MapDisplay({mapData, setMapData, displayMap, setDisplayMap}){
	function showRegionTip(e, tip, code){
		if(mapData[code]){
			tip[0]["innerText"] += `: ${mapData[code]}`
		}
	}

	function colorFunction(input){
		return (input/2)*(input/2)*(input/2)
	}

	function handleBack(e){
		e.preventDefault();

		setDisplayMap(false);
	}

	return(
		<div>
			<VectorMap
				map={"world_mill"}
				backgroundColor="transparent" // change it to ocean blue: #0077be
				zoomOnScroll={false}
				containerStyle={{
					width: "100%",
					height: "520px"
				}}
				onRegionTipShow={showRegionTip}
				containerClassName="map"
				regionStyle={{
					initial: {
					fill: "#e4e4e4",
					"fill-opacity": 0.9,
					stroke: "none",
					"stroke-width": 0,
					"stroke-opacity": 0
					},
					hover: {
					"fill-opacity": 0.8,
					cursor: "pointer"
					},
					selected: {
					fill: "none",
					stroke: "#ffffff", // color for the clicked country
					"stroke-width": 5
					},
					selectedHover: {}
				}}
				regionsSelectable={false}
				series={{
					regions: [
					{
						values: mapData, // this is the map data
						scale: ["#e4e4e4", "#146804"], // your color game's here
						normalizeFunction: {colorFunction}
					}
					]
				}}
			/>
			<input type="submit" onClick={handleBack} value="Back"/>
		</div>
		
	)
}

export default MapDisplay