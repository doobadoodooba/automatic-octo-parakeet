if(process.env.NODE_ENV !=='production'){
	require('dotenv/config')
}

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


// time until session expires
const TWO_HOURS = 1000 * 60 * 60 * 2

// SetsPort
const port = process.env.PORT || 3000
const{
	SESS_SECRET = process.env.SESSION_SECRET,
	SESS_LIFETIME = TWO_HOURS,
	SESS_NAME = 'sid',
} = process.env

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
db.once('open', () => console.log('Connected to Mongoose'))

//mongos DB creater
var schema = new mongoose.Schema({ username: 'string', password: 'string', email: 'string' });
var Account = mongoose.model('Account', schema);


//Authentication Packages

app.use(session({
	key: 'user_sid',
	secret: SESS_SECRET,	//'qfköskfep3wüer', // needs random generator
	resave: false,
	saveUnitialized: false,
	name : SESS_NAME,
	cookie: {
		path    : '/',
		secure: false, // resets ID every request
		maxAge: SESS_LIFETIME,
		sameSite: true, //strict
	}
}))

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/1');
    } else {
        next();
    }
};

const redirectLogin = (req, res, next) =>{
  if(!req.session.email || !req.session.email.length  || DaEmail == false){
      res.redirect('/Login');
  }
  else{
    next();
  }
};

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
app.get('/api/time', function(req, res){
	res.send({currentTime: Date.now()});
})

//timer page
app.get('/page2', redirectLogin, (req, res) => {
	console.log(req);
	console.log(req.isAuthenticated())
  res.render('page2', { title: 'Hey', message: "hello" })
})

//HomePage
app.get('/home', redirectLogin, sessionChecker, function (req, res) {
	console.log('session object : '+req.session)

	const DaEmail = req.session	//email
	const DaUser = req.session // username

	console.log(req.session.user);
	console.log(req.isAuthenticated())
	/*res.send(`
			<h1>WIllcome to my page ${req.session.user} </h1>
			<a href="/2">Next</a>
			<a href="/logout">Logout</a>

		`)*/
  res.render('home', { title: 'Hey', message: "hello" })
})

//profil
app.get('/profil', redirectLogin, sessionChecker, function (req, res) {
	console.log('session object : '+req.session)

	const DaEmail = req.session	//email
	const DaUser = req.session // username

	console.log(req.session.user);
	console.log(req.isAuthenticated())
	/*res.send(`
			<h1>WIllcome to my page ${req.session.user} </h1>
			<a href="/2">Next</a>
			<a href="/logout">Logout</a>

		`)*/
  res.render('profil', { title: 'Hey', message: "hello" })
})


//RegisterPage
app.get('/register',redirectHome, function (req, res) {
	console.log(req);
  res.render('register', { title: 'Hey', message: "hello" })
})

//LoginPage
app.get('/Login',redirectHome, function (req, res) {



  res.render('Login', { title: 'Hey', message: req.originalUrl })
})

//dummyPage 1
app.get('/1', redirectLogin, function (req, res) {
if(!req.session.id && req.session.user && req.cookies.user_sid){

	res.send(`
			<h1>no ID </h1>

		`)
}else {
	console.log('Cookies: ', req.cookies)
	console.log('Signed Cookies: ', req.signedCookies)
	res.send(`
			<h1>HAS ID</h1>
				<h2>ID session : ${req.session.id}</h2>

		`)
}

})

