

function clicked () {
	//var db = "mongodb://localhost:27017/TestUserdb";


	var user = document.getElementById('username');
	var pass = document.getElementById('password');

	var corpass = db.characters.find({name: 'username' });
	//var coruser = db.collection('characters').find({'name': 'username'});
	var corpass = db.characters.find({password: 'hashedPassword' });

		if(user.value == coruser)  {

			if(pass == corpass) {
			//if(await bcrypt.compare(password, hashedPassword)) {

				window.alert("You are logged in " + user.value);


			}  else  {

				window.alert("Wrong username or password");

			}

		}  else {

			window.alert("Wrong username or password!");



		}
}
