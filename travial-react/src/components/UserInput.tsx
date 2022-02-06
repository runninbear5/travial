import React, { useRef, useState, useEffect } from "react";
import makeAnimated from 'react-select/animated';
import Select, { InputActionMeta }  from 'react-select'
import axios from 'axios'

function UserInput(){
	var curDate = new Date();
	const offset = curDate.getTimezoneOffset()
	var yourDate = new Date(curDate.getTime() - (offset*60*1000))
	var dateInString = yourDate.toISOString().split('T')[0]

	const [startDate, setStartDate] = useState(dateInString)
	const [endDate, setEndDate] = useState(dateInString)
	const [weatherPref, setWeatherPref] = useState("")
	const [weatherPriority, setWeatherPriority] = useState(3)
    const [activities, setActivities] = useState({})

	const options = [
		{ value: 'Hot', label: 'Hot' },
		{ value: 'Mild', label: 'Mild' },
		{ value: 'Cold', label: 'Cold' }
	]

	const animatedComponents = makeAnimated();
	  

	useEffect(()=>{
		axios.get('http://localhost:5000/flask/activities').then(response => {
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

	function onInputChange = (
		inputValue: string,
		{ action, prevInputValue }: InputActionMeta
	  ) => {
		console.log(inputValue, action);
		switch (action) {
		  case 'input-change':
			return inputValue;
		  case 'menu-close':
			console.log(prevInputValue);
			let menuIsOpen = undefined;
			if (prevInputValue) {
			  menuIsOpen = true;
			}
			this.setState({
			  menuIsOpen,
			});
			return prevInputValue;
		  default:
			return prevInputValue;
		}
	  };

	return(
		<div>
			Start Date:<input type="date" value={startDate} onChange={handleStartDate}/>
			<div></div>
            End Date: <input type="date" value={endDate} onChange={handleEndDate}/>
            Weather Preference: <Select
									closeMenuOnSelect={false}
									components={animatedComponents}
									isMulti
									options={options}
									onInputChange={onInputChange()}
									/>
            Weather Priority: <input type="number" value={weatherPriority} onChange={handleWeatherPriority}/>
			<div></div>
            Activities: 
			{Object.keys(activities).map((act, index) => {
				return(
					<div key={act}>
						<label  htmlFor={act}>{act}</label>
						<input  type="checkbox" value={activities[act]["checked"]} onChange={(e) => handleActionChecked(e, act)} name={act}/>
						{activities[act]["checked"] ? 
							<div>
								{act} Priority: <input type="number" value={activities[act]["priority"]} onChange={(e) => handleActionPriority(e, act)}/>
							</div>
						:
							<div></div>
						}
					</div>
				)
			})}

		</div>
	)
}

export default UserInput
