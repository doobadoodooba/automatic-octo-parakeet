const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'pug')


app.get('/page2', function (req, res) {
	console.log(req);


  res.render('page2', { title: 'Hey', message: "hello" })
})

app.get('/*', function (req, res) {
	console.log(req);


  res.render('index', { title: 'Hey', message: req.originalUrl })
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

