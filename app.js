if(process.env.NODE_ENV !=='production'){
	require('dotenv/config')
}
// time until session expires
const TWO_HOURS = 1000 * 60 * 60 * 2

// SetsPort
const port2 =  3000
const port = process.env.PORT || 4000
const{
	SESS_SECRET = process.env.SESSION_SECRET,
	SESS_LIFETIME = TWO_HOURS,
	SESS_NAME = 'sid',
} = process.env

//required
const express = require('express')
const app = express()
const indexRouter = require('./routes/index')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const flash =require('express-flash')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const http = require('http').Server(app);
const io = require('socket.io')(http);
http.listen(port2, () => console.log(`SOCKET IO listening on port ${port2}!`))

//adding  sessionmiddleware
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});



// SET and USE
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use(express.static('public'))
app.use('/', indexRouter)
app.use(express.urlencoded({ extended: false })) //necessary for POST
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.use(cookieParser());



//mongoose
mongoose.connect(process.env.DATABASE_URL,{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('MONGOOSE OK!'))

//mongos DB creater
const schema = new mongoose.Schema({ username: 'string', password: 'string', email: 'string' });
let Account = mongoose.model('Account', schema);


//Authentication Packages
const sessionMiddleware = session({
	key: 'user_sid',
	secret: SESS_SECRET,
	resave: false,
	saveUnitialized: false,
	name : SESS_NAME,
	cookie: {
		path    : '/',
		secure: false, // resets ID every request
		maxAge: SESS_LIFETIME,
		sameSite: true, //strict
	}
})

app.use(sessionMiddleware)

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

//redirect login when email does not exist
const redirectLogin = (req, res, next) =>{
  if(!req.session.email || !req.session.email.length ){
      res.redirect('/Login');
  }
  else{
    next();
  }
};

// redirect home when email exists
const redirectHome = (req, res, next) =>{
	if(req.session.email){
			res.redirect('/home');
	}
	else{
		next();
	}
}

//__________________________________________________________________
//linking

//time api
app.get('/api/time', (req, res) => {
	res.send({currentTime: Date.now()});
})

//timer page
app.get('/page2', redirectLogin, (req, res) => {
	console.log(req.isAuthenticated())
  res.render('page2', { title: 'Hey', message: "hello" })
})

//HomePage
app.get('/home', redirectLogin, (req, res) => {
	//console.log('session object : '+ JSON.stringify(req.session))
	//console.log(req.session.user);
  res.render('home', { title: 'Hey', message: "hello", user: req.session.user, email: req.session.email })
})

//profil
app.get('/profil', redirectLogin, (req, res) => {
	//console.log(req.session.user);
  res.render('profil', { title: 'Hey', message: "hello", user: req.session.user, email: req.session.email })
})

//chat
app.get('/Chat', redirectLogin, (req, res) => {

	res.render('Chat', { title: 'Hey', message: "hello", user: req.session.user, email: req.session.email })
})

//RegisterPage
app.get('/Register',redirectHome, (req, res) => {
  res.render('Register', { title: 'Hey', message: "hello" })
})

//LoginPage
app.get('/Login',redirectHome, (req, res) => {
  res.render('Login', { title: 'Hey', message: req.originalUrl })
})


// Logout
app.get('/logout', redirectLogin, (req, res) => {
	req.session.destroy(err =>{
		if(err){
			return res.redirect('/home')
		}

		res.clearCookie(SESS_NAME)
		res.redirect('/Login')
	})
})

//defoultPage
app.get('/*', (req, res) => {

})

//__________________________________________________________________

//loginUser

app.post('/Login', (req, res) => {

try{
	var username = req.body.username;
	var password = req.body.password;

	const p = password.toString();

 Account.findOne({ username: username }, function(err, user){
	 if (err) return handleError(err);

	 if(!user){

		 //return res.status(401).json({ msg: "Wrong username" })
		 console.log('LOGIN NOT FOUND ' + user)
	 }else{

		 let daEmail = user.email
		 let daUser = user.username
		 req.session.user = daUser;

		 console.log(' Email : ' + daEmail)
		 req.session.email = daEmail;

		 // password decrypting
		 bcrypt.compare(password, user.password, (err, data) => {
 			 if (err) throw err

 			 if (data) {
 					 //return res.status(200).json({ msg: "Login success" })
 					 res.redirect('/home')
 			 } else {
 					 //return res.status(401).json({ msg: "Invalid credencial" })
 			 }
 	 })
	}
})
} catch(e){
	//res.redirect('/Login')
	console.log('LOGIN FAIL ')
	console.log(e);
}


})

//registerUser
app.post('/Register', (req, res) => {

		try{
			//getsUserPAGE
			var usernameHT = req.body.username;

			//findsUserDatabase
			Account.findOne({ username: usernameHT },async function(err, user){
		 	 if (err) throw error

		 	 if(user){

				 //UserIsExisting
		 		 console.log('USER  : ' + user.username + ' ALREADY EXISTING')
				}

				if(!user){
						//NOUserAction

						//converting
						var password = req.body.password;
						const p = password.toString();

						//hashmagic
						const	hashedPassword = await bcrypt.hash(p, 10, function(err,hash){
							if(err) throw err;

							//creates account in db
							new Account({email: req.body.email, password: hash, username: req.body.username}).save(function (err, res) {
								if (err) return handleError(err)
								console.log(err)
							})

							//registration complete
							console.log('register success')
							res.redirect('/Login')
							let newSession = req.session;
							newSession.email = req.body.email;
						})
					}
		})
		} catch (e){
			return res.status(200).json({ msg: "REGISTRATION FAIL" })
			console.log('register FAIL')
			console.log(e);
		}
})

//chat


io.on('connection', socket =>{
	 socket.request.session


	socket.on('updateList', number =>{
			const connectedUsers = Object.keys(io.sockets.connected).map(function(socketId) {
			return { socket_username: io.sockets.connected[socketId].request.session.user };
			});


		const connecters = JSON.stringify(connectedUsers)
		const connectem = JSON.parse(connecters)

		//getting time
		const now = new Date();
		const epoch_millis = now.getTime();


		var utcSeconds = epoch_millis;
		var str = new Date(utcSeconds);

		//convertsToString
		var s = str.toString();

		//formating data TIME
		var timeS = s.substr(16,5);
		var TDate = s.substr(0,15);

		socket.emit('updateUsersList', {number:
		io.engine.clientsCount, user: connectedUsers, time: timeS})

	})


	 socket.on('new-user', name =>{
	 	socket.request.session.user = name
	 	socket.broadcast.emit('user-connected', name)
	 })


	socket.on('send-chat-message', message =>{

		const now = new Date();
		const epoch_millis = now.getTime();
		//console.log(epoch_millis)

		var utcSeconds = epoch_millis;
		var str = new Date(utcSeconds);

		//convertsToString
		var s = str.toString();

		//formating data TIME
		var timeS = s.substr(16,5);
		var TDate = s.substr(0,15);

		socket.broadcast.emit('chat-message', {message: message, name:
		socket.request.session.user, time: timeS}) // broadcasting message
	})


	socket.on('disconnect', () =>{
		socket.broadcast.emit('user-disconnected', socket.request.session.user)

	 	//delete socket.request.session.user

	})

	socket.on('time', time =>{
		const now = new Date();
		const epoch_millis = now.getTime();
		console.log(epoch_millis)
		socket.emit('datime', {time: epoch_millis})
	})

	// socket.on('typing', (name) =>{
	// 	socket.broadcast.emit('typing', name)
	// })

	// socket.on('reconnect', name =>{
	// 	users[socket.id] = name
	// 	socket.broadcast.emit('reconnect-user', name)
	// })


})


app.listen(port, () => console.log(`SERVER listening on port ${port}!`))
