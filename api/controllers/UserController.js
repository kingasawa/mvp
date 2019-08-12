const passport = require('passport')

module.exports = {
  index: async (req, res) => {
    res.json(req.session)
    // console.log('sails.config', sails.config);
  }
}
