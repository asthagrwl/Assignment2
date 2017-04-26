var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentSchema = new Schema({

	rollNo: {type : String, required : true, index: {unique : true}},
	name: String,
	password: String,
	email: String,
	branch: String,
	pointer: Number

});

StudentSchema.pre('save',function(next){
  var student= this;
  if(!student.isModified('password'))
    return next();
  bcrypt.hash(student.password,null,null,function(err,hash){
    if(err)
      return next(err);
    student.password= hash;
    next();
  });
});

StudentSchema.methods.comparePassword = function(password){
  var student= this;
  return bcrypt.compareSync(password,student.password);
}

module.exports= mongoose.model('Student', StudentSchema);
