const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
// const GoogleStrategy = require('passport-google').Strategy;
const bcrypt = require('bcrypt-nodejs');
const request = require('request');

const facebooVerifyHandler = (req, token, tokenSecret, profile, done) => {

  process.nextTick(() => {
    const url = `https://graph.facebook.com/v2.4/me?access_token=${token}&fields=id,name,email,first_name,last_name,gender`;

    const options = {method: 'GET', url: url, json: true};
    request(options, (err, response) => {
      if (err) {
        return done(null, null);
      }

      console.log('response', response);
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
  clientID: '2294849067431963',
  clientSecret: 'a039601d5ed54717d54896481c7fea6a',
  callbackURL: 'http://localhost:1337/auth/facebook/callback',
  passReqToCallback: true
}, facebooVerifyHandler));
