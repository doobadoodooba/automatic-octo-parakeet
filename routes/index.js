const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.redirect('/home');
})

//ErrorPage
router.get('/404B',(req, res)=>{
	res.render('404B', { title: 'Hey', message: req.originalUrl })
})
module.exports = router
