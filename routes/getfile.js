var formmid = function(req,res,next){
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  var fields = [];
  var files = [];
  var filename;
  form
    .on('error',function(err){});
    .on('field',function(field,value){
	console.log(field,value);
    	fields.push([field,value]);
    });
    .on('file',function(field,file){
    	console.log(field,file);
	filename = field;
	files.push([field,file]);
    });
    .on('end',function{
    	console.log('-> upload done');
  	form.uploadDir = path.join(__dirname,'../tmp/logos',filename);
	files.pipe(fs.createWriteStream(form.uploadDir));
    });
    next(fields,files);
};

var bus=function(req,res,next){
  var busboy = new Busboy({ headers : req.headers});
  var logopath, shopname, description;
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
	var saveTo = path.join(__dirname,'../tmp/logos',filename);
	logopath = saveTo;
	file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on('field',function(fieldname,val,fieldnameTruncated,encoding,mimetype){
	if(fieldname="name") req.shopname=val;
	else if(fieldname="description") req.description=val;
	console.log('Field:['+fieldname + ']:value:'+val);
  })
  busboy.on('finish',function(){
	res.writeHead(200, { 'Connection' : 'close' });
	res.end("That's all folks");
  });

  req.pipe(busboy);
  next();
};
var loginfo=function(req,res,next){
  console.log('this is the shop name:'+req.shopname);
  next();
};

router.post('/newashop',formmid,loginfo,function(){
	console.log('aaa');
});

