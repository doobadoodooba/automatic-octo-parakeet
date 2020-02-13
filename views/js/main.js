function clicked () {
	var user = document.getElementById('username');
	var pass = document.getElementById('password');

	var coruser = 'admin';
	var corpass = 'admin';

		if(user.value == coruser)  {

			if(pass.value == corpass) {

				window.alert("You are logged in " + user.value);


			}  else  {

				window.alert("Wrong username or password");

			}

		}  else {

			window.alert("Wrong username or password!");



		}
}
