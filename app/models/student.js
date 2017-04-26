var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentSchema = new Schema({

	rollNo: String,
	name: String,
	password: String,
	email: String,
	branch: String,
	pointer: Number
	
});

module.exports= mongoose.model('Student', StudentSchema);
