var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/about',function(req, res){
  res.render('about',{'page.content':'about'});
});
router.get('/login',function(req,res){
  res.render('login',{	'usr':'username',
			'pwd':'password'});
})
module.exports = router;
