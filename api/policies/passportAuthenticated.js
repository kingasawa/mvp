module.exports = function(req, res, next) {
  console.log('isAuthenticated', req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  else{
    return res.status(400).send({err: 'E_UNAUTHENTICATED', message: 'Please login!'});
    // return res.redirect('/login')
  }
};
