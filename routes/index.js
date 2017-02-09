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



MongoClient.connect(url, function(err, db) {
  if(err) return console.log(err);
  console.log("Connected successfully to server");
  mydb=db;
  var col = db.collection('usercollection');
  col.find({}).limit(2).toArray(function(err,docs){
    console.log('查询结果：',docs);
  });
});

router.get('/savetest',function(req,res){
	var collection=mydb.collection('usercollection');
	console.log('查找结果：',collection.find({}).toArray());
});

var findShops = function(req,res){
  var col = mydb.collection('shops');
  col.find({}).toArray(function(err,docs){
    	console.log(docs);
	req.shops=docs;
	console.log('shops的查询:',req.shops);
	res.render('index',{shops:req.shops});
  });
};

router.get('/',findShops);
router.get('/about',function(req, res){
  res.render('about',{'page.content':'about'});
});
router.get('/login',function(req,res){
  res.render('login',{	'usr':'username',
			'pwd':'password'});
});
router.get('/newshop',function(req,res){
  res.render('createShop'); 
  res.send('successdd'); 
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
});
module.exports = router;
