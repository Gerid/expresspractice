var express = require('express');
var path = require('path');
var os = require('os');;
var router = express.Router();
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient
    ,assert = require('assert');
var mydb;
var url = 'mongodb://localhost:27017/nodetest2';
/* GET home page. */
var multer = require('multer')
var moment = require('moment')


MongoClient.connect(url, function(err, db) {
  if(err) return console.log(err);
  console.log("Connected successfully to server");
  mydb=db;
});

router.get('/savetest',function(req,res){
	var collection=mydb.collection('usercollection');
	console.log('查找结果：',collection.find({}).toArray());
});

router.get('/makeorder',function(req,res){
	res.render('makeorder',{time:moment().format()});
});

var findShops = function(req,res){
  var col = mydb.collection('shops');
  if(req.isLogined)
 	 col.find({}).toArray(function(err,docs){
 	   	console.log(docs);
 	       req.shops=docs;
 	       console.log('shops的查询:',req.shops);
 	       res.render('index',{shops:req.shops});
 	 });
  else res.render('about');
};

router.get('/',findShops);
router.get('/about',function(req, res){
  res.render('about',{'page.content':'about'});
});
router.get('/login',function(req,res){
  res.render('login',{	'usr':'username',
			'pwd':'password'});
});
router.post('/login',function(req,res){
  var users = mydb.collection('users');
  users.find({accountID:req.body.accountID,pwd:req.body.pwd}).toArray(function(err,result){
	if(err) return res.json({ret_code:2,ret_msg:"login failed"});
		if(!!result[0]){
			req.session.loginUser = result[0].accountID;
			console.log('login success ' , result[0].accountID);
			res.json({ret_code:0 , ret_msg:'login success'});
		}
		else res.json({ret_code:1,ret_msg:'wrong user/pwd'});
	});
});
router.post('/makeorder',function(req,res){
	var users = mydb.collection('users');
	var buyer = req.body.buyer;
	var seller = req.body.seller;
	var goodname = req.body.goodname;
	var price = req.body.price;
	var amount = req.body.amount;
	var total = 0; 
	console.log('插入',req.body.buyer);
	total+=price*amount;	
	var orders = mydb.collection('ordertest');
	orders.insertOne({seller:seller,buyer:buyer,goodname:goodname,price:price,amount:amount,total:total},function(){
		orders.find({seller:seller}).toArray(function(err,result){
			console.log('insert order success:',result);
		});
	});
    return res.json({'ret_msg':"提交订单成功"});
	
	
	
});
router.get('/newshop',function(req,res){
  res.render('createShop'); 
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+'/../tmp/logos');    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.originalname);  
    }
});
var uploadlogos = multer({storage: storage})
router.post('/newashop',uploadlogos.single('logo'),function(req,res,next){
	console.log(req.body.name);
	mydb.collection('shops').insertOne({shopname:req.body.name,description:req.body.description,shoplogo:'/tmp/logos/'+req.file.filename},function(){
	console.log('传入数据库成功');
	});
	console.log('aaa');
    return res.json({"ret_msg":"创建商店成功"});
});

router.get('/transfer',function(req,res){
	res.render('transfer',{user:req.session.loginUser});
});
router.post('/transfer',function(req,res){
	var users=mydb.collection('users');
	var number=req.body.total.valueOf();
	console.log("转账金额",number);
	users.updateOne({accountID:req.session.loginUser},{$inc:{"rest":-1*parseInt(number)}},function(err,r){
	  if(err)console.log('修改失败',err);
	});
	users.updateOne({accountID:req.body.user2},{"$inc":{rest:parseInt(number)}},function(err,r){
	  if(err)console.log('修改失败',err);
		});
	return res.json({ret_msg:"转账成功"});
});

router.get('/adduser',function(req,res){
	res.render('adduser');
});
router.post('/adduser',function(req,res){
	console.log('正在添加用户信息')
	mydb.collection('users').insertOne({
		accountID :req.body.accountID,
		pwd	  :req.body.pwd,
		phone	  :req.body.phone,
		email	  :req.body.email,
		rest	  :req.body.rest
		});
	console.log(req.body.name);
    return res.json({"ret_msg":"add user success!"});
});

module.exports = router;