//dummyPage 2
app.get('/2', redirectLogin,(req, res) => {
	sess = req.session


	if (req.session.user && req.cookies.user_sid) {
		console.log('Cookies: ', req.cookies)
		console.log('Signed Cookies: ', req.signedCookies)
		res.send(`
				<h1>MainTest </h1>
				<h2> ID session : ${req.session.id}</h2>
				<h3>ID cookie : ${req.cookies}</h3>
				<a href="/logout">Logout</a>

			`)
	}
	if(!req.session.id){
		console.log('Cookies: ', req.cookies)
		console.log('Signed Cookies: ', req.signedCookies)
		res.send(`
				<h1>NOt WORKING </h1>
				<h1>Gosh </h1>
					<h3>ID cookie : ${req.cookies}</h3>
					<a href="/logout">Logout</a>

			`)
	} else {
		console.log('Cookies: ', req.cookies)
		console.log('Signed Cookies: ', req.signedCookies)
		//res.clearCookie('user_sid')
		res.send(`

					<h3>ID cookie :  ${req.session.cookie}</h3>
					<h1>MainTest2 </h1>
						<h2>ID session : ${req.session.id}</h2>
						<h2>ID USER : ${req.session.user}</h2>
						<h2>ID USER : ${req.session.email}</h2>
						<a href="/logout">Logout</a>

			`)
	}
	console.log(req.session.id)

})

// Logout
app.get('/logout', redirectLogin, (req, res)=>{
	req.session.destroy(err =>{
		if(err){
			return res.redirect('/home')
		}

		res.clearCookie(SESS_NAME)
		res.redirect('/Login')
	})
})

//defoultPage
app.get('/*', function (req, res) {
	console.log(req);
  //res.render('index', { title: 'Hey', message: req.originalUrl })
	res.send(`
			<h1>WOW </h1>

		`)

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
		 //res.redirect('/login')
		 /*res.send(`<center><p >user not found </p><br>
			 		<a href="/Login">back</a>
					</center>
			 `)*/
		 //window.alert('wrong')
		 //return res.status(401).json({ msg: "Wrong username" })
		 console.log('LOGIN NOT FOUND ' + user)
	 }else{

		 DaEmail = user.email
		 DaUser = user.username
		 req.session.user = user.username;
		 //user.email = req.session.userId
		 console.log(' Email : ' + DaEmail)
		 req.session.email = DaEmail;
		 // password decrypting
		 console.log('LOGIN USERPASS....')
		 console.log(password)
			bcrypt.hash(password, 10, function(err, hash) { //does nothing lol
	    		if (err) { throw (err); }

					console.log(hash)
					console.log(user.password)

					bcrypt.compare(password, user.password, (err, data) => {
						 //if error than throw error
						 if (err) throw err

						 //if both match than you can do anything
						 if (data) {
								 //return res.status(200).json({ msg: "Login success" })

								 //req.session.user = user.dataValues;
								 res.redirect('/home')
						 } else {
							 		DaEmail = false
							 		//res.redirect('/login')
								 //return res.status(401).json({ msg: "Invalid credencial" })
								/* res.send(`<center><p >WRONG PASSWORD </p><br>
									 		<a href="/Login">back</a>
											</center>
									 `)*/
						 }

				 })
			});
	}
})
} catch(e){
	//res.redirect('/Login')
	console.log('LOGIN FAIL ' + user + pass)
	console.log(e);
}


})

//registerUser
app.post('/register', (req, res) => {


		try{
			//getsUserPAGE
			var usernameHT = req.body.username;
			//findsUserDatabase
			Account.findOne({ username: usernameHT },async function(err, user){
		 	 if (err) throw error

			 //USER found!
		 	 if(user){
				/* res.send(`<center><p >USER ALREADY EXISTING </p><br>
					 		<a href="/register">back</a>
							</center>
					 `)*/
				 //return res.status(200).json({ msg: "USER ALREADY EXISTING" })
				 //res.redirect('/register')
		 		 console.log('USER  : ' + user.username + ' ALREADY EXISTING')
				}
				//NOUserAction
				if(!user){
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

								//req.session.user = res.dataValues;
								console.log('register success')
								/*res.send(`<center><p >REGISTER COMPLETE </p><br>
					 			 		<a href="/Login">Login</a>
					 					</center>
					 			 `)*/
							res.redirect('/Login')
							let newSession = req.session;
							newSession.email = req.body.email;
						})
					}
		})

		} catch (e){
			return res.status(200).json({ msg: "REGISTRATION FAIL" })
			//res.redirect('/register')
			console.log('register FAIL')
			console.log(e);
		}


})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
