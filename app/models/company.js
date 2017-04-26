var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var CompanySchema = new Schema({
    name: String,
    about: String,
    email: { type: String, required: true, index: { unique: true } },
    password: String
});

CompanySchema.pre('save', function(next) {
    var company = this;
    if (!company.isModified('password'))
        return next();
    bcrypt.hash(company.password, null, null, function(err, hash) {
        if (err)
            return next(err);
        company.password = hash;
        next();
    });
});
CompanySchema.methods.comparePassword = function(password) {
    var company = this;
    return bcrypt.compareSync(password, company.password);
}


module.exports = mongoose.model('Company', CompanySchema);
