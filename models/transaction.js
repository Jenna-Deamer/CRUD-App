let mongoose = require('mongoose');

// define transaction model
let transaction = new mongoose.Schema({
    //users will choose the type of transaction
    type:{
        type: String,
        enum: ['Expense','Income'],
        required: true
    },
    name:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
      },
      description:{
        type: String,
        maxlength: 100 
      }
});


// make the model public so the controllers can use it
module.exports = mongoose.model('Transaction', transaction);