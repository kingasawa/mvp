const passport = require('passport')

module.exports = {
  login: async(req, res) => {
    passport.authenticate('local', (err, user, info) => {
      if((err) || (!user)) {
        return res.send({
          message: info.message,
          user
        });
      }
      req.logIn(user, (err) => {
        if(err) res.send(err);
        req.session.user = user;
        return res.send({
          message: info.message,
          user
        });
      });
    })(req, res)
  },

  google: async (req, res, next) => {
    const scopeAccess = 'openid profile email'
    passport.authenticate('google', {
      scope: scopeAccess
    })(req, res, next)
  },

  googleCallback: async(req, res, next) => {
    passport.authenticate('google', (err, user) => {
      res.json(user);
    })(req, res, next);
  },

  facebook: async (req, res, next) => {
    console.log('facebook login');
    passport.authenticate('facebook')(req, res, next)
  },

  facebookCallback: async(req, res, next) => {
    passport.authenticate('facebook', (err, user) => {
      res.json(user);
    })(req, res, next);
  },

  register: async(req, res) => {
    let registerData = req.allParams()
    User.createAccount(registerData).then((register)=>{
      console.log('controller userRegister', register);
      res.json(register);
    })
  },

  logout: async(req, res) => {
    req.logout()
    res.redirect('/')
  },

}
