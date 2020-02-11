

var timerTime = setInterval(display_ct, 60000);

async function display_ct(){

		const api_url = `http://worldtimeapi.org/api/ip`;
		const response = await fetch(api_url);
		const json = await response.json();
		
		//geting api TIME data
		var str = json.utc_datetime
		var strh = json.utc_offset

		//formating data TIME
		var timeH = strh.substr(1,2);
		var timeM = str.substr(13,3);
		var timeA = str.substr(11,2);

		// converting into INT
		var convertH = parseInt(timeH);
		var convertA = parseInt(timeA);
		
		// adding hourOffset
		var hourT = convertA + convertH + timeM;

		

		// passing to html
		document.getElementById('headline').textContent = hourT;
		document.getElementById('text1').textContent = json.timezone;
		document.getElementById('text2').textContent = json.client_ip;
		//console.log(json);
		//display_c();
}

display_ct();
