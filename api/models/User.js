/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt-nodejs');

module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    }
  },
  // customToJSON: () => {
  //   return _.omit(this, ['password'])
  // },

  beforeCreate: (user, cb) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if(err) {return cb(err);}
        user.password = hash;
        return cb();
      });
    });
  },

  checkExisted:async(email) => await User.findOne({email}),

  createAccount: async(registerData) => {
    const { email } = registerData
    const existedEmail = await User.checkExisted(email);
    if(existedEmail) return {error:'Found existing user', data:'abc'}

    const createdUser = await User.create(registerData).fetch();
    delete createdUser.password;
    return {success:'Created new user ', data:createdUser}
  }
}
