var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PositionSchema = new Schema({

	companyId: { type: Schema.Types.ObjectId, ref: 'Company'},
	position: String,
	salary: Number,
	companyName: String,
	cutoff: Number,
	selectionProcedure: String
	
});

module.exports= mongoose.model('Position', PositionSchema);
