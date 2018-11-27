
var app = require("../../express");
var userModel = require("../model/user/user.model.server");
var multer = require('multer'); // npm install multer --save
var upload = multer({ dest: __dirname+'/../../public/uploads' });
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require("bcrypt-nodejs");
var googleConfig = {
    clientID     : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL  : process.env.GOOGLE_CALLBACK_URL
};

passport.use(new GoogleStrategy(googleConfig, googleStrategy));

var facebookConfig = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
};

passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

passport.use(new LocalStrategy(localStrategy));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

// http handlers:
app.get("/api/users", getAllUsers);
app.get("/api/user/:userId", findUserById);
app.get("/api/user/:userId/following", findFollowingForUser);
app.get("/api/user/:userId/followers", findFollowersForUser);



app.post("/api/user/:userId/following/:followId", followUser);
app.get("/api/user", findUserByCredentials);
app.post("/api/login", passport.authenticate('local'), login);
app.get("/api/loggedin", loggedin);
app.delete("/api/logout", logout);
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/#!/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/#!/user');
    });

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/#!/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/#!/user');
    });

app.post("/api/user", createUser);
app.delete("/api/user/:userId", deleteUser);
app.delete("/api/user/:userId/following/:followId", unfollowUser);
app.put("/api/user/:userId", updateUser);
app.post ("/api/upload", upload.single('myFile'), uploadImage);

function getAllUsers(req, res) {
    userModel.getAllUsers()
        .then(function (users) {
            res.json(users);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function createUser(req, res) {
    var user = req.body;
    user.password = bcrypt.hashSync(user.password);
    userModel.createUser(user)
        .then(function (user) {
            res.json(user);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findUserById(req, res) {
    userModel.findUserById(req.params.userId)
        .then(function (user) {
            res.json(user);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findFollowingForUser(req, res) {
    userModel.findFollowingForUser(req.params.userId)
        .then(function (user) {
            res.json(user.following);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findFollowersForUser(req, res) {
    userModel.findFollowersForUser(req.params.userId)
        .then(function (user) {
            res.json(user.followers);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function followUser(req, res) {
    var followId = req.params.followId;
    userModel.followUser(req.params.userId, followId)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function unfollowUser(req, res) {
    var followId = req.params.followId;
    userModel.unfollowUser(req.params.userId, followId)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findUserByCredentials(req, res) {

    var username = req.query.username;
    var password = req.query.password;

    if(username && password){
        userModel.findUserByCredentials(username, password)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }
    else if(username){
        userModel.findUserByUsername(username)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }
}

function localStrategy(username, password, done) {

    userModel.findUserByUsername(username)
        .then(function (user) {
            if(!user){
                return done(null, false);
            }
            if(user && bcrypt.compareSync(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }, function (err) {
            if(err) {
                return done(err);
            }
        });
}

function googleStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByGoogleId(profile.id)
        .then(
            function(user) {
                if(user) {
                    return done(null, user);
                } else {
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var newGoogleUser = {
                        username:  emailParts[0],
                        firstName: profile.name.givenName,
                        lastName:  profile.name.familyName,
                        email:     email,
                        google: {
                            id:    profile.id,
                            token: token
                        }
                    };
                    return userModel.createUser(newGoogleUser);
                }
            },
            function(err) {
                if (err) { return done(err); }
            }
        )
        .then(
            function(user){
                return done(null, user);
            },
            function(err){
                if (err) { return done(err); }
            }
        );
}

function facebookStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByFacebookId(profile.id)
        .then(
            function(user) {
                if(user) {
                    return done(null, user);
                } else {
                    var name = profile.displayName.replace(" ", "");
                    var fullname = profile.displayName.split(" ");
                    var newFacebookUser = {
                        username:  name,
                        firstName: fullname[0],
                        lastName:  fullname[1],
                        // email:     email,
                        facebook: {
                            id:    profile.id,
                            token: token
                        }
                    };
                    return userModel.createUser(newFacebookUser);
                }
            },
            function(err) {
                if (err) { return done(err); }
            }
        )
        .then(
            function(user){
                return done(null, user);
            },
            function(err){
                if (err) { return done(err); }
            }
        );
}

function login(req, res) {
    var user = req.user;
    res.json(user);
}

function logout(req, res) {
    req.logOut();
    res.sendStatus(200);
}

function loggedin(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
}

function updateUser(req, res) {
    var user = req.body;
    var userId = req.params.userId;
    userModel.updateUser(userId, user)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        })
}


function deleteUser(req, res) {
    var userId = req.params.userId;
    userModel.deleteUser(userId)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        })
}

function uploadImage(req, res) {

    var myFile        = req.file;
    var userId = req.body.userId;

    var originalname  = myFile.originalname; // file name on user's computer
    var filename      = myFile.filename;     // new file name in upload folder
    var path          = myFile.path;         // full path of uploaded file
    var destination   = myFile.destination;  // folder where file is saved to
    var size          = myFile.size;
    var mimetype      = myFile.mimetype;

    var user = null;
    userModel.findUserById(userId)
        .then(function (response) {
            user = response;
            user.pictureUrl = '/uploads/'+filename;
            userModel.updateUser(userId, user)
                .then(function (user) {
                });
        });

    var callbackUrl = "/#!/user";

    res.redirect(callbackUrl);
}

function serializeUser(user, done) {
    done(null, user);
}

function deserializeUser(user, done) {
    userModel
        .findUserById(user._id)
        .then(
            function(user){
                done(null, user);
            },
            function(err){
                done(err, null);
            }
        );
}
