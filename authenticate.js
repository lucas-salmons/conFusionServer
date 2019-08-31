var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
//jwt encode information in a token to pass to the client
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); //create,sign and verify tokens

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey,
        { expiresIn: 7200 });//extended duration for workshop testing purposes
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', { session: false });

//verify admin
exports.verifyAdmin = function (req, res, next) {
    // (err, user) is introduced with passport via verifyUser
    if (req.user.admin === true) {
        next();
    }
    else {
        //user is not admin
        var err = new Error('You are not authorized to perform operation!');
        err.status = 403;
        return next(err);
    }
};
