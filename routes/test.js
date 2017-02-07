var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({'test1':'aaaaaaaa','name':'royfang','pwd':'aba'});
});

module.exports = router;
