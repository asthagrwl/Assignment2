var express = require('express');
var bodyParser = require('body-parser');
var morgan= require('morgan');
var config= require('./config');
var mongoose= require('mongoose');

var app=express();

mongoose.connect(config.database,function(err){
	if(err){
		console.log(err);
	}else{
		console.log("Connected to the database");
	}
});

mongoose.Promise = global.Promise

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

//to render all css or javacript or other files from public folder
app.use(express.static(__dirname + '/public'));

var api= require('./app/routes/api')(app,express);
app.use('/api',api);

app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/app/veiws/index.html');
});
app.listen(config.port, function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("Listning to port 3000");
	}
});

