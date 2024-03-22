const mongoose = require("mongoose");
const moment = require("moment");

// define transaction model
const transaction = new mongoose.Schema({
  //users will choose the type of transaction
  type: {
    type: String,
    enum: ["Expense", "Income"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    //Moment.js allows for easy date formatting.
    //reducing the amount of code I'd to write to get this format
    default: () => moment().format("MM-DD-YYYY"),
  },
  description: {
    type: String,
    maxlength: 100,
  },
  //Label transactions by user
  user: {
    // representing unique identifiers for documents in other collections.
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference the user model
  },
});

// make the model public so the controllers can use it
module.exports = mongoose.model("Transaction", transaction);
