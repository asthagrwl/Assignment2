var Company = require('../models/company');
var Student = require('../models/student');
var Position = require('../models/position');
var Application = require('../models/application');
var Admin = require('../models/admin');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

function createTokenCompany(company) {
    var token = jsonwebtoken.sign({
        id: company._id,
        name: company.name,
        about: company.about,
        email: company.email
    }, secretKey, {
        expiresIn: 1440
    });

    return token;
}

function createTokenStudent(student) {
    var token = jsonwebtoken.sign({
        id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        email: student.email,
        branch: student.branch,
        pointer: student.pointer
    }, secretKey, {
        expiresIn: 1440
    });

    return token;
}

function createTokenAdmin(admin) {
    var token = jsonwebtoken.sign({
        id: admin._id,
        username: admin.username
    }, secretKey, {
        expiresIn: 1440
    });

    return token;
}

module.exports = function(app, express) {

    var api = express.Router();

    api.post('/admin_signup', function(req, res) {

        var admin = new Admin({
            username: req.body.username,
            password: req.body.password

        });
        admin.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({ message: 'Welcome Admin..!!' });
        });
    });

    api.post('/company_signup', function(req, res) {

        var company = new Company({
            name: req.body.name,
            about: req.body.about,
            password: req.body.password,
            email: req.body.email

        });
        company.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            var token = createTokenCompany(company);
            res.json({
                message: "Comapany has been added! successfully Login",
                success: true,
                token: token
            });
        });

    });

    api.post('/student_signup', function(req, res) {

        var student = new Student({
            rollNo: req.body.rollNo,
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            branch: req.body.branch,
            pointer: req.body.pointer

        });
        student.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            var token = createTokenCompany(company);
            res.json({
                message: "Student has been added! successfully Login",
                success: true,
                token: token
            });
        });

    });




    api.post('/company_login', function(req, res) {
        company.findOne({
            email: req.body.email
        }).select('password').exec(function(err, company) {
            if (err) throw err;
            if (!company) {
                res.send({ message: "company does not exist" });
            } else if (company) {
                var validPass = company.comparePassword(req.body.password);
                if (!validPass) {
                    res.send({ message: "Invalid Password..!" });
                } else {
                    var token = createTokenCompany(company);
                    res.json({
                        sucess: true,
                        message: "successfully Login",
                        token: token
                    });
                }
            }
        });
    });

    api.post('/student_login', function(req, res) {
        student.findOne({
            rollNo: req.body.rollNo
        }).select('password').exec(function(err, student) {
            if (err) throw err;
            if (!student) {
                res.send({ message: "student does not exist" });
            } else if (student) {
                var validPass = student.comparePassword(req.body.password);
                if (!validPass) {
                    res.send({ message: "Invalid Password..!" });
                } else {
                    var token = createTokenStudent(student);
                    res.json({
                        sucess: true,
                        message: "successfully Login",
                        token: token
                    });
                }
            }
        });
    });

    api.post('/admin_login', function(req, res) {
        admin.findOne({
            username: req.body.username
        }).select('password').exec(function(err, admin) {
            if (err) throw err;
            if (!admin) {
                res.send({ message: "Admin does not exist" });
            } else if (admin) {
                var validPass = admin.comparePassword(req.body.password);
                if (!validPass) {
                    res.send({ message: "Invalid Password..!" });
                } else {
                    // token
                    var token = createTokenAdmin(admin);
                    res.json({
                        sucess: true,
                        message: "successfully Login",
                        token: token
                    });
                }
            }
        });
    });

    //middleware
    api.use(function(req, res, next) {
        console.log("Somebody just came to our app..!");
        var token = req.body.token || req.param('token') || req.header['x-access-token'];

        //check if token exists
        if (token) {
            jsonwebtoken.verify(token, secretKey, function(err, decoded) {
                if (err) {
                    res.status(403).send({ success: false, message: "Failed to authenticate user" });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({ success: false, message: "No token provided" });
        }
    });

    api.post('/position', function(req, res) {

        var position = new Position({
            companyId: req.decoded.id,
            position: req.body.position,
            salary: req.body.salary,
            companyName: req.decoded.name,
            cutoff: req.body.cutoff,
            selectionProcedure: req.body.selectionProcedure

        });
        position.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({ message: 'Position added successfully..!' });
        });
    });

    api.get('/companies', function(req, res) {
        Company.find({}, function(err, company) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(company);
        });
    });

    api.post('/apply', function(req, res) {

        var application = new Application({
            rollNo: req.decoded.rollNo,
            email: req.decoded.email,
            branch: req.decoded.branch,
            pointer: req.decoded.pointer,
            position: req.body.position,
            companyName: req.body.companyName,
            comapanyId: req.body.comapanyId

        });
        application.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({ message: 'Application added successfully..!' });
        });
    });



    api.route('/company_home')
        .post(function(req, res) {
            var company = new Company({
                creator: req.decoded.id,
                content: req.body.content,
            });
            story.save(function(err) {
                if (err) {
                    res.send(err);
                    return
                }
                res.json({ message: "New Story Created!" });

            });
        })

    .get(function(req, res) {
        Story.find({ creator: req.decoded.id }, function(err, stories) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(stories);
        });
    });

    api.get('/me', function(req, res) {
        res.json(req.decoded);
    });

    return api
}
