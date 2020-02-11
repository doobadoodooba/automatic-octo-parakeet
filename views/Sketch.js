// TimeFunction
function displayTime(){
	$.get( "/api/time", function( data ) {
		 
		 //GettingApi
		 var utcSeconds = data.currentTime;
		 var str = new Date(utcSeconds); 
         
		 //convertsToString
		 var s = str.toString();

		 //formating data TIME
		 var time = s.substr(16,5);
		 var TDate = s.substr(0,15);

		 // passing to html
		 document.getElementById('headline').innerHTML = time;
		 document.getElementById('text1').innerHTML = TDate;

	});	
	setInterval(displayTime, 10000);
}
displayTime();
