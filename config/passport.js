const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt-nodejs');
const request = require('request');
const { custom } = require('./custom.js');

const { facebookGraphUrl, baseUrl, GOOGLE_CLIENT_KEY, GOOGLE_SECRET_KEY, FACEBOOK_CLIENT_KEY, FACEBOOK_SECRET_KEY } = custom

const facebooVerifyHandler = (req, token, tokenSecret, profile, done) => {
  process.nextTick(() => {
    const url = `${facebookGraphUrl}/me?access_token=${token}&fields=id,name,email,first_name,last_name,gender`;

    const options = {method: 'GET', url: url, json: true};
    request(options, (err, response) => {
      if (err) {
        return done(null, null);
      }
      const data = {
        id: response.body.id,
        first_name: response.body.first_name,  //jshint ignore:line
        last_name: response.body.last_name,    //jshint ignore:line
        email: response.body.email,
        gender: response.body.gender
      };

      return done(null, data);
    });
  });
};

const googleVerifyHandler = function (accessToken, refreshToken, profile, cb, done) {

  console.log('cb', cb);
  const data = {
    id: cb.id,
    name: cb.displayName,
    email: cb.emails[0].value,
    emailVerified: cb.emails[0].verified
  };

  return done(null, data);
};

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({id},(err, users) => {
    cb(err, users);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, cb) => {
  User.findOne({username: username}, (err, user) => {
    if(err) return cb(err);
    if(!user) return cb(null, false, {message: 'Username not found'});
    bcrypt.compare(password, user.password, (err, res) => {
      if(!res) return cb(null, false, { message: 'Invalid Password' });
      let userDetails = {
        email: user.email,
        username: user.username,
        id: user.id
      };
      return cb(null, userDetails, { message: 'Login Succesful'});
    });
  });
})
)

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_CLIENT_KEY,
  clientSecret: FACEBOOK_SECRET_KEY,
  callbackURL: `${baseUrl}/auth/facebook/callback`,
  passReqToCallback: true
}, facebooVerifyHandler));

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_KEY,
  clientSecret: GOOGLE_SECRET_KEY,
  callbackURL: `${baseUrl}/auth/google/callback`,
  passReqToCallback: true
}, googleVerifyHandler));
