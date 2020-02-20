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
const schema = new mongoose.Schema({ username: 'string', password: 'string', email: 'string' });
let Account = mongoose.model('Account', schema);


//Authentication Packages

app.use(session({
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
}))

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


//RegisterPage
app.get('/register',redirectHome, (req, res) => {
  res.render('register', { title: 'Hey', message: "hello" })
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
app.post('/register', (req, res) => {

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


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
