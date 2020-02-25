const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('hello world')
})

//ErrorPage
router.get('/404B',(req, res)=>{
	res.render('404B', { title: 'Hey', message: req.originalUrl })
})
module.exports = router
