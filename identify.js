var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var express = require('express');
var router= express.Router();
var identityKey = 'skey';

var identify=router.get('/',function(req,res,next){
		var sess=req.session;
		var loginUser = sess.loginUser;
		req.isLogined = !!loginUser;
		if(!req.isLogined) console.log(req.session);
		console.log(req.session.loginUser);
		next();
});


module.exports = identify;
