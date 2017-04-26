var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ApplicationSchema = new Schema({

	rollNo: String,
	email: String,
	branch: String,
	pointer: Number,
	position: String,
	companyName: String,
	comapanyId: String
});

module.exports= mongoose.model('Application', ApplicationSchema);
