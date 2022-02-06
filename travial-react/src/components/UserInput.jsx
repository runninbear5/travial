import React, { useRef, useState, useEffect } from "react";
import makeAnimated from 'react-select/animated';
import Select from 'react-select'
import axios from 'axios'
const { getCode, getName, getData } = require("country-list");

function UserInput({mapData, setMapData, setDisplayMap}){
	var curDate = new Date();
	const offset = curDate.getTimezoneOffset()
	var yourDate = new Date(curDate.getTime() - (offset*60*1000))
	var dateInString = yourDate.toISOString().split('T')[0]

	const [startDate, setStartDate] = useState(dateInString)
	const [endDate, setEndDate] = useState(dateInString)
	const [weatherPref, setWeatherPref] = useState([])
	const [weatherPriority, setWeatherPriority] = useState(3)
    const [activities, setActivities] = useState({})

	const URL = "https://travial-flask.herokuapp.com/flask"
    // const [mapData, setMapData] = useState({})

	const options = [
		{ value: 'Hot', label: 'Hot' },
		{ value: 'Mild', label: 'Mild' },
		{ value: 'Cold', label: 'Cold' }
	]

	const animatedComponents = makeAnimated();
	  
	useEffect(()=>{
		axios.get(`${URL}/activities`).then(response => {
			var allActivities = {}
			response.data["activities"].forEach(act => {
				allActivities[act] = {"checked": false, "priority": 3}
			})

			setActivities(allActivities)
		});
		// setGetMessage(response)
		// }).catch(error => {
		// console.log(error)
		// })

	}, [])

	function handleStartDate(event){
		setStartDate(event.target.value)
	}

    function handleEndDate(event){
		setEndDate(event.target.value)
	}

    function handleWeatherPref(event){
		setWeatherPref(event.target.value)
	}

    function handleWeatherPriority(event){
		setWeatherPriority(event.target.value)
	}

	function handleActionChecked(event, act){
		var temp = {...activities}
		temp[act]["checked"] = !temp[act]["checked"]
		setActivities(temp)
	}

    function handleActionPriority(event, act){
		var temp = {...activities}
		temp[act]["priority"] = event.target.value
		setActivities(temp)
	}

	function handleMultiSelectChange(selectedOptions){
		var opts = []
		selectedOptions.forEach(option => {
			opts.push(option["value"])
		})
		setWeatherPref(opts)
	}

	function handleSubmit(e)	{
		e.preventDefault();
		
		var sendData = {};
		if(weatherPref.length !== 0){
			sendData["Weather"] = {"Pref": weatherPref, "Priority": parseInt(weatherPriority)}
		}else{
			sendData["Weather"] = {}
		}
		var sendAct = {};
		Object.keys(activities).forEach(act => {
			if(activities[act]["checked"]){
				sendAct[act] = parseInt(activities[act]["priority"])
			}
		})

		sendData["Activities"] = sendAct;
		var sDate = new Date(startDate);
		sendData["StartDate"] = sDate.toISOString();
		var eDate = new Date(endDate);
		sendData["EndDate"] = eDate.toISOString();

		axios.post(`${URL}/scores`, sendData).then(res => {
			var ct = res.data;
			var data = {};
			Object.keys(ct).forEach(c => {
				if(c === "Russia"){
					data["RU"] = ct[c]
				}else{
					data[getCode(c)] = ct[c];
				}
			})

			setMapData(data);
			setDisplayMap(true);
		});
		// console.log(acti);
		
		// axios.post
	}

	function handleClear(e){
		e.preventDefault();

		setMapData({})
		var curDate = new Date();
		const offset = curDate.getTimezoneOffset()
		var yourDate = new Date(curDate.getTime() - (offset*60*1000))
		var dateInString = yourDate.toISOString().split('T')[0]
		setStartDate(dateInString)
		setEndDate(dateInString)
		setWeatherPref([])
		var temp = {};
		Object.keys(activities).forEach(act => {
			temp[act] =  {"checked": false, "priority": 3}
		})
		setActivities({...temp})
		setWeatherPriority(3)
	}


	// HTML Code
	return(
		// <body style="background-color:powderblue;">
		// <h2><p style="color:powderblue;"title="Travial">Insert Travel Criteria</p></h2>
		// <h2>"Travial"</h2>
		<div>
			<div style={{height:'10px'}}></div>
			{/* Start and End Date */}
			Start Date: <input type="date" value={startDate} onChange={handleStartDate}/>
			<div style={{height:'10px'}}></div>
            End Date: <input type="date" value={endDate} onChange={handleEndDate}/>
			<div style={{height:'25px'}}></div>
			{/* Weather Preference and Priority */}
			<div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            Weather Preference: <Select	
									title={"Weather Hi Preference: "}
									closeMenuOnSelect={false}
									components={animatedComponents}
									isMulti
									options={options}
									onChange={handleMultiSelectChange}
									placeholder={"Select A Climate(s)..."}
									/>
			</div>
			<div style={{height:'10px'}}></div>
            Weather Priority: <input style={{width:"200px"}} min={1} max={5} type="number" value={weatherPriority} onChange={handleWeatherPriority}/>
			<div style={{height:'25px'}}></div>
			
			{/* Activities */}

            Activities: 
			{Object.keys(activities).map((act, index) => {	
				return(
					<div key={act}>
						<label  htmlFor={act}>{act}</label>
						<input  type="checkbox" checked={activities[act]["checked"]} onChange={(e) => handleActionChecked(e, act)} name={act}/>
						{activities[act]["checked"] ? 
							<div>
								{act} Priority: <input min={1} max={5} type="number" value={activities[act]["priority"]} onChange={(e) => handleActionPriority(e, act)}/>
							</div>
						:
							<div></div>
						}
					</div>
				)
			})}
			<div style={{height:'15px'}}></div>
			<input style={{marginRight:'5px'}} type="submit" onClick={handleSubmit} value="Submit"/>
			<input type="submit" onClick={handleClear} value="Clear"/>
		</div>
	)
}

export default UserInput
