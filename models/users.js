const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

let UserSchema = mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    created_date: {
       type: Date,
       default: Date.now
    },
    role:{
      type: [{
        type: String,
        enum: ['ADMIN', 'USER', 'MODERATOR']
      }],
      default: ['USER']
    },
    todos: [{
      name: String,
      desc: String,
      created_date:{type: Date, default: Date.now },
      due_date: Date,
      completed: Boolean,
      priority: Number,
      category: String
    }]
});

let User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByID = function (id, callback) {
    User.findById(id, callback);
};
module.exports.getUserByUserame = function (username, callback) {
    let query = { username: username };
    User.findOne(query, callback);
};
module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}
