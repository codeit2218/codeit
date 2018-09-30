//requiring external modules
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cookieParser = require('cookie-parser');
const session = require('express-session');
var multer = require('multer');
var fs = require("fs");
const url = 'mongodb://codeit2218:codeit123@ds239692.mlab.com:39692/codeit';


//requiring internal modules
var usersRouter = require("./routes/users.js");

//middleware
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'sssshhhhh'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//routes middleware (do not use this now - some error)
//app.use('/users', usersRouter);

var error = 0;

app.get("/dashboard", function(req, res) {
    if (req.session.uid)
        res.render("dashboard");
    else
        res.redirect('./');
});

app.get("/courses", function(req, res) {
    if (req.session.uid)
        res.render("courses");
    else
        res.redirect('./');
});

app.get("/quickNotes", function(req, res) {
    if (req.session.uid)
        res.render("quick-notes");
    else
        res.redirect('./');
});

app.get("/quiz", function(req, res) {
    if (req.session.uid)
        res.render("quiz_general");
    else
        res.redirect('./');
});
app.get('/requestQuestion', function(req, res) {
    var t = [{
            q: 10,
            a: 11,
            b: 12,
            c: 13,
            d: 14,
            ans: 1
        },
        {
            q: 20,
            a: 21,
            b: 22,
            c: 23,
            d: 24,
            ans: 4
        },
        {
            q: 30,
            a: 31,
            b: 32,
            c: 33,
            d: 34,
            ans: 3
        },
        {
            q: 40,
            a: 41,
            b: 42,
            c: 43,
            d: 44,
            ans: 2
        }
    ];
    res.send(t);
});

app.get("/course", function(req, res) {
    if (req.session.uid)
        res.render("course_template");
    else
        res.redirect('./');
});

app.post("/signup", function(req, response) {

    //getting the values from the form
    var name = req.body.name;
    var phn = req.body.phn;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var repwd = req.body.repwd;
    var description = req.body.description;
    var points = 0;

    var flag = true;


    //form validation
    if (password != repwd || !(/^[0-9]{10}$/.test(phn)))
        flag = false;
    else {
        MongoClient.connect(url, function(err, db) {
            //            if (err) throw err;
            var dbo = db.db("codeit");
            dbo.collection('users').findOne({
                username: username
            }, function(err, result) {
                //        if (err) throw err;
                if (result) {
                    error = 2;
                    response.redirect('./');
                } else {
                    MongoClient.connect(url, function(err1, db1) {
                        //                if (err1) throw err;
                        var dbo1 = db1.db("codeit");
                        dbo1.collection('users').insertOne({
                            name: name,
                            phn: phn,
                            username: username,
                            email: email,
                            password: password,
                            description: description,
                            points: points
                        }, function(err, res) {
                            if (err) {
                                db1.close();
                            }
                            // Success
                            error = 3;
                            response.redirect('/');
                            db1.close();
                        });
                    });
                }
                // Success
                console.log(error);
                db.close();
            });
        });
    }
});



app.post("/login", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("codeit");
        dbo.collection("users").findOne({
            $and: [{
                email: email
            }, {
                password: password
            }]
        }, function(err, result) {
            if (err) throw err;
            if (result) {
                req.session.uid = result.username;
                res.redirect('/dashboard');
            } else {
                error = 1;
                res.redirect('./');
            }
            db.close();
        });
    });

});

app.get('/getUserName', function(req, res) {
    console.log('reached here bro why the hell');
    res.send(req.session);
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('./');
});


//PHOTO VALLIDATION AND STORAGE
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/profileFiles')
    },
    filename: function(req, file, cb) {
        console.log("file name changed");
        cb(null, (req.session.uid + '.jpeg'));
    }

})
var middleware = function(req, res, next) {
    console.log("we are here in middleware");
    console.log(req.file);
    next();
}
var saved = false;
var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        saved = false;
        console.log('this function not called why');
        if (file.mimetype == "image/jpeg") {
            console.log('image saved line 204');
            saved = true;
            cb(null, true);
        } else {
            console.log('invalid file');
            saved = false;
            cb(null, false);
        }

    },
    limits: {
        fileSize: 1024 * 1024
    }
});

var uploaded = null;
app.post('/photoValidation', upload.single('avatar'), middleware, function(req, res, next) {

    upload.single('avatar')(req, res, function(err) {
        if (err) {
            console.log('error has happened 234');
            uploaded = false;
        }
    })
    if (saved == false) {
        uploaded = false;

    } else {
        console.log('we reached in validation which was successful');
        uploaded = true;

    }

    setTimeout(function() {
        res.render('dashboard.ejs');
    }, 2000);
});



app.get('/getProfilePhoto', function(req, res) {

    var path = __dirname + '/public/profileFiles/' + req.session.uid + '.jpeg';
    console.log(path + '        260');

    if (fs.existsSync(path)) {
        console.log("file was present")
        res.send({
            path: ('profileFiles/' + req.session.uid + '.jpeg'),
            present: true
        })
    } else {
        console.log('we were here when no file present');
        res.send({
            path: "",
            present: false
        });
    }

});




app.get('/', function(req, res) {
    var t = "";
    console.log(error);
    if (error == 1)
        t = "404"
    if (error == 2)
        t = "500"
    if (error == 3)
        t = "200";
    var error1 = {
        error: t
    };
    error = 0;
    res.render('index', error1);
});


//server listening
app.listen(3000, function() {
    console.log("Server is listening on port 3000");
});



module.exports = app;