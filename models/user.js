const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const user = new mongoose.Schema({
    username: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8 
    }
});

//model extends Passport Local Mongoose for auth
user.plugin(plm);

//make public
module.exports = mongoose.model('User', user);